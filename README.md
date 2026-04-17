# NestQuest

Collaborative housing and homestead planning app. Track homes, model scenarios, plan multigenerational living, and close the gap between dream and reality.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Validation | Zod |
| Auth | Dev shim (replace with NextAuth/Clerk) |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create PostgreSQL database
#    Docker:
docker run -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nestquest -p 5432:5432 -d postgres
#    Or use an existing Postgres instance

# 3. Configure environment
cp .env.example .env
# Edit .env if your DB connection differs

# 4. Run migration and generate client
npx prisma migrate dev --name init
npx prisma generate

# 5. Seed sample data
npm run seed

# 6. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
nestquest/
 app/                    # Next.js App Router pages and actions
    actions/            # Server actions (quest, property, liability, scenario)
    page.tsx            # Home page
    quests/             # Quest list, new quest, quest detail
       [questId]/      # Quest detail, properties, liabilities, scenarios, household
    properties/         # Property detail with comments
       [propertyId]/
    scenarios/          # Scenario detail with KPI cards and run button
        [scenarioId]/
 components/             # Reusable UI components
    ui/                 # Card, SectionTitle
    forms/              # SubmitButton
    properties/         # PropertyCard
    scenarios/          # KpiCard
 lib/                    # Core logic and data access
    prisma.ts           # Prisma client singleton
    auth.ts             # Dev auth shim
    queries.ts          # Data access (getUserQuests, getQuestOrThrow, etc.)
    utils.ts            # Formatting helpers (currency, percent, cn)
    recommendations.ts  # Scoring engine (affordability, risk)
    calculations/       # Financial calculation modules
        mortgage.ts     # Monthly P&I calculator
        scenario-engine.ts # Full scenario calculator
 prisma/
    schema.prisma       # 18 models, all domain enums
    seed.ts             # Sample quest with properties, liabilities, scenarios
 docs/                   # Reference documentation
    KNOWLEDGE_BASE.md   # Architecture decisions and conventions
    DEPENDENCY_MAP.md   # File dependency graph
 package.json
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run seed` | Run seed script |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run prisma:generate` | Regenerate Prisma client |

## Domain Concepts

- **Quest**  A shared planning workspace for a household
- **Property**  A current home, target home, rental, or secondary property
- **Liability**  Mortgage, student loan, credit card, auto loan, etc.
- **Contributor**  Family member who contributes financially
- **Scenario**  A what-if model (sell and buy, rent and buy, hold, etc.)
- **ScenarioResult**  Calculated financial outcomes and recommendation
- **Dream Target**  Aspirational features (greenhouse, garden, multigenerational)
- **Dream Gap**  The financial distance between current state and dream

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home  quest list |
| `/quests` | All quests |
| `/quests/new` | Create quest |
| `/quests/[questId]` | Quest dashboard (KPIs, properties, liabilities, scenarios) |
| `/quests/[questId]/properties` | Property list |
| `/quests/[questId]/properties/new` | Add property |
| `/quests/[questId]/liabilities/new` | Add liability |
| `/quests/[questId]/scenarios/new` | Create scenario |
| `/quests/[questId]/household` | Household members |
| `/quests/[questId]/dream-gap` | Dream gap planner |
| `/quests/[questId]/activity` | Activity feed |
| `/properties/[propertyId]` | Property detail + comments |
| `/scenarios/[scenarioId]` | Scenario detail + KPIs + run |

## Current Status

**Phase:** MVP Slice 1  First Vertical Slice  
**Build:** Passing (TypeScript clean, 14 routes)  
**Database:** Schema ready, migration pending (needs PostgreSQL)  
**Seed:** Written and ready  

See [docs/KNOWLEDGE_BASE.md](docs/KNOWLEDGE_BASE.md) for architecture decisions and [docs/DEPENDENCY_MAP.md](docs/DEPENDENCY_MAP.md) for the file dependency graph.