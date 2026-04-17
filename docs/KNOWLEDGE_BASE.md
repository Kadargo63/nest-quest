# NestQuest Knowledge Base

Last updated: 2026-04-17  
Status: MVP Slice 1  scaffold complete, build passing, awaiting database

---

## 1. Architecture Decisions

### AD-001: Next.js Full-Stack with Server Actions
- **Decision:** Use Next.js App Router with Server Actions instead of separate API routes
- **Rationale:** Reduces boilerplate, collocates form handling with pages, simplifies deployment
- **Trade-off:** Server Actions are less discoverable than REST routes; acceptable for MVP
- **Status:** Implemented

### AD-002: Prisma 6 (not 7)
- **Decision:** Pin Prisma to v6.x
- **Rationale:** Prisma 7 (released mid-2026) introduces breaking changes  removes `url` from `datasource` block, requires `prisma.config.ts`. The schema in all NestQuest docs uses v6 format.
- **Impact:** `package.json` pins `prisma` and `@prisma/client` to `6.19.3`
- **Migration path:** When upgrading to v7, move `DATABASE_URL` to `prisma.config.ts` and remove `url` from `schema.prisma`
- **Status:** Locked

### AD-003: Dev Auth Shim
- **Decision:** Use a `DEV_USER_EMAIL` env var to simulate the logged-in user
- **Rationale:** No auth provider configured yet. Auth is not in Slice 1 scope.
- **Location:** `lib/auth.ts`
- **Replacement plan:** Swap with NextAuth.js, Clerk, or Auth.js when auth epic begins
- **Status:** Active (dev only)

### AD-004: Zod with Prisma Native Enums
- **Decision:** Use `z.nativeEnum(PrismaEnum)` in server action schemas instead of `z.string()`
- **Rationale:** Passing `z.string()` through spread into Prisma `create()` causes type errors because Prisma expects its generated enum types, not plain strings
- **Impact:** All server actions import enum types from `@prisma/client`
- **Status:** Applied to liability, property, and scenario actions

### AD-005: Tailwind CSS v4 via @import
- **Decision:** Use Tailwind v4 with `@import "tailwindcss"` in `globals.css`
- **Rationale:** Next.js 16 has built-in Tailwind v4 support. No `tailwind.config.js` needed.
- **Status:** Working

### AD-006: Force-Dynamic for DB Pages
- **Decision:** Pages that query the database export `const dynamic = 'force-dynamic'`
- **Rationale:** Prevents Next.js from pre-rendering pages at build time when no database is available
- **Affected pages:** `app/page.tsx`, `app/quests/page.tsx`
- **Status:** Applied

---

## 2. Domain Model Summary

### Core Entities
| Entity | Purpose | Key Relations |
|--------|---------|---------------|
| User | Account holder | owns Quests, creates Properties/Scenarios |
| Quest | Shared planning workspace | has Members, Properties, Liabilities, Scenarios |
| QuestMember | User participation in quest | role: owner/co_planner/contributor/viewer |
| Property | Current/target/rental home | belongs to Quest, has FitProfile, LandProfile |
| Liability | Debt obligation | belongs to Quest, optionally linked to Property |
| FinancialContributor | Family financial support | amount, type, confidence level |
| HouseholdMember | Person in the household plan | role, accessibility/privacy needs |
| DreamTarget | Aspirational feature | category, priority |
| Scenario | What-if financial model | links current + target Property |
| ScenarioResult | Calculated outcome | scores, KPIs, recommendation |

### Enums (18 total)
QuestRole, InvitationStatus, PropertyRole, WatchlistStatus, HouseholdRole, HouseholdStatus, ContributorType, ConfidenceLevel, LiabilityType, DreamCategory, DreamPriority, ObservationSourceType, StrategyType, ContributorMode, ImprovementType

---

## 3. Calculation Engine

