# NestQuest Documentation Bundle

This bundle contains implementation-ready documentation sections that can be split into separate markdown files in VS Code.

Suggested file layout:

```text
nestquest/
  docs/
    README.md
    architecture.md
    domain-model.md
    database-schema.md
    api-spec.md
    calculation-rules.md
    scoring-model.md
    recommendation-engine.md
    ux-flows.md
    screen-spec.md
    permissions-and-collaboration.md
    listing-enrichment.md
    nonfunctional-requirements.md
    analytics-events.md
    test-strategy.md
    implementation-plan.md
    backlog.md
    roadmap.md
    glossary.md
    adr/
      0001-quest-centric-model.md
      0002-scenario-first-decision-model.md
      0003-mobile-first-responsive-web.md
      0004-editable-external-enrichment.md
```

---

# README.md

## NestQuest

NestQuest is a collaborative, mobile-friendly housing and homestead planning app built as a sibling project within Cerebro.

It helps households answer:
- Which homes we like are realistic right now?
- If a dream home is not realistic, what would need to change?
- Should we sell, rent, hold, or improve our current property?
- How do debts, contributors, and multigenerational living plans affect our options?
- Which property best matches our dream features like greenhouse potential, garden potential, beehive suitability, courtyard potential, and low flood risk?

## Primary Value Proposition
NestQuest combines:
- scenario planning
- household and contributor modeling
- debt-aware affordability
- dream-gap planning
- land and homestead fit analysis
- collaborative family decision-making

## Product Pillars
1. Scenario-first decision engine
2. Collaborative quest model
3. Dream-gap planning
4. Land and homestead intelligence
5. Plain-English recommendations with analyst-grade KPIs

## MVP Outcome
A household can:
- save target properties
- track current home and liabilities
- model sell/rent/hold scenarios
- compare properties
- see what financial targets are required to make a dream home feasible
- collaborate through comments and shared scenarios

---

# architecture.md

## System Architecture Overview

NestQuest should be structured in these layers:

### Experience Layer
- responsive web UI
- authenticated multi-user experience
- quest switcher
- property workspace
- scenario comparison screens
- activity and comments

### Application Layer
- quest management
- property ingestion
- household management
- contributor management
- liability management
- scenario orchestration
- recommendation generation
- comments/activity handling

### Domain Layer
- users
- quests
- memberships
- properties
- household members
- contributors
- liabilities
- scenarios
- scenario variants
- results
- fit profiles
- land profiles
- dream targets

### Integration Layer
- auth provider
- media storage
- listing URL parser
- geocoding
- flood/soil/environment enrichment
- image/text observation extraction

## Architectural Principles
1. Scenario is the primary decision object.
2. Quest is the primary collaboration container.
3. Property is a workspace, not just a record.
4. External data must be editable and confidence-scored.
5. Co-planners have full edit by default in MVP.
6. Mobile-first responsive web is the initial delivery target.

## Suggested App Structure

```text
apps/
  nestquest/
    src/
      domain/
      features/
      components/
      services/
      state/
      utils/
    server/
      api/
      domain/
      services/
      repositories/
      jobs/
```

---

# domain-model.md

## Core Concepts

### User
An authenticated person who may belong to one or more quests.

### Quest
A collaborative planning workspace containing members, properties, liabilities, contributors, dream targets, and scenarios.

### Property
A generalized property object that can represent a current home, target home, rental, secondary property, or sold property.

### HouseholdMember
A person who currently lives in the household or may live in it later.

### FinancialContributor
A user or household member who may contribute financially toward shared housing goals.

### Liability
A debt or recurring financial obligation affecting affordability.

### DreamTarget
A structured aspiration, non-negotiable, or homestead/lifestyle goal.

### FitProfile
Structured property fit for household, privacy, multigenerational, and accessibility factors.

### LandProfile
Structured environmental and land-use suitability profile.

### Scenario
A decision path combining current and target properties with financing, liabilities, contributors, and assumptions.

### ScenarioVariant
A collaborator-proposed alternative scenario derived from a baseline.

### ScenarioResult
Computed KPI and recommendation outputs for a scenario.

