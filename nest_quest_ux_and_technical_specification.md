# NestQuest UX and Technical Specification

## 1. Purpose

This document translates the NestQuest product specification into implementation-ready guidance across:

- information architecture
- screen behavior
- UX flows
- state and interaction model
- data schema direction
- service boundaries
- API design
- scoring and calculation architecture

This spec assumes NestQuest is a sibling app inside the Cerebro folder and should be built as a mobile-friendly responsive web application first.

---

## 2. Product Architecture Summary

NestQuest should be built around the following layers:

### 2.1 Experience Layer
- responsive web UI
- authenticated multi-user collaboration
- mobile-first property capture and review
- scenario modeling and comparison surfaces

### 2.2 Application Layer
- quest management
- property ingestion and enrichment
- household and contributor planning
- liability tracking
- scenario calculation orchestration
- recommendation generation
- collaboration/comment workflows

### 2.3 Domain Layer
- quests
- users and memberships
- properties
- observations
- liabilities
- contributors
- household members
- scenarios and variants
- results and rankings
- dream targets
- portfolio records

### 2.4 Integration Layer
- listing URL analysis
- geocoding
- flood/soil/environment enrichment
- image observation extraction
- authentication
- file/media storage

---

## 3. Information Architecture

## Top-Level Navigation

### Primary Navigation
- Quest Home
- Properties
- Scenario Lab
- Dream Gap
- Household
- Portfolio
- Activity
- Settings

### Mobile Navigation Priority
For mobile bottom nav, prioritize:
- Home
- Properties
- Scenarios
- Activity
- More

Under “More”:
- Dream Gap
- Household
- Portfolio
- Settings

---

## 4. Core UX Concepts

### 4.1 Quest-Centric Experience
Users do not operate “inside an account” so much as inside one or more **Quests**.

A Quest is the planning container for:
- members
- properties
- liabilities
- contributors
- dream targets
- scenarios
- results

Users should be able to switch quests from a global quest switcher.

### 4.2 Property-Centric Collaboration
Every property acts like a mini workspace containing:
- media
- extracted observations
- fit summaries
- scenarios
- comments
- watchlist state

### 4.3 Scenario-Centric Decisioning
The core decision object is the scenario. Users should be able to:
- generate a scenario
- compare scenarios
- fork variants
- understand unlock targets
- view recommendations by optimization lens

### 4.4 Plain-English + KPI Dual View
Each major result surface should support:
- **summary card** for fast understanding
- **details panel** for KPI inspection

This is especially important for shared quest members with different levels of financial fluency.

---

## 5. Primary User Flows

## 5.1 First-Time Onboarding Flow

### Goal
Get the user to first value quickly while collecting enough data to power comparisons.

### Steps
1. Create account / sign in
2. Create first Quest
3. Choose planning mode
   - buying a home
   - comparing homes
   - sell vs rent planning
   - multigenerational planning
   - dream homestead planning
4. Add current property
5. Add current mortgage and key liabilities
6. Add first target property
7. Choose dream targets
8. Generate first scenario
9. Land on Quest Home with first recommendation

### UX Notes
- Keep onboarding shallow
- Allow skip for non-critical fields
- Mark incomplete sections clearly
- Use progressive enrichment later

---

## 5.2 Add Target Property Flow

### Entry Points
- paste listing URL
- manual property creation
- copy from another quest

### Steps
1. User taps “Add Property”
2. Chooses source:
   - paste URL
   - manual entry
   - copy existing
3. If URL:
   - system parses listing
   - pre-fills fields
   - pulls photos when possible
   - creates extracted observations
4. User reviews/edit fields
5. User sets watchlist status
6. User saves property
7. System suggests “Create Scenario”

### Result
Property detail page opens with:
- summary
- media
- comments
- initial fit data
- auto-generated scenario suggestion

---

## 5.3 Create Scenario Flow

### Entry Points
- property detail
- scenario lab
- dream gap planner
- recommendation prompt

### Steps
1. Select target property
2. Select strategy type
   - sell and buy
   - rent and buy
   - hold and wait
   - renovate and stay
   - buy then improve
   - household merge
3. Confirm current property relationship
4. Enter or accept assumptions
   - sale price
   - rent estimate
   - rate
   - down payment
   - contributor support
   - debt changes
   - timeline
   - improvement budget
5. Run scenario
6. View results
7. Save variant or compare against others