### Mortgage Calculator (`lib/calculations/mortgage.ts`)
- `calculateMonthlyPrincipalAndInterest(principal, annualRate%, termMonths)`  monthly P&I
- `roundCurrency(value)`  2 decimal places

### Scenario Engine (`lib/calculations/scenario-engine.ts`)
Takes `ScenarioCalculationInput`  produces `ScenarioCalculationResult`:
- Equity dollars and percent
- Net sale proceeds
- New mortgage amount
- Projected monthly payment
- Total monthly housing cost
- Total monthly debt
- DTI proxy
- Rental cash flow
- Cash required to close

### Recommendation Engine (`lib/recommendations.ts`)
Takes `ScenarioCalculationResult`  produces label + summary + scores:
- `affordabilityScore` (0-100): based on DTI and cash-to-close
- `riskScore` (0-100): based on DTI and rental cash flow
- Labels: Best balanced option, Stretch option, Long-term wealth option

---

## 4. What Exists vs What Is Placeholder

### Fully Implemented
- Project scaffold and build pipeline
- Prisma schema (18 models)
- Seed script with realistic sample data
- Quest CRUD (create via server action, list, detail)
- Property CRUD (create, list, detail with comments)
- Liability create form
- Scenario create form
- Scenario run action (calculation engine + DB persist)
- Scenario detail page with KPI cards
- Recommendation engine with label + summary

### Placeholder / Hardcoded
- **Dream Gap page:** Shows static numbers ($9,000 debt target, $12,500 cash gap, etc.)  needs real calculation
- **Activity page:** Queries real data but has no event-sourced activity model
- **Auth:** Dev shim only, no real authentication
- **Form redirects:** Forms don't redirect after submission (user must navigate manually)
- **Error handling:** No user-facing error states on forms
- **Property create form:** Missing beds, baths, yearBuilt, garageSpaces, tax, insurance, HOA fields

### Not Started
- Auth (NextAuth/Clerk integration)
- Invitation flow
- Scenario comparison view
- Scenario variants
- Listing URL analysis
- Media uploads
- Property observations
- Property copy across quests
- Improvement plans
- Real dream-gap calculations
- Real activity feed with event sourcing

---

## 5. Known Issues and Corrections Applied

| Issue | Resolution |
|-------|-----------|
| Prisma 7 breaking changes | Pinned to Prisma 6.19.3 |
| PowerShell UTF-8 BOM in files | Stripped BOM with .NET UTF8Encoding(false) |
| Zod string vs Prisma enum type mismatch | Changed to z.nativeEnum(PrismaEnum) |
| Express starter code in TS compilation | Excluded from tsconfig.json |
| Build-time DB queries failing | Added force-dynamic to DB-dependent pages |
| Tailwind CSS not installed | Added tailwindcss + @tailwindcss/postcss |

---

## 6. Source Documentation Index

These files were used to generate the codebase and should be treated as source of truth for product scope:

| File | Contents |
|------|----------|
| `nest_quest_product_specification.md` | Product vision, user stories, feature scope |
| `nest_quest_ux_and_technical_specification.md` | UX flows, screen designs, technical architecture |
| `nest_quest_mvp_backlog_and_delivery_plan.md` | Epics, user stories, release plan |
| `nest_quest_documentation_bundle.md` | Combined reference doc |
| `nest_quest_implementation_artifacts.md` | OpenAPI spec, Prisma schema, seed, engineering tickets |
| `nest_quest_repo_ready_file_dump.md` | File-by-file code dump (used as accelerator) |
| `nest_quest_nextjs_full_stack_starter.jsx` | Next.js implementation reference |
| `nest_quest_starter_code.ts` | Express starter (superseded by Next.js approach) |

---

## 7. Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | Yes | `postgresql://postgres:postgres@localhost:5432/nestquest` | PostgreSQL connection |
| `DEV_USER_EMAIL` | No | `rob@example.com` | Dev auth shim user identity |