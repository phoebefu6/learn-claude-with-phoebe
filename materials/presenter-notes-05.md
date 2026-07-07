# Presenter notes - Session 5: Data work with Claude Code

Success metric: everyone ran the full explore-plan-code loop on the practice repo and rejected at least one plan step.

## Before the session (critical)
- Pre-session homework email (3 days ahead): install Node + `npm install -g @anthropic-ai/claude-code`, log in, confirm `claude` launches. Sessions die on install problems - chase stragglers the day before.
- Create the claude-data-lab practice repo (messy sales_export.csv with: duplicate rows, mixed date formats, a currency column with symbols, a region column with case variants, one PII-looking email column). Push to the internal git. Test the whole Demo 1 flow on a clean machine.
- Set expectations in the invite: terminal session, laptops mandatory, analysts welcome but pair with an engineer.

## Timing (45)
- 0-3 hook: one sentence in, watch Claude Code profile + plan on the projector.
- 3-18 concepts: architecture diagram (3) · setup + first prompt (2) · CLAUDE.md (3) · explore-plan-code-commit (3) · workflows 1-4 fly-by, one minute each showing just the prompt boxes (4). Power-features card = self-study, one sentence.
- 18-34 Demo 1 · 34-40 Demo 2 · 40-45 Q&A.
- The teaching moment of the whole session is Demo 1 step 4: rejecting a plan step out loud. Do not let the room skip it.

## Watch for
- Permission prompts confuse first-timers - narrate the first three: "it's asking because that command writes; that's the design."
- Someone will try it on a real repo with real PII mid-session. The guardrails-first tip exists for them - say it twice.
- Windows users: have the docs page for Windows install open in a tab.

## Cuts if long
- Demo 2 shrinks to: run the template once, save as /offline-script, finish as homework. Never cut Demo 1 steps 3-5.
