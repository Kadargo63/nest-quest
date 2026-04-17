# NestQuest Product Specification

## 1. Product Overview

**NestQuest** is a collaborative, mobile-friendly housing and homestead planning application that helps individuals and families evaluate whether, when, and how to buy, sell, rent, hold, renovate, or merge households.

NestQuest is designed as a sibling project within the **Cerebro** ecosystem. It should function as a self-contained application with its own domain model, workflows, and collaboration features, while remaining conceptually connected to other Cerebro-linked apps.

NestQuest is not merely a home search tool. It is a **scenario-driven decision engine** that combines:

- housing affordability planning
- current-home equity analysis
- sell-vs-rent modeling
- debt-aware financial planning
- multi-contributor household scenarios
- dream-home and homestead fit analysis
- land suitability intelligence
- collaborative family planning

---

## 2. Product Vision

NestQuest should help a user answer questions like:

- Which homes I love are actually realistic right now?
- If a home is not realistic yet, what would need to change?
- Should I sell my current home, rent it out, or keep it and wait?
- How do my student loans, credit cards, and other obligations affect my path?
- How would things change if my husband, parents, or in-laws contribute?
- Which home is the best financial choice?
- Which home is the best multigenerational choice?
- Which home best supports my dream life: greenhouse, courtyard, lush garden, beehives, conservatory, or homestead potential?
- Should I buy the dream home now, or buy a more affordable home and transform it over time?

### Core Product Promise

**NestQuest helps households understand which saved homes are realistic, what would make them realistic, and which path best fits their financial, household, land-use, and lifestyle goals.**

---

## 3. Primary Use Cases

### 3.1 Home Transition Planning
A user has a current home and wants to compare multiple target homes while modeling:
- selling current home and buying target home
- renting current home and buying target home
- holding current home and waiting
- renovating current home instead of moving

### 3.2 Dream Gap Planning
A user saves a dream home and wants to know:
- how far away they are from affording it
- what debt needs to be paid down
- how much cash needs to be saved
- whether family contributions would make it feasible
- whether selling vs renting unlocks the dream more effectively

### 3.3 Multigenerational Planning
A household expects parents, in-laws, or other family members to move in now or in the future and wants to compare:
- space requirements
- accessibility needs
- privacy needs
- financial contributions
- timing of household merge scenarios

### 3.4 Homestead and Land Fit Planning
A user wants to evaluate properties for:
- greenhouse potential
- conservatory potential
- courtyard potential
- lush garden potential
- sunlight quality
- soil quality
- flood risk
- beehive suitability
- room for future additions or homestead features

### 3.5 Collaborative Quest Planning
A user wants to:
- share a NestQuest with a spouse or partner
- invite a parent or family member into the same planning space
- let another user propose alternative scenarios
- comment on properties together
- copy homes across different quests

### 3.6 Personal and Shared Parallel Planning
A family member can maintain their own NestQuest while also participating in another user’s NestQuest.

Example:
- user has a household NestQuest with spouse
- user’s mother has her own personal NestQuest
- mother is invited into the household NestQuest to evaluate joining the household

---

## 4. Product Principles

1. **Scenario first, not listing first**  
   The core unit of value is the scenario, not the property.

2. **Facts, assumptions, and calculations must be distinct**  
   Users should understand what is entered, what is assumed, and what is derived.

3. **Show multiple optimization paths**  
   Do not force one “best” answer. Show the best choice by affordability, risk, lifestyle fit, long-term wealth, and other lenses.

4. **Plain-English explanations plus analyst-grade KPIs**  
   The product should be understandable and quantifiable.

5. **Dreams matter**  
   A property is not just a financial instrument. It is also a lifestyle choice, family decision, and long-term environment.

6. **Collaboration is first-class**  
   Shared planning, proposed alternatives, comments, and cross-quest visibility should be built into the model.

7. **Mobile is essential**  
   Users must be able to save, review, discuss, and compare properties on their phones.

8. **External data should enrich, not override**  
   Flood risk, soil quality, listing information, and extracted observations should be editable by the user.

---

## 5. Target Users

### Primary User
A homeowner or aspiring homeowner who wants to evaluate moving, upgrading, merging households, or building a dream-property future.

### Secondary Users
- spouse or partner
- parent or in-law
- adult child or family contributor
- trusted advisor

### User Archetypes
- analytical planner
- dream-home planner
- multigenerational household strategist
- homestead-oriented buyer
- portfolio-minded property planner

---