## Core Relationships
- User belongs to many Quests through QuestMember.
- Quest has many Properties.
- Quest has many HouseholdMembers, Contributors, Liabilities, DreamTargets, and Scenarios.
- Property has one FitProfile, one LandProfile, many Media items, many Comments, and many Observations.
- Scenario references current and target Properties.
- Scenario has one or more Results over time.
- Scenario may have many Variants.

---

# database-schema.md

## Core Tables

### users
- id
- email
- display_name
- created_at
- updated_at

### quests
- id
- name
- owner_user_id
- description
- target_timeline
- default_location
- archived_at
- created_at
- updated_at

### quest_members
- id
- quest_id
- user_id
- role
- joined_at
- invitation_status

### quest_invitations
- id
- quest_id
- invited_email
- invited_user_id nullable
- role
- invitation_type
- status
- created_by_user_id
- created_at

### properties
- id
- quest_id
- property_role
- address_line_1
- address_line_2
- city
- state
- postal_code
- latitude
- longitude
- listing_url
- listing_price
- target_offer_price
- estimated_value
- purchase_price
- square_feet
- lot_size
- yard_size
- beds
- baths
- year_built
- garage_spaces
- hoa_monthly
- tax_monthly
- insurance_monthly
- watchlist_status
- source_type
- created_by_user_id
- created_at
- updated_at

### property_media
- id
- property_id
- media_type
- file_url
- thumbnail_url
- caption
- uploaded_by_user_id
- created_at

### property_observations
- id
- property_id
- category
- key
- value_text
- value_numeric nullable
- value_json nullable
- source_type
- confidence
- editable_flag
- created_by_user_id nullable
- created_at

### property_comments
- id
- property_id
- user_id
- parent_comment_id nullable
- body
- tag
- created_at
- updated_at

### household_members
- id
- quest_id
- display_name
- role
- status
- estimated_move_in_timeline
- bedroom_need
- bathroom_need
- accessibility_need_level
- privacy_need_level
- notes
- created_at
- updated_at

### financial_contributors
- id
- quest_id
- linked_user_id nullable
- linked_household_member_id nullable
- contribution_type
- amount
- start_timeline
- confidence_level
- notes
- entered_by_user_id
- created_at
- updated_at

### liabilities
- id
- quest_id
- linked_property_id nullable
- liability_type
- lender_name
- current_balance
- interest_rate
- monthly_payment
- payoff_date
- variable_payment_flag
- notes
- created_at
- updated_at

### dream_targets
- id
- quest_id
- name
- category
- priority
- target_timeline
- notes
- created_at
- updated_at

### fit_profiles
- id
- property_id
- multigenerational_fit
- privacy_fit
- aging_in_place_fit
- accessibility_fit
- expansion_potential
- dream_fit_summary
- created_at
- updated_at

### land_profiles
- id
- property_id
- sunlight_quality
- soil_quality
- drainage_quality
- flood_risk
- slope_usability
- greenhouse_feasibility
- conservatory_feasibility
- garden_feasibility
- beehive_suitability
- pollinator_potential
- irrigation_feasibility
- hoa_or_zoning_constraint_risk
- notes
- source_type
- updated_at

### improvement_plans
- id
- property_id
- improvement_type
- estimated_cost
- priority
- timeline
- feasibility
- notes
- created_at
- updated_at

### scenarios
- id
- quest_id
- name
- current_property_id nullable
- target_property_id nullable
- strategy_type
- expected_sale_price
- selling_cost_percent
- rent_estimate_monthly
- vacancy_percent
- property_management_percent
- maintenance_reserve_percent
- appreciation_rate_assumption
- down_payment_percent
- down_payment_amount
- loan_rate
- loan_term_months
- closing_costs_buy
- closing_costs_sell
- moving_costs
- renovation_budget
- greenhouse_build_cost
- conservatory_build_cost
- garden_build_cost
- beehive_setup_cost
- contributor_mode
- move_in_timeline
- notes
- created_by_user_id
- created_at
- updated_at

### scenario_variants
- id
- parent_scenario_id
- created_by_user_id
- variant_name
- notes
- changed_inputs_json
- created_at
- updated_at

