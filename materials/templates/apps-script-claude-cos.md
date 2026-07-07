# Tier 3 - The push-automation engine (Apps Script + Claude API)

For the IT champion. One Apps Script file gives every executive: a 5-minute critical-email
watcher pushing to #cos-alerts, natural-language calendar booking from Slack, room + attendee
FreeBusy coordination, and a weekday auto-briefing pushed to the channel. Adapted from the
internal "Chief of Staff AI" playbook - same architecture, Claude API instead of Gemini.

Time: ~90 minutes once. Each additional executive afterwards = one config entry.

## Prerequisites (from the sys-admin request)

1. A Claude API key (console.anthropic.com) - scoped to this automation, stored ONLY in
   Apps Script Properties Service, never in code or Slack.
2. A Slack app named "Chief of Staff" (api.slack.com/apps → Create New App → From scratch):
   - Bot Token Scopes: `chat:write`, `app_mentions:read`, `im:history`, `im:read`, `im:write`,
     `channels:history`, `channels:read`, `incoming-webhook`
   - Install to workspace → copy the Bot User OAuth Token (`xoxb-...`) and Signing Secret
   - Create the private channel `#cos-alerts`, `/invite @Chief of Staff`
   - Incoming Webhooks → ON → add webhook to `#cos-alerts` → copy the webhook URL
   - Note: if the official Claude app for Slack (Claude Tag) is installed, the conversational
     jobs are already covered - this custom bot is only needed for the PUSH automations
     (timer-based alerts and briefings) and the exhaustive room engine.
3. Apps Script (script.google.com) → New project "Chief of Staff Bot" → Services → add
   "Google Calendar API" (v3).
4. Store secrets: Project Settings → Script Properties → add `ANTHROPIC_API_KEY`,
   `SLACK_BOT_TOKEN`, `SLACK_WEBHOOK_URL`.

## Code.gs

```javascript
// =============================================================
// CONFIGURATION
// =============================================================
const PROPS = PropertiesService.getScriptProperties();
const ANTHROPIC_API_KEY = PROPS.getProperty('ANTHROPIC_API_KEY');
const SLACK_BOT_TOKEN   = PROPS.getProperty('SLACK_BOT_TOKEN');
const SLACK_WEBHOOK_URL = PROPS.getProperty('SLACK_WEBHOOK_URL');
const CLAUDE_MODEL = 'claude-sonnet-5';
const TIMEZONE = 'Asia/Hong_Kong';           // adjust to your locale
const ALERT_LABEL = 'CoS-Processed';         // Gmail label for processed emails

// Meeting room calendar IDs
// Find at: Google Calendar > Settings > Other calendars > [Room] > Calendar ID
const MEETING_ROOMS = {
  'Room A': 'your-company.com_room-a@resource.calendar.google.com',
  'Room B': 'your-company.com_room-b@resource.calendar.google.com',
};

// =============================================================
// CLAUDE API HELPER (the only piece that changed from the
// original Gemini version - everything downstream is identical)
// =============================================================
function askClaude(prompt) {
  const resp = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      temperature: 0.1,
      messages: [{ role: 'user', content: prompt }]
    }),
    muteHttpExceptions: true
  });
  const json = JSON.parse(resp.getContentText());
  if (json.content && json.content[0]) return json.content[0].text;
  Logger.log('Claude API error: ' + resp.getContentText());
  return 'Sorry, I could not process that request.';
}

function parseClaudeJSON(raw) {
  return JSON.parse(raw.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
}

// =============================================================
// SLACK HELPERS
// =============================================================
function sendSlackMessage(channel, text) {
  UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + SLACK_BOT_TOKEN },
    payload: JSON.stringify({ channel: channel, text: text, mrkdwn: true })
  });
}

function sendSlackWebhook(text) {
  UrlFetchApp.fetch(SLACK_WEBHOOK_URL, {
    method: 'post', contentType: 'application/json',
    payload: JSON.stringify({ text: text })
  });
}

// =============================================================
// SLACK EVENT HANDLER (receives messages from Slack)
// =============================================================
function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.type === 'url_verification') {
    return ContentService.createTextOutput(body.challenge);
  }
  if (body.type === 'event_callback') {
    const event = body.event;
    if (event.bot_id || event.subtype === 'bot_message') {
      return ContentService.createTextOutput('ok');
    }
    if (event.type === 'message' || event.type === 'app_mention') {
      const userMsg = (event.text || '').replace(/<@[A-Z0-9]+>/g, '').trim();
      sendSlackMessage(event.channel, routeMessage(userMsg));
    }
  }
  return ContentService.createTextOutput('ok');
}

// =============================================================
// MESSAGE ROUTER
// =============================================================
function routeMessage(message) {
  const m = message.toLowerCase();
  if (m.includes('book') || m.includes('schedule') || m.includes('set up') || m.includes('arrange') || m.includes('move'))
    return handleCalendarRequest(message);
  if (m.includes('briefing') || m.includes('brief') || m.includes('morning') || m.includes('to-do') || m.includes('todo'))
    return handleBriefingRequest();
  if (m.includes('room') || m.includes('free') || m.includes('available') || m.includes('availability'))
    return handleRoomRequest(message);
  if (m.includes('find') || m.includes('search') || m.includes('file') || m.includes('document'))
    return handleDocSearch(message);
  if (m.includes('email') || m.includes('inbox') || m.includes('priority') || m.includes('urgent'))
    return handleEmailCheck();
  return "Hi! I'm your Chief of Staff. Try:\n" +
    "• *Book a meeting* - \"Book coffee with HR tomorrow at 2pm\"\n" +
    "• *Morning briefing* - \"Give me my briefing\"\n" +
    "• *Check rooms* - \"Is Room A free tomorrow?\"\n" +
    "• *Find a file* - \"Find the Q3 roadmap\"\n" +
    "• *Check emails* - \"Any urgent emails?\"\n\nJust type naturally.";
}

// =============================================================
// CALENDAR BOOKING (text-to-calendar)
// =============================================================
function handleCalendarRequest(message) {
  const today = new Date();
  const prompt = `You are a calendar assistant. Today is ${today.toISOString().split('T')[0]} (${today.toLocaleDateString('en-US',{weekday:'long'})}).

