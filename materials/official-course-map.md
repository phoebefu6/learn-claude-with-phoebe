# Official course coverage map

Source: [claude.com/resources/courses](https://claude.com/resources/courses) (19 courses; the catalog page also lists use-case guides like "Write case studies" - those are folded in where relevant but are not courses). Target: every session teaches ~80% of its mapped courses' working content. Certificates, videos, and final assessments stay with the official courses.

## Session 1 - Meet Claude: AI fluency foundations (LIVE)

| Official course | Coverage | Where |
|---|---|---|
| Claude 101 (1 hr) | ✓ all 4 modules | Part 2 + Demo 2 |
| AI Fluency: Framework & Foundations (1.1 hr) | ✓ all four Ds + prompting deep dive | Part 3 |
| AI Capabilities and Limitations (15 min) | ✓ all four properties + try-it-outs | Part 1 |
| AI Fluency for Students (30 min) | ✓ learning partner, career planning, human in the loop | Part 4 + Demo 3 |
| AI Fluency for Educators (24 min) | ◐ ~70% - classroom course-design specifics left out | Part 4 |
| Teaching AI Fluency (36 min) | ✓ two loops, assessing the 4Ds, discipline expertise | Part 4 |

## Session 2 - Your AI chief of staff: daily automation

| Official course | Planned coverage |
|---|---|
| Introduction to Claude Cowork | ✓ full - Cowork concepts + the calendar/email/file/knowledge-base automations |
| AI Fluency for Small Businesses (0.9 hr) | ✓ workflow patterns applied to our team |
| AI Fluency for Nonprofits (54 min) | ✓ resource-constrained workflow patterns (overlaps Small Businesses heavily) |

## Session 3 - From SOP to skill

| Official course | Planned coverage |
|---|---|
| Introduction to agent skills (30 min) | ✓ full - skill anatomy, building, installing, live SOP conversion |

## Session 4 - Creative studio: branding, marketing, design

| Source | Planned coverage |
|---|---|
| Claude 101 advanced features | ✓ applied: Projects/Artifacts for creative work, website prototyping |
| "Write case studies" use-case guide | ✓ folded into the content demos |

## Session 5 - Data work with Claude Code

| Official course | Planned coverage |
|---|---|
| Claude Code 101 (1 hr) | ✓ full - fundamentals, CLAUDE.md, permissions, workflows |
| Claude Code in Action (1 hr) | ✓ full - applied to data cleaning, catalog, offline scripts, prototypes |

## Session 6 + engineering deep-dive track

The three 8-hour engineering courses share ~85% of their curriculum (verified against the
full lecture lists below). The deep-dive track teaches the shared core once, properly, plus
platform-specific onboarding - reaching ≥80% of each course.

**Session 6 live (45 min):** subagents, MCP overview, platform map, where this goes for our team.
Covers: Introduction to subagents (20 min) · Introduction to MCP (1 hr, overview level) · Claude Platform 101 (1 hr).

**Deep-dive pages (each also runnable as an optional 45-min DS&AI session):**

| Page | Content | Source modules (per-course lecture lists below) |
|---|---|---|
| 6.1 The Claude API | requests, multi-turn, system prompts, temperature, streaming, structured data | "Accessing Claude with the API" (all 3 courses) + Claude Platform 101 |
| 6.2 Prompt engineering & evals | clear/direct, specificity, XML tags, examples; eval workflow, test datasets, model- & code-based grading | "Prompt Engineering" + "Prompt Evaluation" (all 3) |
| 6.3 Tool use | tool functions, JSON schemas, message blocks, tool results, multi-turn, multiple tools, batch, text-edit, web search | "Tool Use" (all 3) |
| 6.4 RAG & agentic search | chunking, embeddings, full RAG flow, BM25, multi-index, reranking, contextual retrieval | "RAG" (all 3; Bedrock/Vertex add reranking + contextual retrieval) |
| 6.5 Claude features | extended thinking, images, PDFs, citations, prompt caching rules + practice, code execution & Files API | "Features of Claude" (all 3) |
| 6.6 MCP deep dive | clients, defining tools/resources/prompts, server inspector, building a client | "Model Context Protocol" (all 3) + MCP: Advanced Topics (1.1 hr) |
| 6.7 Agents & workflows | parallelization, chaining, routing, agents vs workflows, computer use, parallelizing Claude Code, automated debugging | "Agents and Workflows" + "Anthropic Apps" (all 3) + Introduction to subagents |
| 6.8 Platform onboarding: Bedrock & Vertex | Bedrock setup (our AWS estate) and Vertex AI setup side by side; what differs from the direct API | Platform-specific setup lectures |

**Not covered anywhere (official-only, by design):** quizzes, final assessments, certificates, satisfaction surveys.

---

## Appendix: fetched syllabi (2026-07-07)

### Building with the Claude API (8.1 hr, 84 lectures)
Introduction · Accessing Claude with the API (requests, multi-turn, system prompts, temperature, streaming, structured data) · Prompt Evaluation (workflow, test datasets, model/code grading) · Prompt Engineering (clear+direct, specific, XML tags, examples) · Tool Use (functions, schemas, message blocks, results, multi-turn, multiple tools, fine-grained, text edit, web search) · RAG and Agentic Search (chunking, embeddings, full flow, BM25, multi-index) · Features of Claude (extended thinking, images, PDF, citations, prompt caching, code execution + Files API) · MCP (clients, tools, inspector, resources, prompts) · Anthropic Apps (Claude Code, MCP enhancements) · Agents and Workflows (parallelization, chaining, routing, agents vs workflows) · Final assessment

### Claude with Amazon Bedrock (8 hr, 85 lectures)
Same spine; deltas: Bedrock access/setup, controlling model output, batch tool use, structured data with tools, flexible tool extraction, reranking results, contextual retrieval, parallelizing Claude Code, automated debugging, computer use (how it works), qualities of agents. No web-search tool, no code-execution/Files API module.

### Claude with Google Cloud's Vertex AI (8 hr, 85 lectures)
Same spine; deltas: Vertex AI setup, controlling model output, the batch tool, tools for structured data, reranking, contextual retrieval, full Anthropic Apps module incl. computer use, full agents & workflows module.