### UX Notes
- support default assumptions templates
- show changed inputs clearly
- preserve previous values when forking a scenario

---

## 5.4 Alternative Scenario Proposal Flow

### Goal
Allow collaborators to propose a modified path without overwriting the baseline.

### Steps
1. Open scenario
2. Tap “Propose Alternative”
3. System clones the scenario into a variant shell
4. Collaborator changes selected inputs
5. Adds note explaining reasoning
6. Saves variant
7. Activity feed shows proposal
8. Other members can compare baseline vs variant

### Important UX Requirement
Every variant must show:
- proposer
- changed assumptions
- KPI delta
- recommendation delta

---

## 5.5 Property Discussion Flow

### Goal
Enable household members to discuss and annotate properties directly.

### Behavior
Each property has a comment thread with:
- top-level comments
- replies
- optional tags
- links to observations

### Suggested Tags
- fit
- risk
- garden
- beehives
- parents
- accessibility
- flood
- greenhouse
- pricing
- question

### Example UX Actions
- comment on backyard suitability
- ask whether flood risk is acceptable
- suggest parents could use downstairs room
- flag HOA concern for beehives

---

## 5.6 Dream Gap Flow

### Goal
Explain what must change for a saved home to become realistic.

### Steps
1. Open target property
2. Tap “What would it take?”
3. System evaluates current quest state
4. System returns:
   - feasibility label
   - cash gap
   - debt gap
   - monthly affordability gap
   - contribution gap
   - timeline gap
   - alternative unlock paths
5. User can convert an unlock path into a saved scenario

### Result Labels
- Ready now
- Close
- Stretch
- Dream for later

---

## 5.7 Cross-Quest Collaboration Flow

### Example
User’s mom has her own quest and also participates in the user’s quest.

### Behaviors
- can switch between quests
- can copy property from one quest to another
- can enter contribution assumptions directly in shared quest
- can maintain independent planning in personal quest

### UX Rules
- show quest context clearly at all times
- avoid accidental edits in wrong quest
- property copy action should preserve lineage metadata

---

## 6. Screen-Level Specification

## 6.1 Quest Home

### Purpose
Serve as the dashboard for the active quest.

### Sections
1. **Quest summary header**
   - quest name
   - members
   - active timeline
   - current planning focus

2. **Readiness cards**
   - current equity
   - estimated sale proceeds
   - total debt
   - available contributor support
   - number of serious target homes

3. **Recommended next step**
   - e.g. “Run sell vs rent scenario”
   - e.g. “Pay down $6,500 revolving debt to unlock more options”

4. **Dream progress snapshot**
   - greenhouse target
   - multigenerational fit target
   - beehive suitability target
   - garden target

5. **Top saved homes**
   - cards for top-ranked properties

6. **Recent activity**
   - comments
   - new variants
   - copied properties
   - updated contributions

### Mobile Priorities
- summary cards first
- top property cards second
- activity third

---

## 6.2 Properties Board

### Purpose
Compare all saved target homes at a glance.

### Views
- card grid
- list
- compact mobile cards

### Filters
- watchlist status
- readiness label
- dream fit level
- multigenerational fit
- flood risk
- greenhouse potential
- beehive suitability
- price range
- monthly cost estimate

### Sort Options
- newest
- highest dream fit
- best affordability
- lowest risk
- best balanced score
- highest garden potential

### Property Card Fields
- address
- thumbnail
- price
- square feet
- yard / lot summary
- watchlist status
- readiness label
- key fit chips
- comment count
- scenario count

---

## 6.3 Property Detail

### Purpose
Act as the central workspace for one property.

### Tabs / Sections
1. Overview
2. Fit & Land
3. Scenarios
4. Comments
5. Media
6. Sources

### Overview
- address and listing link
- price and key stats
- watchlist status
- readiness label
- top recommendation summary

### Fit & Land
- dream target alignment
- multigenerational fit
- sunlight quality
- soil quality
- flood risk
- greenhouse feasibility
- conservatory feasibility
- garden feasibility
- beehive suitability
- zoning/HOA risk

### Scenarios
- saved scenarios for property
- top ranked scenarios
- create scenario action
- compare variants action

### Comments
- thread view
- filter by tag
- add comment

### Media
- photos
- screenshots
- extracted image observations
- manual image tags

### Sources
- listing metadata
- external enrichments
- confidence indicators

---

## 6.4 Scenario Lab

### Purpose
Build, compare, and analyze scenario options.