## 6. Collaboration Model

NestQuest should support multiple planning workspaces called **Quests**.

A single user may belong to multiple quests.

### Example
- Rob + Husband Quest
- Mom’s Quest
- Family Homestead Quest

A user can:
- own one or more quests
- collaborate in another user’s quest
- propose alternative scenarios in a shared quest
- copy a property from one quest into another

### Roles

#### Owner
- full access
- manages invitations
- manages quest settings
- can archive or delete quest

#### Co-planner
- full edit rights by default
- can create and edit properties, scenarios, liabilities, contributors, and comments
- can upload media
- can propose and edit alternative scenarios

#### Contributor
- can enter their own potential contribution directly
- can comment
- can propose alternative scenarios
- can upload supporting media and notes

#### Viewer
- read-only access
- can view shared information
- can comment if enabled

### Collaboration Features
- property-level comments and discussion threads
- scenario variants proposed by other members
- direct entry of contributor financial support by contributor themselves
- copy property across quests
- plain-English recommendations visible across shared quest members

---

## 7. Core Domain Model

### 7.1 User
Represents an authenticated person.

Fields:
- id
- name
- email
- phone optional
- auth_provider
- preferences
- created_at

### 7.2 Quest
Represents a planning workspace.

Fields:
- id
- name
- owner_user_id
- description optional
- default_location optional
- preferred_regions optional
- target_timeline
- created_at
- archived_at optional

### 7.3 QuestMember
Represents a user’s membership in a quest.

Fields:
- id
- quest_id
- user_id
- role
- joined_at
- invitation_status

### 7.4 QuestInvitation
Represents an invitation to join a quest.

Fields:
- id
- quest_id
- invited_email_or_user_id
- role
- invitation_type
- status
- created_by_user_id
- created_at

### 7.5 Property
Generalized property record used for current, target, rental, and future portfolio support.

Fields:
- id
- quest_id
- property_role
  - current_primary
  - target_candidate
  - rental
  - sold
  - secondary
- address
- city
- state
- zip
- latitude optional
- longitude optional
- listing_url optional
- listing_price optional
- target_offer_price optional
- estimated_value optional
- purchase_price optional
- square_feet optional
- lot_size optional
- yard_size optional
- beds optional
- baths optional
- year_built optional
- garage_spaces optional
- hoa_monthly optional
- tax_monthly optional
- insurance_monthly optional
- notes optional
- source_type
- watchlist_status
- created_by_user_id
- created_at
- updated_at

### 7.6 PropertyMedia
Stores images, screenshots, or documents linked to a property.

Fields:
- id
- property_id
- media_type
- file_url
- thumbnail_url optional
- caption optional
- uploaded_by_user_id
- created_at

### 7.7 PropertyObservation
Structured observation from user entry or automatic extraction.

Fields:
- id
- property_id
- category
- key
- value
- source_type
  - manual
  - listing_text
  - listing_image
  - external_data
- confidence
- created_by_user_id optional
- editable_flag
- created_at

Examples:
- greenhouse_feasibility = high
- flood_risk = medium
- sunlight_quality = high
- first_floor_bedroom = yes
- beehive_suitability = low

### 7.8 PropertyComment
Property-level discussion thread.

Fields:
- id
- property_id
- user_id
- parent_comment_id optional
- body
- tag optional
- created_at
- updated_at

### 7.9 HouseholdMember
Represents a person in or potentially joining the household.

Fields:
- id
- quest_id
- display_name
- role
  - self
  - spouse
  - child
  - parent
  - in_law
  - other
- status
  - current_household
  - future_household
- estimated_move_in_timeline optional
- bedroom_need optional
- bathroom_need optional
- accessibility_need_level optional
- privacy_need_level optional
- notes optional

### 7.10 FinancialContributor
Represents a user or household member who may contribute financially.

Fields:
- id
- quest_id
- linked_user_id optional
- linked_household_member_id optional
- contribution_type
  - fixed_monthly
  - variable_monthly
  - utilities_only
  - rent_like
  - down_payment_support
- amount
- start_timeline optional
- confidence_level
- notes optional
- entered_by_user_id
- created_at

### 7.11 Liability
Represents debts and obligations that affect affordability.

Fields:
- id
- quest_id
- liability_type
  - mortgage
  - student_loan
  - credit_card
  - auto_loan
  - personal_loan
  - heloc
  - recurring_obligation
- lender_name optional
- current_balance optional
- interest_rate optional
- monthly_payment
- payoff_date optional
- variable_payment_flag
- notes optional
- linked_property_id optional
- created_at