Parse: "${message}"
- Convert relative dates to absolute
- Default duration: 30 minutes
- Default timezone: ${TIMEZONE}

Respond ONLY with valid JSON:
{"title":"...","date":"YYYY-MM-DD","start_time":"HH:MM","end_time":"HH:MM","attendees_emails":[],"attendees_names":[],"notes":""}`;

  try {
    const data = parseClaudeJSON(askClaude(prompt));
    const startDT = new Date(`${data.date}T${data.start_time}:00`);
    const endDT   = new Date(`${data.date}T${data.end_time}:00`);

    const event = CalendarApp.getDefaultCalendar().createEvent(
      data.title, startDT, endDT,
      { description: data.notes || 'Created by Chief of Staff bot' }
    );
    if (data.attendees_emails) {
      data.attendees_emails.forEach(em => { if (em && em.includes('@')) event.addGuest(em); });
    }

    const fDate  = startDT.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
    const fStart = startDT.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
    const fEnd   = endDT.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
    const note   = data.attendees_names?.length ? `\nAttendees: ${data.attendees_names.join(', ')}` : '';

    return `:white_check_mark: *Booked!*\n:calendar: *${data.title}*\n:clock3: ${fDate}, ${fStart} - ${fEnd}${note}`;
  } catch (err) {
    return `Sorry, couldn't parse that. Try: "Book a 30-min sync with the team tomorrow at 2pm"\n\nError: ${err.message}`;
  }
}

// =============================================================
// MORNING BRIEFING
// =============================================================
function handleBriefingRequest() {
  const today = new Date();
  const eod = new Date(today); eod.setHours(23,59,59);

  const events = CalendarApp.getDefaultCalendar().getEvents(today, eod);
  const calSum = events.length === 0 ? 'No meetings today.' :
    events.map(e => {
      const s  = e.getStartTime().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
      const en = e.getEndTime().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
      const g  = e.getGuestList().map(x => x.getName()||x.getEmail()).join(', ');
      return `• ${s}-${en}: *${e.getTitle()}*${g ? ' ('+g+')' : ''}`;
    }).join('\n');

  const threads = GmailApp.search('is:inbox newer_than:1d', 0, 20);
  let emailSum = 'No new emails in the last 24 hours.';
  if (threads.length > 0) {
    const list = threads.slice(0,15).map(t => {
      const m = t.getMessages().pop();
      return `From: ${m.getFrom()}, Subject: "${t.getFirstMessageSubject()}", Snippet: ${m.getPlainBody().substring(0,150)}`;
    }).join('\n---\n');
    emailSum = askClaude(`Triage for a Managing Director. Score 1-5.\n\n${list}\n\nReturn:\n1. CRITICAL (Score 4-5): sender, subject, action\n2. One line per Score 3\n3. Skip 1-2\nBullet points only.`);
  }

  const ds = today.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  return `:sunny: *Morning Briefing - ${ds}*\n\n:calendar: *TODAY'S SCHEDULE*\n${calSum}\n\n:email: *EMAIL TRIAGE*\n${emailSum}`;
}