### scenario_results
- id
- scenario_id
- net_sale_proceeds
- equity_dollars
- equity_percent
- retained_equity
- new_mortgage_amount
- projected_payment_monthly
- total_monthly_housing_cost
- total_monthly_debt
- dti_proxy
- rental_cash_flow_monthly
- cash_required_to_close
- one_year_outcome
- five_year_outcome
- affordability_score
- risk_score
- dream_fit_score
- multigenerational_fit_score
- land_suitability_score
- portfolio_growth_score
- recommendation_label
- recommendation_summary
- calculated_at

### property_copy_events
- id
- source_property_id
- source_quest_id
- destination_quest_id
- copied_by_user_id
- created_at

## Enum Suggestions

### property_role
- current_primary
- target_candidate
- rental
- sold
- secondary

### watchlist_status
- researching
- interested
- serious_contender
- stretch_dream
- backup
- paused
- archived

### strategy_type
- sell_and_buy
- rent_and_buy
- hold_and_wait
- renovate_and_stay
- household_merge
- buy_then_improve

### role
- owner
- co_planner
- contributor
- viewer

---

# api-spec.md

## API Design Principles
- resource-oriented endpoints
- separate calculation execution from CRUD
- support quest context everywhere
- preserve explainability in outputs

## Quest APIs
- `POST /quests`
- `GET /quests`
- `GET /quests/:questId`
- `PATCH /quests/:questId`
- `POST /quests/:questId/invitations`
- `GET /quests/:questId/members`
- `PATCH /quests/:questId/members/:memberId`

## Property APIs
- `POST /quests/:questId/properties`
- `GET /quests/:questId/properties`
- `GET /properties/:propertyId`
- `PATCH /properties/:propertyId`
- `POST /properties/:propertyId/media`
- `POST /properties/:propertyId/comments`
- `GET /properties/:propertyId/comments`
- `POST /properties/:propertyId/copy`
- `POST /properties/analyze-listing`

## Household APIs
- `POST /quests/:questId/household-members`
- `PATCH /household-members/:id`
- `POST /quests/:questId/contributors`
- `PATCH /contributors/:id`

## Liability APIs
- `POST /quests/:questId/liabilities`
- `GET /quests/:questId/liabilities`
- `PATCH /liabilities/:id`
- `DELETE /liabilities/:id`

## Dream/Fit APIs
- `POST /quests/:questId/dream-targets`
- `GET /quests/:questId/dream-targets`
- `PATCH /fit-profiles/:propertyId`
- `PATCH /land-profiles/:propertyId`

## Scenario APIs
- `POST /quests/:questId/scenarios`
- `GET /quests/:questId/scenarios`
- `GET /scenarios/:scenarioId`
- `PATCH /scenarios/:scenarioId`
- `POST /scenarios/:scenarioId/run`
- `POST /scenarios/:scenarioId/variants`
- `GET /scenarios/:scenarioId/results`
- `POST /scenarios/compare`

## Activity APIs
- `GET /quests/:questId/activity`

## Example Scenario Run Response

```json
{
  "scenarioId": "scn_123",
  "status": "completed",
  "result": {
    "netSaleProceeds": 84250,
    "projectedPaymentMonthly": 3180,
    "totalMonthlyHousingCost": 3810,
    "totalMonthlyDebt": 4725,
    "dtiProxy": 0.39,
    "cashRequiredToClose": 61200,
    "affordabilityScore": 74,
    "riskScore": 61,
    "dreamFitScore": 88,
    "multigenerationalFitScore": 72,
    "landSuitabilityScore": 84,
    "recommendationLabel": "best_balanced_option",
    "recommendationSummary": "Strong dream-fit property with good garden and greenhouse potential. Feasible if revolving debt is reduced and current home sells near expected value."
  }
}
```

---

# calculation-rules.md

## Calculation Philosophy
- separate user facts from assumptions
- treat scenario outputs as reproducible calculations
- keep formulas transparent
- support conservative/base/optimistic assumptions later

## Core Financial Calculations

### Current Equity Dollars
`estimated_value - mortgage_balance`

### Current Equity Percent
`current_equity_dollars / estimated_value`

### Price Per Square Foot
`price / square_feet`

### Estimated Net Sale Proceeds
`expected_sale_price - selling_costs - mortgage_balance - seller_closing_costs - repair_or_concession_allowance`

