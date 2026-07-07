# Presenter notes - Session 6: Power user

Success metric: a subagent built and used, an MCP server connected and audited, an API call run - by every attendee. C-level attends the first 10 minutes only.

## Before the session
- Reuse claude-data-lab from Session 5 (attendees should still have it).
- Verify: team dev API key in the password manager with a spend cap; `pip install anthropic` works on the standard laptop build; node available for `npx` (MCP filesystem server + inspector).
- Invite C-level explicitly for minutes 0-10 (platform map + the "Maria's workflow becomes company capability" story), with a graceful exit point.

## Timing (45)
- 0-3 hook: fire a 3-subagent parallel review on the projector; let it run in the background while you talk - reveal the verdicts at minute 20.
- 3-10 Part 1 platform map (agent-loop diagram + Platform 101 card). C-level exit here.
- 10-15 Part 2 subagents · 15-20 Part 3 MCP.
- 20-28 Demo 1 · 28-35 Demo 2 · 35-40 Demo 3 · 40-45 Q&A + deep-dive track walkthrough (show the 8 rows, name the minimum path 6.1 → 6.3 → 6.7).

## Watch for
- Demo 2 step 3 (auditing the server before trusting it) is the security lesson of the layer - do it slowly.
- API key hygiene: keys come from the password manager, never Slack. Say it before Demo 3, not after someone pastes one.
- The room will want to build agents immediately - channel it: "6.7 is your page; ship a workflow first, agents second."

## Cuts if long
- Demo 3 becomes homework (the ten-liner is on the page). Never cut Demo 1's governance beat (read-only reviewer by construction).