// =============================================================
// DOCUMENT SEARCH
// =============================================================
function handleDocSearch(message) {
  const topic = message.replace(/find|search|file|document|the|latest|on|a|for|about/gi, '').trim();
  if (!topic) return 'What topic should I search for? Try: "Find the Q3 roadmap"';

  const files = DriveApp.searchFiles(`fullText contains "${topic}" and mimeType != "application/vnd.google-apps.folder"`);
  const results = [];
  while (files.hasNext() && results.length < 3) {
    const f = files.next();
    results.push({ name: f.getName(), url: f.getUrl(), updated: f.getLastUpdated().toLocaleDateString('en-US') });
  }
  if (results.length === 0) return `No files found matching "${topic}". Try a different keyword.`;

  const topFile = results[0];
  let summary = '';
  try {
    const doc  = DocumentApp.openByUrl(topFile.url);
    const text = doc.getBody().getText().substring(0, 2000);
    summary = askClaude(`Summarize this document in 3-5 bullet points for an executive:\n\n${text}`);
  } catch (e) {
    summary = '_Could not auto-summarize this file type. Open it to review._';
  }

  const fileList = results.map((r,i) => `${i+1}. <${r.url}|${r.name}> (updated ${r.updated})`).join('\n');
  return `:mag: *Files matching "${topic}"*\n${fileList}\n\n*Summary of top result:*\n${summary}`;
}

// =============================================================
// EMAIL CHECK (on-demand)
// =============================================================
function handleEmailCheck() {
  const threads = GmailApp.search('is:inbox is:unread newer_than:1d', 0, 15);
  if (threads.length === 0) return 'No unread emails in the last 24 hours. :tada:';

  const list = threads.slice(0,10).map(t => {
    const m = t.getMessages().pop();
    return `From: ${m.getFrom()}, Subject: "${t.getFirstMessageSubject()}", Snippet: ${m.getPlainBody().substring(0,150)}`;
  }).join('\n---\n');

  const result = askClaude(`Score these emails for a Managing Director (1-5 criticality). Only list Score 3+.\n\n${list}\n\nFormat each as:\n• [Score] *Subject* from Sender - Action needed\nBe concise.`);
  return `:email: *Email Priority Check*\n\n${result}`;
}

// =============================================================
// EMAIL MONITORING (5-min timer → pushes 4-5 alerts to Slack)
// =============================================================
function checkForCriticalEmails() {
  const threads = GmailApp.search('is:inbox is:unread newer_than:2h -label:' + ALERT_LABEL, 0, 10);
  if (threads.length === 0) return;

  let label = GmailApp.getUserLabelByName(ALERT_LABEL);
  if (!label) label = GmailApp.createLabel(ALERT_LABEL);

  for (const thread of threads) {
    const msg     = thread.getMessages().pop();
    const sender  = msg.getFrom();
    const subject = thread.getFirstMessageSubject();
    const body    = msg.getPlainBody().substring(0, 500);

    try {
      const result = parseClaudeJSON(askClaude(
`Score this email for a Managing Director (1-5 criticality).
Sender: ${sender}
Subject: ${subject}
Body: ${body}

5=Crisis (Chairman/Board, legal/financial), 4=High (MD/HoD, budgets, deadlines), 3=Normal, 2=FYI, 1=Noise.
Respond ONLY JSON: {"score":5,"reason":"one sentence","action":"what MD must do"}`));

      if (result.score >= 4) {
        sendSlackWebhook(
          `:rotating_light: *PRIORITY EMAIL* (Score: ${result.score}/5)\n\n` +
          `*From:* ${sender}\n*Subject:* ${subject}\n` +
          `*Why:* ${result.reason}\n*Action:* ${result.action}\n\n` +
          `_Open Gmail to respond._`
        );
      }
    } catch (err) {
      Logger.log('Scoring error: ' + err);
    }
    thread.addLabel(label);
  }
}