### New Mortgage Amount
`purchase_price - down_payment_amount + financed_closing_costs_optional`

### Monthly Principal and Interest
Use standard amortization formula.

### Total Monthly Housing Cost
`principal_interest + taxes + insurance + hoa + maintenance_estimate`

### Total Monthly Debt
`total_monthly_housing_cost + all_non_housing_monthly_debt`

### DTI Proxy
`total_monthly_debt / gross_monthly_income`

### Rental Cash Flow Monthly
`gross_rent - vacancy_reserve - property_management - taxes - insurance - hoa - maintenance_reserve - mortgage_payment`

### Cash Required to Close
`down_payment + buyer_closing_costs + moving_costs + initial_improvement_budget - net_sale_proceeds_applied - contributor_down_payment_support`

## Dream Gap Calculations

### Cash Gap
`max(0, cash_required_to_close - available_cash_for_transaction)`

### Debt Reduction Gap
Derived amount of debt paydown needed to move DTI proxy or monthly burden below selected target threshold.

### Contribution Gap
Additional recurring or one-time contribution needed to reach target affordability or closing thresholds.

### Minimum Sale Price Target
Sale price required to reduce cash gap to zero under the rest of the scenario assumptions.

## Improvement Calculations
Each improvement should roll into:
- upfront cash required
- monthly financing if financed later
- scenario fit uplift if applicable

---

# scoring-model.md

## Scoring Principles
- no opaque black-box scoring in MVP
- multiple scores are better than a fake universal truth
- scores must be explainable by component

## Core Scores

### affordability_score
Inputs:
- DTI proxy
- cash required to close
- monthly housing cost delta
- debt pressure

### risk_score
Inputs:
- debt load
- contribution uncertainty
- flood risk
- HOA/zoning risk
- rent assumption dependency
- timeline sensitivity

### dream_fit_score
Inputs:
- dream target match count
- non-negotiable success/failure
- greenhouse potential
- courtyard potential
- conservatory potential
- garden potential
- beehive suitability

### multigenerational_fit_score
Inputs:
- first-floor functionality
- privacy separation
- bedroom capacity
- bathroom capacity
- accessibility suitability
- future merge flexibility

### land_suitability_score
Inputs:
- sunlight quality
- soil quality
- drainage quality
- flood risk
- slope usability
- garden feasibility
- beehive suitability

### portfolio_growth_score
Inputs:
- retained equity
- rental cash flow
- long-term appreciation assumption
- improvement potential

## Balanced View
Balanced ranking should use a weighted mix of the above but remain decomposable in UI.

---

# recommendation-engine.md

## Goal
Convert KPIs and fit signals into understandable guidance.

## Recommendation Lenses
- best overall
- best affordability
- best dream fit
- best multigenerational fit
- safest option
- best after debt paydown
- best if selling current home
- best if renting current home
- best buy-and-improve option

## Explanation Template
1. headline label
2. why it ranks this way
3. biggest unlock target
4. biggest risk
5. tradeoff summary

## Example Output
**Best dream-fit stretch option**
This property aligns strongly with your greenhouse, garden, and beehive goals and has lower flood risk than most saved homes. It is not feasible today without either additional cash to close or lower revolving debt. Selling the current home provides a cleaner path than renting, but renting may improve long-term wealth if cash flow remains stable.

## Rules
- always mention at least one upside and one constraint
- mention non-negotiable failures clearly
- mention uncertainty when contributors or enrichments are low-confidence

---

# ux-flows.md

## Primary Flows

### First-Time Onboarding
1. Create account
2. Create first quest
3. Add current home
4. Add liabilities
5. Add first target home
6. Add dream targets
7. Generate first scenario
8. Land on quest home

### Add Property by URL
1. Paste listing URL
2. Parse listing
3. Review/edit fields
4. Save property
5. Create first scenario

### Create Scenario
1. Choose property
2. Choose strategy type
3. Edit assumptions
4. Run scenario
5. Review KPIs and explanation
6. Save or compare

### Propose Variant
1. Open scenario
2. Tap propose alternative
3. Change select assumptions
4. Add rationale
5. Save variant
6. Compare with baseline

