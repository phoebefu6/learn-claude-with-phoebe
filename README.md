# learn-claude-with-phoebe

A 6-session, 45-minutes-per-session onboarding series that takes a whole company - data science & AI, marketing & branding, and the C-suite - from "Claude as a fancier search box" to building their own automations.

**Live site:** https://phoebefu6.github.io/learn-claude-with-phoebe/

## The series

| # | Session | Difficulty | Audience | Covers (official Anthropic courses) |
|---|---------|-----------|----------|-------------------------------------|
| 1 | Meet Claude: AI fluency foundations | 🟢 Easiest | All teams + C-level | Claude 101 · AI Fluency: Framework & Foundations · AI Capabilities and Limitations · AI Fluency for Students · AI Fluency for Educators · Teaching AI Fluency |
| 2 | Your AI chief of staff: daily automation | 🟢 Easy | All teams | Introduction to Claude Cowork · AI Fluency for Small Businesses · AI Fluency for Nonprofits |
| 3 | From SOP to skill | 🟡 Medium | All teams | Introduction to agent skills |
| 4 | Creative studio: branding, marketing, design | 🟡 Medium | Marketing & branding | Claude 101 advanced features, applied |
| 5 | Data work with Claude Code | 🟠 Hard | DS & AI | Claude Code 101 · Claude Code in Action |
| 6 | Power user: subagents, MCP, and the platform | 🔴 Hardest | DS & AI advanced | Introduction to subagents · Intro to MCP · Claude Platform 101 |
| 6.1-6.8 | Engineering deep-dive track (8 pages, each runnable as an optional 45-min session) | 🔴 Hardest | DS & AI advanced | Building with the Claude API · Claude with Amazon Bedrock · Claude with Vertex AI · MCP: Advanced Topics |

All 19 courses from [claude.com/resources/courses](https://claude.com/resources/courses) are mapped. Each session teaches ~80% of its source courses' working content; certificates, videos and assessments stay with the official courses. The three 8-hour engineering courses share ~85% of their curriculum, so the deep-dive track teaches the common core once (API → prompting & evals → tool use → RAG → features → MCP → agents & workflows) plus a Bedrock/Vertex platform-onboarding page - full mapping in [`materials/official-course-map.md`](materials/official-course-map.md).

## How a session runs

Each page is built for presenting on a projector AND self-study afterwards:

- **Live / Self-study tags** on every concept card - present the Live cards in ~20 minutes, the rest is after-class depth
- **2-3 live demos** with copy-paste prompt boxes (one-click copy) that the room builds along with
- **★ Try it now** prompts inside concept cards, mirroring the official courses' hands-on lessons
- **Toggle accordions**, **click-to-zoom diagrams**, and a **projector zoom** button (125% / 150% font scale)
- A **cheat sheet** footer and homework per session
- Instructor run-of-show lives separately in `materials/presenter-notes-0N.md`

## Repo layout

```
index.html              landing page - the 6 course cards
courses/                one HTML page per session
assets/                 shared stylesheet + page behavior (vanilla JS, no build)
materials/              presenter notes, prompt templates, course coverage map
```

Everything is static HTML/CSS/JS - no build step, works offline, prints cleanly.

## Status

All six sessions plus the eight-page engineering deep-dive track (6.1-6.8) are live. Presenter notes for every session are in `materials/`, along with the chief-of-staff Apps Script engine, the sys-admin request template, and the full official-course coverage map.

---

Created and taught by Phoebe Fu.
