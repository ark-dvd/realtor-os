# Realtor-OS (Merrav) — Audit & Remediation Execution Plan (Binding)

**Document ID:** REOS-AUDIT-PLAN-v1  
**Status:** Active / Binding  
**Scope:** merrav.com (Realtor-OS repo)  
**Language:** English (all technical artifacts, prompts, and plans).  
**Conversation language (Arik ↔ ChatGPT):** Hebrew.

---

## 1) Purpose

This document is the single source of truth for how we:
- Convert audit findings into a strict, step-by-step remediation plan
- Execute changes via **Claude Code** (implementation) and **ChatGPT** (CTO/CPO/QA guidance)
- Preserve continuity if the conversation is interrupted

This plan is intentionally conservative and “Maybach-grade”:
- Minimal risk
- Deterministic steps
- Evidence-based QA gates
- No scope creep

---

## 2) Binding Operating Rules (Non-Negotiable)

### 2.1 One-instruction protocol
- ChatGPT provides **one instruction at a time**.
- Each instruction must declare execution context explicitly:
  - `[CONTEXT: CLAUDE CODE]` or `[CONTEXT: CMD / PowerShell]` or `[CONTEXT: DISCUSSION / QA ONLY]`
- After each instruction, we stop and wait for user feedback/output.

### 2.2 Separation of responsibilities
- **ChatGPT**: CTO/CPO advisor, writes prompts for Claude Code, performs QA, creates plans/docs.
- **Claude Code**: reads repo files, implements changes, returns patches/files.
- **User (Arik)**: executes commands, commits, pushes, and triggers Netlify deploys.

### 2.3 No hidden work
- No background tasks.
- No multi-step “bundles”.
- No code changes without prior repo inspection by Claude Code.

### 2.4 Canonical content lock
- Canonical content (e.g., published guide sections) must not be rewritten once approved.
- Presentation (UX/UI) may be adjusted without altering canonical text.

---

## 3) Current State Snapshot (As-of latest commit)

### 3.1 Published page
- Live URL: `/relocation-to-austin/housing-real-estate`
- Canonical draft source:
  - `content/drafts/section5_housing_realestate_upgraded.md`
- Implemented page:
  - `app/relocation-to-austin/housing-real-estate/page.tsx`
- UX/UI refinement added (orientation layer) without content changes.

### 3.2 Deployment
- Netlify auto-deploy triggers on `main` push.

---

## 4) Audit → Remediation Workflow (Repeatable)

Each finding becomes a single tracked item with:
- ID
- Category
- Risk level
- Repro steps
- Proposed remediation approach
- Claude Code prompt
- Patch
- QA checklist
- Evidence (links / screenshots / logs)

### 4.1 Standard lifecycle for every remediation item
1) **Record Finding** (this doc)
2) **Write Claude Code prompt** (minimal diff)
3) **Claude Code produces patch**
4) **ChatGPT QA** (PASS/FAIL)
5) **User commit & push**
6) **Post-deploy verification** (live checks)
7) **Mark Done** (with evidence)

---

## 5) Remediation Backlog (Authoritative List)

> IMPORTANT: This table is the authoritative backlog.
> We execute strictly top-to-bottom unless explicitly reprioritized.

| ID | Category | Finding | Severity | Status | Owner | Evidence / Notes |
|----|----------|---------|----------|--------|-------|------------------|
| A-001 | Navigation / IA | Define how users discover relocation pages (no menu vs hub vs internal links) | Major | Planned | ChatGPT/Arik | Current: page is URL-only |
| A-002 | UX/UI | Establish a “Human-first orientation layer” standard for long-form pages (without content edits) | Major | Done | Claude Code | Implemented on Section 5 page |
| A-003 | SEO | Create a lightweight internal linking strategy (non-menu) to improve crawl + user flow | Major | Planned | ChatGPT/Claude Code | Likely via a future relocation hub page |
| A-004 | SEO | Confirm sitemap includes the new page and robots allows crawl | Critical | Planned | ChatGPT/Claude Code | Must verify within repo sitemap logic |
| A-005 | LLM Visibility | Define and run an “LLM discoverability verification session” protocol | Major | Planned | ChatGPT/Arik | Behavioral testing + crawl readiness |
| A-006 | Content System | Decide temporary content workflow (drafts folder) vs future CMS integration | Major | Planned | ChatGPT/Arik | Keep minimal until full refactor |
| A-007 | Content Expansion | Write Section 8.5 (Community) and/or Schools section with same standards | Major | Planned | ChatGPT/Claude | Canonical content creation phase |

> NOTE: Additional findings will be appended here as they are discovered.
> Do not execute untracked work.

---

## 6) Acceptance Criteria (Global)

A remediation item is DONE only when:
- It meets the stated goal with minimal diff
- It does not regress other site behavior
- It is deployed and verified live
- Evidence is recorded (URL, screenshot, repo path, or logs)

---

## 7) QA Gates (Non-Optional)

### 7.1 Pre-commit QA
- Verify files changed match the intended scope only
- Verify no content text was altered when “presentation-only” work is expected

### 7.2 Post-deploy QA
- Page loads without errors
- Metadata present (title/description/canonical)
- Mobile readability acceptable
- No navigation regressions

---

## 8) Handoff / Continuity Instructions (If Chat Resets)

If the conversation is interrupted:
1) Open this document
2) Identify the highest backlog item with Status = Planned / In Progress
3) Resume from the next single instruction step
4) Maintain “one instruction at a time” protocol strictly

---

## 9) Appendices

### 9.1 Reference URLs
- Live page: https://merrav.com/relocation-to-austin/housing-real-estate

### 9.2 Repo reference paths
- Draft content: `content/drafts/section5_housing_realestate_upgraded.md`
- Page implementation: `app/relocation-to-austin/housing-real-estate/page.tsx`