### Dream Gap Planner
1. Open property
2. Tap what would it take
3. Review readiness status and targets
4. Convert unlock path to scenario

### Cross-Quest Copy
1. Open property
2. Choose copy to quest
3. Select destination quest
4. Save copy
5. Preserve lineage metadata

---

# screen-spec.md

## Quest Home
Displays:
- readiness summary
- current equity
- total debt
- contributor summary
- top target homes
- recent activity
- recommended next step

## Properties Board
Displays:
- property cards or list
- watchlist state
- key fit chips
- readiness label
- comment count
- scenario count
- filters and sort

## Property Detail
Tabs:
- overview
- fit & land
- scenarios
- comments
- media
- sources

## Scenario Lab
Displays:
- scenario list
- assumptions editor
- KPI panel
- recommendation summary
- compare mode

## Dream Gap Planner
Displays:
- ready now / close / stretch / dream
- debt gap
- cash gap
- contribution gap
- alternative unlock paths

## Household View
Displays:
- members
- move-in timelines
- contributors
- privacy/accessibility needs
- merge-household assumptions

## Activity View
Displays:
- comments
- scenario variants
- property additions
- property copies
- contributor updates

---

# permissions-and-collaboration.md

## Roles

### owner
- full access
- manage invitations
- manage quest settings
- archive quest

### co_planner
- full edit by default
- add/edit properties
- add/edit scenarios
- edit liabilities
- edit contributors
- upload media
- comment
- create variants

### contributor
- enter own contribution data
- comment
- create variants
- view scenario outputs relevant to shared quest

### viewer
- read-only access
- comment if enabled

## Collaboration Rules
- one user may belong to many quests
- one property may be copied into another quest
- variants never overwrite baseline automatically
- comments are property-scoped in MVP

---

# listing-enrichment.md

## Objectives
- reduce manual data entry
- enrich properties with public/contextual signals
- keep all enrichments editable

## Ingestion Sources
- listing URL parsing
- listing text extraction
- listing image extraction
- geocoding
- flood data
- soil/environment data

## Enrichment Rules
- record source_type for every observation
- record confidence for every observation
- allow user override on every auto-extracted field
- clearly distinguish manual vs extracted values

## Observation Categories
- pricing
- layout
- multigenerational clues
- garden potential
- greenhouse potential
- beehive suitability
- accessibility clues
- flood or drainage concern
- privacy clues

---

# nonfunctional-requirements.md

## Performance
- property list load should feel near-instant for normal quest sizes
- scenario results should return fast enough to preserve exploratory workflow
- mobile screens should remain usable on mid-range devices

## Reliability
- scenario calculations must be deterministic for same inputs
- user edits must not be silently overwritten by enrichment jobs
- copied properties must preserve source lineage

## Security
- authenticated access only
- quest membership enforced at API level
- contributors only edit their own contribution records unless broader rights granted
- file uploads scoped to quest/property permissions

## Usability
- mobile-first responsiveness
- plain-English guidance on every major decision screen
- strong empty states and progressive disclosure

## Explainability
- every recommendation must expose major drivers
- every score must be decomposable
- every enrichment must expose source and confidence

---

# analytics-events.md

## Core Product Events
- account_created
- quest_created
- quest_invitation_sent
- quest_invitation_accepted
- property_added
- property_updated
- property_copied
- property_comment_added
- liability_added
- contributor_added
- dream_target_added
- scenario_created
- scenario_run
- scenario_variant_created
- scenario_compared
- dream_gap_viewed
- unlock_path_saved_as_scenario
- listing_url_analyzed
- media_uploaded
- observation_overridden

## Recommended Event Properties
- quest_id
- property_id
- scenario_id
- user_role
- source_type
- watchlist_status
- strategy_type
- readiness_label

---

# test-strategy.md

## Test Pyramid

### Unit Tests
Cover:
- amortization and payment functions
- sale proceeds calculation
- DTI proxy calculation
- dream gap calculations
- score component calculations
- recommendation rule selection

### Integration Tests
Cover:
- quest membership enforcement
- property CRUD
- scenario creation and execution
- contributor/liability inclusion in scenario results
- property copy across quests
- comment thread behavior