### 7.12 DreamTarget
Represents a structured aspiration or non-negotiable.

Fields:
- id
- quest_id
- name
- category
  - homestead
  - garden
  - greenhouse
  - conservatory
  - courtyard
  - multigenerational
  - accessibility
  - financial
  - other
- priority
  - non_negotiable
  - must_have
  - strong_preference
  - nice_to_have
  - dream_feature
- target_timeline optional
- notes optional
- created_at

Examples:
- greenhouse
- room for greenhouse
- lush backyard garden
- courtyard
- conservatory potential
- first-floor elder suite
- privacy for parents
- beehive support
- low flood risk

### 7.13 FitProfile
Stores structured fit data for a property.

Fields:
- id
- property_id
- multigenerational_fit
- privacy_fit
- aging_in_place_fit
- accessibility_fit
- expansion_potential
- dream_fit_summary optional
- created_at
- updated_at

### 7.14 LandProfile
Stores land and environmental suitability.

Fields:
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
- notes optional
- source_type
- updated_at

Use categorical labels where possible:
- low / medium / high / unknown
- poor / fair / good / excellent / unknown
- low risk / moderate risk / high risk / unknown

### 7.15 ImprovementPlan
Represents a future transformation plan for a property.

Fields:
- id
- property_id
- improvement_type
  - greenhouse
  - conservatory
  - courtyard
  - landscaping
  - garden_buildout
  - beehive_setup
  - accessibility_retrofit
  - in_law_suite_conversion
  - adu
- estimated_cost
- priority
- timeline
- feasibility
- notes optional

### 7.16 Scenario
Represents a planning path tied to one or more properties.

Fields:
- id
- quest_id
- name
- current_property_id optional
- target_property_id optional
- strategy_type
  - sell_and_buy
  - rent_and_buy
  - hold_and_wait
  - renovate_and_stay
  - household_merge
  - buy_then_improve
- expected_sale_price optional
- selling_cost_percent optional
- rent_estimate_monthly optional
- vacancy_percent optional
- property_management_percent optional
- maintenance_reserve_percent optional
- appreciation_rate_assumption optional
- down_payment_percent optional
- down_payment_amount optional
- loan_rate optional
- loan_term_months optional
- closing_costs_buy optional
- closing_costs_sell optional
- moving_costs optional
- renovation_budget optional
- greenhouse_build_cost optional
- conservatory_build_cost optional
- garden_build_cost optional
- beehive_setup_cost optional
- contributor_mode
  - none
  - partial
  - full
  - uncertain
- move_in_timeline optional
- notes optional
- created_by_user_id
- created_at
- updated_at

### 7.17 ScenarioVariant
Represents an alternative scenario proposed by another member.

Fields:
- id
- parent_scenario_id
- created_by_user_id
- variant_name
- notes optional
- changed_inputs_json
- created_at

### 7.18 ScenarioResult
Stores calculated results for a scenario.

Fields:
- id
- scenario_id
- net_sale_proceeds optional
- equity_dollars optional
- equity_percent optional
- retained_equity optional
- new_mortgage_amount optional
- projected_payment_monthly optional
- total_monthly_housing_cost optional
- total_monthly_debt optional
- dti_proxy optional
- rental_cash_flow_monthly optional
- cash_required_to_close optional
- one_year_outcome optional
- five_year_outcome optional
- affordability_score optional
- risk_score optional
- dream_fit_score optional
- multigenerational_fit_score optional
- land_suitability_score optional
- portfolio_growth_score optional
- recommendation_label optional
- recommendation_summary optional
- calculated_at

### 7.19 PropertyCopyEvent
Represents copying a property between quests.

Fields:
- id
- source_property_id
- source_quest_id
- destination_quest_id
- copied_by_user_id
- created_at

---

## 8. Key Functional Modules

### 8.1 Property Workspace
Users can:
- add current home
- add target homes
- save listing URLs
- upload listing screenshots and images
- store notes
- assign watchlist statuses
- auto-enrich property data where available
- view comments and extracted observations

### 8.2 Scenario Lab
Users can:
- create scenarios per target home
- compare sell vs rent vs hold
- model contributor support
- test debt paydown effects
- compare buy-now vs buy-then-improve strategies
- propose alternative variants

### 8.3 Dream Gap Planner
For each target home, NestQuest should calculate:
- whether the home is feasible now
- how far away the household is from feasibility
- the financial targets required to unlock it
- alternative paths to feasibility