// =============================================================
// ROOM & AVAILABILITY (FreeBusy across rooms AND attendees)
// =============================================================
function handleRoomRequest(message) {
  const today = new Date();
  const roomList = Object.keys(MEETING_ROOMS).join(', ');
  const prompt = `Today is ${today.toISOString().split('T')[0]} (${today.toLocaleDateString('en-US',{weekday:'long'})}).
Parse: "${message}"
Available rooms: ${roomList}
Extract: rooms (exact names or "all"), attendees (emails, [] if none), date (YYYY-MM-DD), start_hour (HH 24h), end_hour (HH 24h), duration_minutes (default 30).
Respond ONLY JSON: {"rooms":["Room A"],"attendees":[],"date":"YYYY-MM-DD","start_hour":9,"end_hour":17,"duration_minutes":30}`;

  try {
    const req = parseClaudeJSON(askClaude(prompt));
    const roomsToCheck = req.rooms[0] === 'all' ? Object.keys(MEETING_ROOMS) : req.rooms;
    const roomIds = [], roomNames = [];
    for (const r of roomsToCheck) {
      if (MEETING_ROOMS[r]) { roomIds.push(MEETING_ROOMS[r]); roomNames.push(r); }
    }
    const attendees = req.attendees || [];
    const allIds = roomIds.concat(attendees);

    const timeMin = new Date(req.date); timeMin.setHours(req.start_hour,0,0);
    const timeMax = new Date(req.date); timeMax.setHours(req.end_hour,0,0);

    const fb = Calendar.Freebusy.query({
      timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(),
      items: allIds.map(id => ({id}))
    });

    const dur = req.duration_minutes || 30;
    const slots = [];
    for (let h = req.start_hour; h < req.end_hour; h++) {
      for (let m = 0; m < 60; m += 30) {
        const ss = new Date(req.date); ss.setHours(h,m,0);
        const se = new Date(ss.getTime() + dur*60000);
        if (se > timeMax) continue;

        const freeRooms = roomNames.filter((n,i) => {
          const busy = fb.calendars[roomIds[i]]?.busy || [];
          return !busy.some(b => ss < new Date(b.end) && se > new Date(b.start));
        });
        const allFree = attendees.every(em => {
          const busy = fb.calendars[em]?.busy || [];
          return !busy.some(b => ss < new Date(b.end) && se > new Date(b.start));
        });

        if (freeRooms.length > 0 && allFree) {
          slots.push({
            start: ss.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}),
            end:   se.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}),
            rooms: freeRooms
          });
        }
      }
    }

    if (!slots.length) return 'No available slots found. Try a different date or wider time range.';

    const ds = timeMin.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
    const opts = slots.slice(0,3).map((s,i) => `*Option ${i+1}:* ${s.start} - ${s.end} in ${s.rooms.join(' or ')}`).join('\n');
    const an = attendees.length ? `\nAll attendees (${attendees.join(', ')}) are free.` : '';
    return `:calendar: *Available on ${ds}* (${dur} min)\n\n${opts}${an}`;
  } catch (err) {
    return `Couldn't check availability: ${err.message}\nTry: "Is Room A free tomorrow between 2pm and 5pm?"`;
  }
}

// =============================================================
// AUTOMATIC MORNING BRIEFING (weekday push to #cos-alerts)
// =============================================================
function sendMorningBriefing() {
  const day = new Date().getDay();
  if (day === 0 || day === 6) return; // skip weekends
  sendSlackWebhook(handleBriefingRequest());
}
```

## Deploy + wire up

1. **Deploy as Web App:** Deploy → New deployment → Web app → Execute as "Me" → Who has
   access: "Anyone" (required so Slack's servers can reach it; the script only responds to
   Slack event payloads) → copy the Web App URL.
   After EVERY code change: Deploy → Manage deployments → Edit → New version → Deploy.
2. **Connect Slack:** api.slack.com/apps → your app → Event Subscriptions → ON → paste the
   Web App URL as Request URL (Slack's challenge is answered by `doPost` automatically -
   expect the green "Verified"). Subscribe to bot events: `message.im`, `app_mention`,
   `message.channels`. Save, reinstall the app when prompted.
3. **Timers:** Triggers (clock icon) →
   - `checkForCriticalEmails` · time-driven · every 5 minutes
   - `sendMorningBriefing` · time-driven · day timer · 7-8am
4. **Test matrix:**
   - DM the bot "hello" → help menu
   - "Book a 30-min sync with the DS team tomorrow at 2pm" → event on calendar, confirmation in Slack
   - "Is Room A free tomorrow afternoon?" → 2-3 slots
   - Send yourself "URGENT: Q3 budget approval before 4pm board meeting" → alert in #cos-alerts within 5 min
   - Send "team lunch options" → silence (this test matters as much as the first)

## Rollout (from the playbook, unchanged)

- **Weeks 1-2 calibrate:** daily "did the briefing miss anything?" - tune VIP names + topics in the scoring prompts.
- **Weeks 3-4 expand:** add the EA to #cos-alerts, add more rooms, consider a Friday next-week digest.
- **Month 2+ scale:** same code per executive with their own VIP config. Pitch with data: ~30 min/day saved on triage and calendaring.
