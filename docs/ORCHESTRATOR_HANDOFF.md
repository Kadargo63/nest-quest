# NestQuest Orchestrator Handoff

Date: 2026-04-17  
From: Initial scaffolding orchestrator  
To: Next orchestrator session  

---

## What Was Completed

### Slice 1 Scaffold (100%)
1. **Project structure**  Next.js 16 App Router, TypeScript strict, Tailwind v4
2. **Prisma schema**  18 models, all domain enums, fully typed
3. **Prisma seed**  Realistic sample data (3 users, 1 quest, 3 properties, 4 liabilities, 2 scenarios with results, household members, contributors, dream targets, comments)
4. **Server actions**  Quest, Property, Liability, Scenario CRUD + Scenario run
5. **Calculation engine**  Mortgage P&I, full scenario calculator, recommendation scoring
6. **All MVP pages**  14 routes, all building and type-safe
7. **Build validation**  `npx next build` passes with 0 type errors

---

## What To Do Next (In Order)

### Step 1: Database Setup (BLOCKING)
The app cannot run without PostgreSQL. On the main machine:

```bash
# Option A: Docker (recommended)
docker run -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nestquest -p 5432:5432 -d postgres

# Option B: Local PostgreSQL
createdb nestquest
```

### Step 2: Pull and Install
```bash
cd ~/path/to/NestQuest
git pull origin main
npm install
```

### Step 3: Migration and Seed
```bash
npx prisma migrate dev --name init
npx prisma generate
npm run seed
```

### Step 4: Verify Dev Server
```bash
npm run dev
```

Then exercise the core flow:
1. Open http://localhost:3000
2. Click into the seeded quest
3. View properties, liabilities, scenarios
4. Click a scenario  click "Run Scenario"  see KPI results
5. Add a new property, liability, and scenario via forms

### Step 5: Fix Form UX (Quick Wins)
These are low-effort improvements needed before the flow feels complete:

1. **Add redirect after form submission**  After creating a quest/property/liability/scenario, redirect to the created item instead of staying on the form
2. **Add missing property fields to create form**  beds, baths, yearBuilt, garageSpaces, taxMonthly, insuranceMonthly, hoaMonthly (these affect scenario calculations)
3. **Add error boundaries**  Wrap pages with error.tsx files for graceful DB failure handling

### Step 6: Dream Gap Calculation (Currently Placeholder)
The dream-gap page (`app/quests/[questId]/dream-gap/page.tsx`) shows hardcoded numbers. Implement real calculation:

- Calculate debt reduction needed to hit target DTI
- Calculate cash gap (down payment + closing - available equity)
- Calculate contribution gap
- Derive timeline estimate

### Step 7: Continue MVP Backlog
Follow `nest_quest_mvp_backlog_and_delivery_plan.md` for the full epic list. The next logical epics after the above fixes are:

| Priority | Epic | What |
|----------|------|------|
| 1 | Form redirects | Redirect after create actions |
| 2 | Property detail fields | Complete property create form |
| 3 | Dream gap calculator | Real financial gap analysis |
| 4 | Scenario comparison | Side-by-side scenario view |
| 5 | Auth foundation | NextAuth.js or Clerk |
| 6 | Invitation flow | Email invites to quest |

---

## Critical Constraints

1. **Prisma must stay on v6**  Do NOT upgrade to Prisma 7. See KNOWLEDGE_BASE.md AD-002.
2. **Do NOT rename domain concepts**  Quest, Property, Scenario, Dream Gap, Contributor, Liability are established terms.
3. **Do NOT build advanced features yet**  No listing analysis, portfolio depth, image extraction, or notifications until Slice 1 is exercised.
4. **Use existing docs as source of truth**  The markdown files in the repo root contain the product spec, UX spec, and backlog. Follow them.

---

## File Encoding Warning

PowerShell on Windows adds UTF-8 BOM to files created with `Set-Content`. Prisma and some tooling reject BOM. If creating files via PowerShell, always strip BOM:

```powershell
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $content, $utf8NoBom)
```

---

## Key Files to Read First

| File | Why |
|------|-----|
| `README.md` | Project overview and setup |
| `docs/KNOWLEDGE_BASE.md` | Architecture decisions, domain model, what exists vs placeholder |
| `docs/DEPENDENCY_MAP.md` | File dependency graph, data flow |
| `prisma/schema.prisma` | All 18 models and enums |
| `lib/calculations/scenario-engine.ts` | Core calculation logic |
| `app/actions/scenario-actions.ts` | Full scenario run flow |
| `nest_quest_mvp_backlog_and_delivery_plan.md` | Delivery roadmap |

---

## Git Remote

```
origin: https://github.com/Kadargo63/nest-quest.git
branch: main
```

SSH is blocked on corporate network  use HTTPS.