Example targets:
- pay off $11,000 credit card debt
- save $28,000 more for down payment
- reduce monthly debt by $450
- increase family contribution by $1,000 per month
- sell current home for at least X
- wait 12 months and reduce student loan balance

### 8.4 Household Planning
Users can:
- add current and future household members
- model move-in timelines
- model privacy and accessibility needs
- compare merge-household scenarios
- test multiple contributor cases

### 8.5 Homestead and Land Intelligence
Users can:
- track greenhouse potential
- track conservatory potential
- track courtyard potential
- track beehive suitability
- evaluate sunlight, soil, flood risk, drainage, and garden potential
- compare “buy now dream” vs “buy and build dream” outcomes

### 8.6 Collaboration and Comments
Users can:
- share quests
- invite family members
- comment on properties
- create scenario variants
- copy homes to another quest
- participate in separate and overlapping quests

### 8.7 Portfolio View
Supports eventual tracking of multiple owned properties.

Users can:
- view total equity
- view total debt
- track rental properties
- compare refinance or hold/sell scenarios later

---

## 9. Calculations and Analytics

### 9.1 Current Home Calculations
- current equity dollars
- current equity percent
- current price per square foot
- estimated sale proceeds
- current monthly carrying cost

### 9.2 Target Home Calculations
- target price per square foot
- estimated mortgage payment
- total monthly housing cost
- estimated cash to close

### 9.3 Liability and Affordability Calculations
- total non-housing monthly debt
- total monthly debt burden
- debt-adjusted affordability
- DTI proxy
- post-purchase cash flow pressure

### 9.4 Sell vs Rent Calculations
- net sale proceeds
- rental income estimate
- monthly rental cash flow
- annual rental cash flow
- retained equity value
- opportunity cost comparison

### 9.5 Dream Gap Calculations
- readiness status
- cash gap
- debt reduction gap
- contribution gap
- timeline to viability
- minimum sale price target
- alternative unlock paths

### 9.6 Improvement and Buildout Calculations
- total improvement cost
- phased improvement cost
- buy-now vs buy-then-improve comparison
- payback or value-added proxy where possible

### 9.7 Ranking and Optimization Lenses
Each scenario should be rankable by:
- lowest monthly burden
- highest long-term wealth
- safest / lowest risk
- best dream-home fit
- best multigenerational fit
- best balanced option
- best path after debt paydown
- best homestead potential

---

## 10. Recommendation Engine

NestQuest should not force one universal recommendation. Instead, each scenario should be evaluated through multiple lenses.

### Outputs
- ranked scenarios
- ranked homes
- feasibility labels
- financial target milestones
- plain-English explanation
- KPI summaries

### Example Plain-English Recommendation
“Best balanced option. This home has strong garden and greenhouse potential, lower flood risk than your other saved homes, and becomes feasible if high-interest debt is reduced by $9,000 or family contribution reaches $800 per month. Selling your current home provides the cleanest path to closing, while renting it improves long-term wealth but increases ongoing complexity.”

### Recommendation Views
- Best overall
- Best if selling current home
- Best if renting current home
- Best dream match
- Best safest option
- Best multigenerational option
- Best after debt paydown
- Best buy-and-improve option

---

## 11. External Data and Enrichment

External data should be automatically pulled when available and then be editable by users.

### Potential enrichment sources
- address normalization / geocoding
- listing metadata
- listing text parsing
- listing image analysis
- flood risk data
- soil quality data
- sunlight or environmental context where feasible

### Enrichment Rules
- all enrichments must store source and confidence
- all enrichments must be editable
- extracted observations should not replace user judgment
- auto-analysis should run when a listing link is pasted

### Auto-analysis targets
When a user pastes a listing link, NestQuest should attempt to extract:
- address
- price
- square footage
- lot size
- beds / baths
- photos
- listing description insights
- fit clues from text and images

---

## 12. Mobile Experience

NestQuest should be mobile-first responsive for MVP.

### Essential Mobile Flows
1. paste listing link and save property
2. upload listing screenshots or property photos
3. add or review property comments
4. review quick affordability snapshot
5. review dream-gap targets
6. compare scenarios in simplified mobile cards
7. access shared quest with spouse or family member

### Mobile Design Principles
- fast save flow
- concise KPI cards
- readable plain-English summaries
- easy media upload
- simple commenting
- easy watchlist status updates

---

## 13. Screen Architecture