### Layout
#### Left panel
- scenario list
- baseline and variants

#### Center panel
- editable assumptions

#### Right panel
- KPI result panel
- recommendation summary
- optimization rankings

### Assumption Groups
- property assumptions
- financing assumptions
- sale/rent assumptions
- liabilities
- contributors
- timeline
- improvement plans
- household merge assumptions

### Result Groups
- affordability KPIs
- liquidity KPIs
- debt KPIs
- dream-fit KPIs
- multigenerational-fit KPIs
- land/homestead KPIs
- 1-year and 5-year outcomes

### Compare Mode
Allow side-by-side compare of 2–4 scenarios.

---

## 6.5 Dream Gap Planner

### Purpose
Translate aspiration into concrete planning targets.

### Layout
For each target property show:
- readiness status
- why not ready yet
- required targets
- alternative unlock paths
- convert to scenario actions

### Required Targets Examples
- reduce credit card balance
- increase down payment
- raise family contribution
- sell home above threshold
- wait until timeline milestone
- choose improvement path over turnkey dream path

### KPI Panel
- gap to close
- gap to monthly affordability
- debt reduction target
- contribution target
- likely time to readiness

---

## 6.6 Household Planning View

### Purpose
Model who lives in the household now and later.

### Sections
- household roster
- future move-in timeline
- accessibility needs
- privacy needs
- contributor assumptions
- merge-household scenarios

### Key UX Need
Users should be able to say:
- “mother-in-law moves in in 6 months”
- “parents may join in 3 years”
- “mom can contribute $900/month”
- “dad cannot use stairs easily”

And see how that affects recommendations.

---

## 6.7 Portfolio View

### Purpose
Support future multi-property management.

### MVP Behavior
- basic property list for owned properties
- total equity
- total property-linked debt

### Future Behavior
- rental performance
- maintenance events
- refinance scenarios
- sell/hold recommendations

---

## 6.8 Activity View

### Purpose
Track collaboration and decisions.

### Feed Items
- new property added
- comment added
- scenario variant proposed
- contribution updated
- property copied to another quest
- watchlist status changed

---

## 7. Domain State Model

## 7.1 Property State
A property can move through watchlist states:
- researching
- interested
- serious contender
- stretch dream
- backup
- paused
- archived

### Additional Computed Labels
- ready now
- close
- stretch
- dream for later

These should be kept separate from watchlist state.

## 7.2 Scenario State
- draft
- saved
- compared
- recommended
- archived

## 7.3 Quest Activity State
- active
- archived

---

## 8. Data and Persistence Strategy

## 8.1 Suggested Persistence Groups

### User and Auth Tables
- users
- sessions
- auth_identities

### Quest Tables
- quests
- quest_members
- quest_invitations

### Property Tables
- properties
- property_media
- property_observations
- property_comments
- property_copy_events

### Household Tables
- household_members
- financial_contributors

### Finance Tables
- liabilities
- mortgages optional as subtype or separate extension table

### Scenario Tables
- scenarios
- scenario_variants
- scenario_results
- scenario_result_snapshots optional

### Fit Tables
- fit_profiles
- land_profiles
- dream_targets
- improvement_plans

---

## 9. Relational Schema Direction

Below is an implementation-oriented schema outline.

## users
- id PK
- email UNIQUE
- display_name
- created_at
- updated_at

## quests
- id PK
- name
- owner_user_id FK users.id
- description
- target_timeline
- default_location
- archived_at
- created_at
- updated_at

## quest_members
- id PK
- quest_id FK quests.id
- user_id FK users.id
- role
- joined_at
- invitation_status

## quest_invitations
- id PK
- quest_id FK quests.id
- invited_email
- invited_user_id nullable FK users.id
- role
- invitation_type
- status
- created_by_user_id FK users.id
- created_at

## properties
- id PK
- quest_id FK quests.id
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
- created_by_user_id FK users.id
- created_at
- updated_at

## property_media
- id PK
- property_id FK properties.id
- media_type
- file_url
- thumbnail_url
- caption
- uploaded_by_user_id FK users.id
- created_at

## property_observations
- id PK
- property_id FK properties.id
- category
- key
- value_text
- value_numeric nullable
- value_json nullable
- source_type
- confidence
- editable_flag
- created_by_user_id nullable FK users.id
- created_at

## property_comments
- id PK
- property_id FK properties.id
- user_id FK users.id
- parent_comment_id nullable FK property_comments.id
- body
- tag
- created_at
- updated_at

