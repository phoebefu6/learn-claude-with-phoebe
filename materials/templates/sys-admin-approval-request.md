# Sys-admin approval request (Session 2)

Copy, adjust the bracketed parts, send. Three approvals unlock the whole chief-of-staff workflow.

```
Subject: Enable Claude connectors for the exec team - 3 items

Hi [admin name],

Following the Claude onboarding session, [N] of us on the senior team want to run the
"chief of staff" workflow (morning briefing, email triage, document search) on our
existing Claude Teams plan. Three requests:

1. Enable the Google Workspace connectors (Gmail, Calendar, Drive) for our Claude Teams
   workspace - they respect existing user permissions and are covered by the Teams
   no-training guarantee.

2. Install the Claude app for Slack from the Slack Marketplace and approve it for our
   workspace, so we can DM @Claude and use it in a private #cos-alerts channel.

3. (Optional, for the automation phase) Create one Claude API key for the automation
   service account, to be stored in Google Apps Script's Properties Service - used only
   for scheduled email scoring and room booking.

Security posture: no third-party middleware, connectors inherit user permissions, Teams
data is excluded from model training. Happy to walk through it - it took 45 minutes to
learn, it'll take you less.

Thanks,
[name]
```

## What each approval unlocks

| Approval | Unlocks | IT effort |
|---|---|---|
| Google Workspace connectors | Briefings, triage, doc search (Tier 1 - the core) | Enable in Claude admin console, once |
| Claude app for Slack | @Claude DMs/channels, one-sentence booking (Tier 2) | Marketplace install + workspace approval |
| Claude API key | Push automations: 5-min email watcher, room engine (Tier 3) | Scoped key in Apps Script properties |