### 13.1 Quest Home
Shows:
- current readiness summary
- dream-home progress summary
- saved target homes
- activity and comments
- recommended next action

### 13.2 Property Board
Shows all target homes with:
- watchlist status
- price
- square footage
- yard / lot summary
- dream-fit snapshot
- financial readiness snapshot
- comment count
- scenario count

### 13.3 Property Detail
Shows:
- listing details
- photos and media
- extracted observations
- land and fit profiles
- affordability snapshot
- dream-target alignment
- property comment thread
- create scenario action
- copy-to-quest action

### 13.4 Scenario Lab
Shows:
- scenario builder
- scenario variants
- sell/rent/hold paths
- contributor assumptions
- liability assumptions
- timeline assumptions
- outcome KPIs
- recommendations

### 13.5 Dream Gap Planner
Shows for each target property:
- ready now / close / stretch / dream
- cash target
- debt target
- contribution target
- timeline target
- unlock paths

### 13.6 Household Planning View
Shows:
- current members
- future members
- move-in timelines
- contribution assumptions
- privacy and accessibility needs
- merge-household scenarios

### 13.7 Portfolio View
Shows:
- owned properties
- total equity
- total debt
- rental cash flow
- hold/sell considerations

### 13.8 Activity and Comments
Shows:
- property comment threads
- scenario proposals
- contributor changes
- shared quest activity

---

## 14. Watchlist and Status Model

Each target home should support a status:
- researching
- interested
- serious contender
- stretch dream
- backup
- paused
- archived

These statuses should be visible in list and board views.

---

## 15. MVP Scope

### 15.1 Core MVP
- mobile-responsive web application
- user accounts
- shared quests
- multiple members per quest
- current property + many target properties
- listing link save
- photo uploads
- property comments
- watchlist statuses
- liabilities tracking
- financial contributors tracking
- household members tracking
- scenario creation
- sell vs rent vs hold modeling
- debt-aware affordability calculations
- dream-fit and land-fit input
- dream gap planner
- scenario variants by collaborators
- copy property across quests
- plain-English explanation plus KPI cards

### 15.2 Strong MVP Additions If Capacity Allows
- automatic listing parsing
- automatic listing image observation extraction
- basic external flood and soil enrichment
- improvement plan tracking
- best-path recommendation views

---

## 16. Post-MVP Roadmap

### Phase 2
- richer external enrichment
- flood-risk and soil overlays
- structured image analysis
- beehive / homestead scoring
- debt paydown action planner
- timeline-sensitive recommendation engine
- saved conservative / base / optimistic assumption sets

### Phase 3
- multiple owned property portfolio management
- rental cash-flow tracking
- refinance scenarios
- maintenance tracking
- deeper household merge planning
- more advanced recommendation tuning

### Phase 4
- natural-language decision memo generation
- notification and activity feed
- collaborative approvals / acceptance flows
- more advanced portfolio wealth planning

---

## 17. Open Technical/Design Considerations

1. Authentication approach for shared quests
2. Permission boundaries if full-edit defaults need refinement later
3. How deeply automatic listing scraping should go in MVP
4. How structured image analysis should be implemented and reviewed
5. Whether recommendation scoring weights are fixed, user-adjustable, or both
6. How cross-quest copied properties preserve lineage
7. Whether contributor financial details should support privacy scoping later

---

## 18. Suggested Folder Structure

```text
Cerebro/
  apps/
    fortuna/
    nestquest/
      src/
        domain/
          users/
          quests/
          properties/
          household/
          liabilities/
          contributors/
          scenarios/
          recommendations/
          observations/
          land/
          dream-targets/
          portfolio/
        features/
          onboarding/
          quest-home/
          property-board/
          property-detail/
          scenario-lab/
          dream-gap-planner/
          household-planning/
          portfolio/
          activity/
        components/
        services/
          listing-analysis/
          media-analysis/
          geocoding/
          enrichment/
          mortgage/
          affordability/
        utils/
      docs/
        product-spec.md
        calculation-rules.md
        scoring-model.md
        roadmap.md
```

---

## 19. Summary

NestQuest is a collaborative housing and homestead planning application that helps users compare homes they love against the realities of finance, debt, family, timing, and land suitability.

Its distinguishing strength is that it does not stop at “can I afford this house?”

It asks and answers:
- what kind of life does this property support?
- what family structure does it support?
- what dream features does it support?
- what would it take to make this dream real?
- which path best balances practicality, risk, and aspiration?

That should be the core of the product.