## household_members
- id PK
- quest_id FK quests.id
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

## financial_contributors
- id PK
- quest_id FK quests.id
- linked_user_id nullable FK users.id
- linked_household_member_id nullable FK household_members.id
- contribution_type
- amount
- start_timeline
- confidence_level
- notes
- entered_by_user_id FK users.id
- created_at
- updated_at

## liabilities
- id PK
- quest_id FK quests.id
- linked_property_id nullable FK properties.id
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

## dream_targets
- id PK
- quest_id FK quests.id
- name
- category
- priority
- target_timeline
- notes
- created_at
- updated_at

## fit_profiles
- id PK
- property_id FK properties.id
- multigenerational_fit
- privacy_fit
- aging_in_place_fit
- accessibility_fit
- expansion_potential
- dream_fit_summary
- created_at
- updated_at

## land_profiles
- id PK
- property_id FK properties.id
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

## improvement_plans
- id PK
- property_id FK properties.id
- improvement_type
- estimated_cost
- priority
- timeline
- feasibility
- notes
- created_at
- updated_at

## scenarios
- id PK
- quest_id FK quests.id
- name
- current_property_id nullable FK properties.id
- target_property_id nullable FK properties.id
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
- created_by_user_id FK users.id
- created_at
- updated_at

## scenario_variants
- id PK
- parent_scenario_id FK scenarios.id
- created_by_user_id FK users.id
- variant_name
- notes
- changed_inputs_json
- created_at
- updated_at

## scenario_results
- id PK
- scenario_id FK scenarios.id
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

## property_copy_events
- id PK
- source_property_id FK properties.id
- source_quest_id FK quests.id
- destination_quest_id FK quests.id
- copied_by_user_id FK users.id
- created_at

---

## 10. API Design Direction

Use a resource-oriented API with a calculation service boundary for scenarios.

## 10.1 Quest APIs
- `POST /quests`
- `GET /quests`
- `GET /quests/:questId`
- `PATCH /quests/:questId`
- `POST /quests/:questId/invitations`
- `GET /quests/:questId/members`
- `PATCH /quests/:questId/members/:memberId`

## 10.2 Property APIs
- `POST /quests/:questId/properties`
- `GET /quests/:questId/properties`
- `GET /properties/:propertyId`
- `PATCH /properties/:propertyId`
- `POST /properties/:propertyId/media`
- `POST /properties/:propertyId/comments`
- `GET /properties/:propertyId/comments`
- `POST /properties/:propertyId/copy`
- `POST /properties/analyze-listing`

## 10.3 Household and Contributor APIs
- `POST /quests/:questId/household-members`
- `PATCH /household-members/:id`
- `POST /quests/:questId/contributors`
- `PATCH /contributors/:id`

## 10.4 Liability APIs
- `POST /quests/:questId/liabilities`
- `GET /quests/:questId/liabilities`
- `PATCH /liabilities/:id`
- `DELETE /liabilities/:id`

## 10.5 Dream and Fit APIs
- `POST /quests/:questId/dream-targets`
- `GET /quests/:questId/dream-targets`
- `PATCH /land-profiles/:propertyId`
- `PATCH /fit-profiles/:propertyId`

## 10.6 Scenario APIs
- `POST /quests/:questId/scenarios`
- `GET /quests/:questId/scenarios`
- `GET /scenarios/:scenarioId`
- `PATCH /scenarios/:scenarioId`
- `POST /scenarios/:scenarioId/run`
- `POST /scenarios/:scenarioId/variants`
- `GET /scenarios/:scenarioId/results`
- `POST /scenarios/compare`

## 10.7 Activity APIs
- `GET /quests/:questId/activity`

---

## 11. Service Boundaries

## 11.1 Listing Analysis Service
Responsibilities:
- parse listing URLs
- extract property fields
- ingest photos where possible
- parse listing text
- create initial observations

## 11.2 Enrichment Service
Responsibilities:
- geocoding
- flood risk lookup
- soil data lookup
- other environmental enrichments
- confidence/source tagging

## 11.3 Media Analysis Service
Responsibilities:
- analyze photos
- create structured observations
- identify fit clues
- identify land-use clues
- return confidence-scored observations

## 11.4 Scenario Calculation Service
Responsibilities:
- calculate financing
- calculate sale proceeds
- calculate debt burden
- calculate rent outcomes
- calculate improvement costs
- calculate recommendation scores
- generate plain-English recommendation text