### UI Tests
Cover:
- onboarding
- add property by URL/manual
- create scenario
- compare scenarios
- dream gap flow
- comments flow
- mobile navigation

### Regression Scenarios
Build fixed fixtures for:
- sell and buy baseline
- rent and buy baseline
- contributor-assisted affordability
- high debt blocking dream home
- multigenerational fit success vs failure
- beehive/garden/flood tradeoff property comparison

---

# implementation-plan.md

## Phase 1
- auth
- quests
- memberships
- property CRUD
- liabilities
- contributors
- household members

## Phase 2
- scenario CRUD
- scenario engine baseline
- KPI outputs
- compare mode

## Phase 3
- dream gap planner
- recommendation text
- comments
- activity feed basic

## Phase 4
- listing URL analysis
- media uploads
- observations
- editable enrichment

## Phase 5
- scenario variants
- cross-quest property copy
- land enrichment jobs

---

# backlog.md

## Tier 1
- auth and quests
- current and target properties
- liabilities
- contributors
- household members
- scenario creation
- scenario results
- compare mode
- KPI cards
- plain-English summaries
- readiness labels
- dream gap targets
- property comments

## Tier 2
- listing analysis
- media uploads
- observations
- scenario variants
- activity feed
- property copy across quests

## Tier 3
- advanced image analysis
- richer public-data enrichment
- portfolio dashboard depth
- refinance workflows
- maintenance tracking

---

# roadmap.md

## MVP
- shared quests
- property workspace
- household and debt modeling
- scenario engine
- dream gap planner
- comments
- mobile-responsive flows

## Phase 2
- better enrichment
- richer fit extraction
- homestead scoring
- debt paydown planner
- conservative/base/optimistic assumption sets

## Phase 3
- portfolio expansion
- rental performance
- refinance scenarios
- maintenance logging
- advanced activity and notifications

---

# glossary.md

## Quest
A collaborative planning workspace.

## Scenario
A structured housing decision path using selected properties and assumptions.

## Variant
A collaborator-proposed alternative version of a baseline scenario.

## Dream Gap
The distance between a desired property and current feasibility, expressed as financial or planning targets.

## Dream Target
A structured aspiration or non-negotiable, such as greenhouse potential, courtyard potential, beehive suitability, or low flood risk.

## Land Profile
Environmental and land-use suitability data for a property.

## Fit Profile
Household and lifestyle suitability data for a property.

---

# adr/0001-quest-centric-model.md

## Title
Adopt quest-centric collaboration model

## Status
Accepted

## Context
Users need to maintain their own housing plans while collaborating in other family members’ plans.

## Decision
Use Quest as the top-level planning container. A user may belong to many quests.

## Consequences
- supports spouses, parents, and shared planning
- supports cross-quest property copying
- keeps collaboration explicit

---

# adr/0002-scenario-first-decision-model.md

## Title
Adopt scenario-first decision model

## Status
Accepted

## Context
The true product value is not storing properties. It is comparing realistic decision paths.

## Decision
Treat Scenario as the primary decision object and Property as a supporting workspace object.

## Consequences
- calculation engine becomes central
- compare mode becomes a priority feature
- recommendation engine is scenario-based

---

# adr/0003-mobile-first-responsive-web.md

## Title
Use mobile-first responsive web for initial delivery

## Status
Accepted

## Context
Users need cross-device access and fast sharing with family members.

## Decision
Deliver NestQuest first as a responsive web application rather than native mobile.

## Consequences
- faster iteration
- one codebase
- easier shared access

---

# adr/0004-editable-external-enrichment.md

## Title
Make all external enrichment editable and confidence-scored

## Status
Accepted

## Context
Property and environmental data can be incomplete or wrong.

## Decision
All enrichments and extracted observations must expose source and confidence and remain editable by users.

## Consequences
- prevents false precision
- preserves user trust
- supports gradual enrichment sophistication

---

# Suggested Next Files
If you want to keep going after this bundle, the next high-value docs would be:
- `openapi.yaml`
- `dbml` or Prisma schema
- `seed-data.md`
- `sample-scenarios.md`
- `ui-copy.md`
- `component-inventory.md`
- `engineering-tickets.md`