## 11.5 Recommendation Service
Responsibilities:
- rank scenarios
- rank properties
- generate optimization-specific labels
- generate dream-gap targets

---

## 12. Scoring and Calculation Model

## 12.1 Score Design Principles
- scores must be explainable
- do not hide important assumptions
- support multiple optimization views
- do not collapse everything to one opaque number

## 12.2 Core Scores
Each scenario result should support:
- affordability_score
- risk_score
- dream_fit_score
- multigenerational_fit_score
- land_suitability_score
- portfolio_growth_score
- balanced_score optional derived surface

## 12.3 KPI Families
### Financial KPIs
- cash required to close
- projected payment monthly
- total monthly housing cost
- total monthly debt
- DTI proxy
- net sale proceeds
- rental cash flow

### Fit KPIs
- dream target match count
- non-negotiable failures
- multigenerational suitability
- accessibility fit
- privacy fit
- greenhouse potential
- garden potential
- beehive suitability

### Risk KPIs
- flood risk
- debt pressure
- contribution uncertainty
- timeline sensitivity
- HOA/zoning risk

---

## 13. Recommendation Explanation Model

Each recommendation should be built from structured explanation blocks.

### Explanation Template
1. headline label
2. why this scenario ranks where it does
3. biggest unlock target
4. biggest risk
5. dream/home/household tradeoff

### Example
**Best dream-fit stretch option**  
This property is not feasible today, but it aligns strongly with your greenhouse, garden, and beehive goals. It becomes materially more realistic if revolving debt falls below a target threshold or if contributor support begins within the next 12 months. Flood risk is lower than other saved homes, but the monthly carrying cost remains a stretch without a stronger down payment.

---

## 14. Notifications and Activity Model

For MVP, keep notifications lightweight.

### Activity Events
- property_added
- property_commented
- scenario_created
- scenario_variant_created
- contributor_updated
- property_copied
- watchlist_changed

### Future Notification Targets
- collaborator proposed a new scenario
- contributor updated their commitment
- dream home moved closer to feasibility
- external data enrichment updated risk/fit

---

## 15. Security and Permissions Direction

### MVP Simplicity
- owner and co-planner have full edit
- contributor can edit their own contribution data and create variants
- viewer is read-only

### Future Considerations
- privacy scopes for contributor financial details
- per-section visibility
- approval workflow for scenario publication

---

## 16. Suggested Front-End Structure

```text
src/
  app/
  pages/
    quest-home/
    properties/
    property-detail/
    scenario-lab/
    dream-gap/
    household/
    portfolio/
    activity/
    settings/
  modules/
    auth/
    quests/
    properties/
    comments/
    household/
    contributors/
    liabilities/
    dream-targets/
    scenarios/
    recommendations/
    enrichment/
    media-analysis/
  components/
    cards/
    forms/
    lists/
    charts/
    comments/
    media/
    navigation/
  services/
    api/
    calculations/
    formatting/
  state/
    quest-store/
    scenario-store/
    property-store/
```

---

## 17. Suggested Back-End Structure

```text
server/
  api/
    quests/
    properties/
    comments/
    contributors/
    liabilities/
    household/
    dream-targets/
    scenarios/
    activity/
  domain/
    quests/
    properties/
    scenarios/
    finance/
    fit/
    recommendations/
  services/
    listing-analysis/
    enrichment/
    media-analysis/
    scenario-engine/
    recommendation-engine/
  repositories/
  jobs/
    enrichment-jobs/
    media-processing/
```

---

## 18. MVP Implementation Recommendation

Build in this order:

### Phase A
- auth
- quests and members
- current property and target properties
- comments
- liabilities
- contributors

### Phase B
- scenarios
- scenario results
- compare mode
- dream gap planner

### Phase C
- listing URL parsing
- media uploads
- observations
- fit and land profile editing

### Phase D
- activity feed
- copy property across quests
- scenario variants
- recommendation text

### Phase E
- enrichment integrations
- image extraction
- portfolio features

---

## 19. Final Guidance

NestQuest should be implemented as a clear combination of:
- collaborative planning workspace
- financial scenario engine
- dream-home gap planner
- land and homestead fit evaluator
- family housing strategy tool

The technical architecture should preserve one core rule:

**Properties are important, but scenarios are the true unit of decision-making.**

That principle should shape both the UX and the codebase.

