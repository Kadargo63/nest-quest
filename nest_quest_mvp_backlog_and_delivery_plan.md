# NestQuest MVP Backlog and Delivery Plan

## 1. Purpose

This document translates the NestQuest product and UX/technical specifications into a practical delivery backlog.

It is intended to support:
- implementation planning
- milestone definition
- sequencing decisions
- scope control
- MVP delivery

This backlog is organized around **epics**, **feature groups**, and **user stories**, with an emphasis on building the smallest coherent version of NestQuest first.

---

## 2. MVP Definition

### MVP Goal
Deliver a mobile-friendly collaborative planning app that helps a household:
- save and manage target homes
- track current home and liabilities
- model sell/rent/hold scenarios
- compare realistic vs dream properties
- see what financial targets would make a dream property feasible
- collaborate with family members in the same quest

### MVP Success Criteria
A user should be able to:
1. create an account and a quest
2. invite a spouse or family member
3. add a current home
4. add several target homes
5. track debt and contributors
6. create scenarios for a target home
7. compare sell vs rent vs hold outcomes
8. see plain-English recommendations and KPIs
9. comment on properties
10. understand what financial milestones are needed to unlock a dream home

---

## 3. Delivery Philosophy

### Guiding Rules
1. Prioritize the **decision loop** over enrichment polish.
2. Deliver scenario value early.
3. Avoid overbuilding portfolio and automation features in v1.
4. Keep external data integrations loosely coupled.
5. Build collaboration early enough to validate shared household use.

### Core Decision Loop
The product is successful when a user can do this:
- save a property
- run scenarios
- compare outcomes
- see what must change to make it viable
- discuss it with collaborators

---

## 4. Release Structure

## Release 0: Foundation
Core infrastructure, auth, quests, membership, basic shell

## Release 1: Property and Collaboration Core
Property creation, watchlists, comments, household data, liabilities, contributors

## Release 2: Scenario Engine MVP
Scenario creation, scenario comparison, baseline calculations, recommendation summaries

## Release 3: Dream Gap Planner MVP
Readiness labels, unlock targets, property-level viability guidance

## Release 4: Smart Input and Enrichment
Listing URL parsing, media uploads, observations, editable enrichment

## Release 5: Collaboration Depth
Scenario variants, activity feed, property copy across quests

Anything beyond that should be treated as post-MVP unless implementation is moving unusually fast.

---

## 5. Epic Overview

### Epic A — Authentication and Quest Management
### Epic B — Property Workspace
### Epic C — Household, Contributors, and Liabilities
### Epic D — Scenario Engine
### Epic E — Recommendation and KPI Layer
### Epic F — Dream Gap Planner
### Epic G — Comments and Collaboration
### Epic H — Listing Analysis and Property Enrichment
### Epic I — Activity and Cross-Quest Features
### Epic J — Portfolio Foundations

---

## 6. Detailed Backlog by Epic

# Epic A — Authentication and Quest Management

## Objective
Allow users to create accounts, create quests, and collaborate with others.

### Feature Group A1 — User Authentication
#### User Stories
- As a user, I want to create an account so that I can save my planning data.
- As a user, I want to sign in securely from my phone so that I can access my quests anywhere.
- As a user, I want to stay signed in across sessions so that using the app feels seamless.

#### MVP Scope
- email/password or managed auth provider
- login
- logout
- session persistence

### Feature Group A2 — Quest Creation
#### User Stories
- As a user, I want to create a new quest so that I can organize a housing planning effort.
- As a user, I want to name my quest so that I can distinguish it from others.
- As a user, I want to belong to multiple quests so that I can plan my own future and also participate in someone else’s.

#### MVP Scope
- create quest
- edit quest name and description
- quest switcher
- list quests

### Feature Group A3 — Quest Membership and Invitations
#### User Stories
- As a user, I want to invite my husband to join my quest so that we can plan together.
- As a user, I want to invite my mother to view or contribute to my quest while keeping her own separate account.
- As an owner, I want invited members to have defined roles so that collaboration is structured.

#### MVP Scope
- send invitation
- accept invitation
- assign role
- show quest members

### Acceptance Criteria
- users can create and access quests
- a user can belong to multiple quests
- invitations work end to end
- co-planners can access the same quest

---

# Epic B — Property Workspace

## Objective
Allow users to create, organize, and inspect properties inside a quest.

### Feature Group B1 — Current and Target Properties
#### User Stories
- As a user, I want to add my current home so that the app can calculate equity and compare outcomes.
- As a user, I want to add target homes I like so that I can evaluate them later.
- As a user, I want to mark homes as serious contenders, stretch dreams, or backups so that my watchlist is organized.

#### MVP Scope
- create property manually
- property roles: current, target
- property edit form
- watchlist status

### Feature Group B2 — Property Board and Property Detail
#### User Stories
- As a user, I want to view my saved homes in one place so that I can compare them quickly.
- As a user, I want a property detail page so that I can see notes, fit information, scenarios, and comments together.

#### MVP Scope
- property board/list
- property detail screen
- filters by watchlist status

### Feature Group B3 — Property Metadata and Fit Inputs
#### User Stories
- As a user, I want to store square footage, yard size, and listing price so that I can compare homes analytically.
- As a user, I want to enter garden, greenhouse, beehive, and multigenerational fit factors so that the app reflects my real priorities.

#### MVP Scope
- core property fields
- fit fields
- land profile manual fields

### Acceptance Criteria
- users can create and update properties
- current property and target properties are distinguishable
- watchlist states are visible
- property details centralize relevant information

---

# Epic C — Household, Contributors, and Liabilities

## Objective
Model the household and debt reality that affects buying decisions.

### Feature Group C1 — Household Members
#### User Stories
- As a user, I want to track who currently lives with me and who may live with me in the future so that recommendations reflect my actual household.
- As a user, I want to record accessibility and privacy needs so that housing fit is realistic.

#### MVP Scope
- add/edit household members
- roles and timelines
- privacy/accessibility fields

### Feature Group C2 — Financial Contributors
#### User Stories
- As a user, I want to track possible contributions from family members so that I can model shared affordability.
- As a contributor, I want to enter my own contribution amount directly so that the scenario reflects my input.

#### MVP Scope
- add contributor
- contributor amount and confidence
- contributor timeline
- linked user support where possible

### Feature Group C3 — Liabilities
#### User Stories
- As a user, I want to track student loans, credit cards, and other debts so that affordability is realistic.
- As a user, I want debt burden included in scenario recommendations so that I do not overestimate what I can do.

#### MVP Scope
- add/edit/delete liabilities
- categorize liabilities
- monthly payment and balance

### Acceptance Criteria
- quest stores household members
- quest stores liabilities and contributors
- debt and contributors are available to scenarios

---

# Epic D — Scenario Engine

## Objective
Deliver the core scenario creation and comparison experience.

### Feature Group D1 — Scenario Creation
#### User Stories
- As a user, I want to create a sell-and-buy scenario so that I can see whether selling my current home makes a target home feasible.
- As a user, I want to create a rent-and-buy scenario so that I can see whether keeping my current home improves my long-term position.
- As a user, I want to create a hold-and-wait scenario so that I can compare patience against action.

#### MVP Scope
- create scenario
- select strategy type
- input assumptions
- save scenario

### Feature Group D2 — Scenario Calculation
#### User Stories
- As a user, I want the app to calculate estimated payment, net proceeds, and debt impact so that I can make informed decisions.
- As a user, I want scenario outputs to reflect contributors and liabilities so that results feel realistic.

#### MVP Scope
- mortgage/payment estimates
- net sale proceeds
- total monthly housing cost
- total monthly debt
- DTI proxy
- rental cash flow estimate
- cash required to close

### Feature Group D3 — Scenario Compare View
#### User Stories
- As a user, I want to compare two or more scenarios side by side so that I can choose among them confidently.
- As a user, I want to compare homes under different strategy types, not just one type of scenario.

#### MVP Scope
- compare 2–4 scenarios
- KPI compare layout
- recommendation compare summary

### Acceptance Criteria
- users can create scenarios from current and target homes
- calculations run successfully
- outputs are preserved and viewable later
- scenario comparisons are understandable on desktop and mobile

---

# Epic E — Recommendation and KPI Layer

## Objective
Translate calculations into useful interpretations.

### Feature Group E1 — KPI Summary Cards
#### User Stories
- As a user, I want KPI cards so that I can quickly see the financial shape of each scenario.
- As a data-oriented user, I want clear numeric outputs so that I can inspect the model myself.

#### MVP Scope
- payment estimate
- cash to close
- net sale proceeds
- total monthly debt
- 1-year and 5-year outlook placeholders if calculated

### Feature Group E2 — Plain-English Explanations
#### User Stories
- As a user, I want a plain-English summary so that I can understand why a scenario is or is not attractive.
- As a collaborator, I want a concise explanation so that I can participate in the decision even if I am not focused on all the numbers.

#### MVP Scope
- scenario summary generator
- “best overall” label
- “biggest risk” label
- “main unlock target” label

### Feature Group E3 — Optimization Views
#### User Stories
- As a user, I want to see which scenario is best by affordability, by risk, and by dream fit so that I can choose based on my priorities.

#### MVP Scope
- affordability view
- risk view
- dream-fit view
- balanced view

### Acceptance Criteria
- every scenario shows both KPIs and explanation
- rankings are understandable and non-opaque
- users can change optimization lens

---

# Epic F — Dream Gap Planner

## Objective
Show users what must change to make a target home viable.

### Feature Group F1 — Readiness Classification
#### User Stories
- As a user, I want each target home labeled as ready now, close, stretch, or dream for later so that I understand where I stand.

#### MVP Scope
- readiness label logic
- display on property cards and detail pages

### Feature Group F2 — Unlock Targets
#### User Stories
- As a user, I want to know how much debt to pay down, how much cash to save, or what contribution level would unlock a home so that I can make a plan.
- As a user, I want alternative paths shown so that I have options.

#### MVP Scope
- debt reduction target
- cash gap target
- contribution target
- sale threshold target
- monthly affordability target

### Feature Group F3 — Convert Unlock Path to Scenario
#### User Stories
- As a user, I want to turn a recommended unlock path into a scenario so that I can inspect it in detail.

#### MVP Scope
- “save as scenario” from dream gap view

### Acceptance Criteria
- target homes show readiness
- unlock targets are visible and understandable
- users can create scenarios from recommendations

---

# Epic G — Comments and Collaboration

## Objective
Allow users to collaborate around properties and decisions.

### Feature Group G1 — Property Comments
#### User Stories
- As a user, I want to leave comments on a property so that I can note concerns, ideas, and observations.
- As a collaborator, I want to reply to a comment so that discussion stays organized.

#### MVP Scope
- create comments
- reply to comments
- optional tags

### Feature Group G2 — Shared Quest Collaboration
#### User Stories
- As a co-planner, I want full edit access by default so that we can work fluidly together.
- As a collaborator, I want to see updates made by others so that shared planning feels current.

#### MVP Scope
- shared edit model
- member presence in quest and activity feed later

### Feature Group G3 — Scenario Variants
#### User Stories
- As a collaborator, I want to propose an alternative scenario so that I can test my own idea without overwriting the baseline.

#### MVP Scope
- create scenario variant
- show changed assumptions
- compare variant to baseline

### Acceptance Criteria
- comments work at property level
- collaborators can propose scenario variants
- shared quest edits are visible

---

# Epic H — Listing Analysis and Property Enrichment

## Objective
Reduce manual entry and enrich property understanding.

### Feature Group H1 — Listing URL Ingestion
#### User Stories
- As a user, I want to paste a listing link and have the app populate property details automatically so that saving a home is fast.

#### MVP Scope
- listing analysis endpoint
- prefill property fields when possible
- allow full user edits

### Feature Group H2 — Media Uploads
#### User Stories
- As a user, I want to upload screenshots and property photos so that I can annotate and compare what I see.

#### MVP Scope
- upload media
- attach to property

### Feature Group H3 — Extracted Observations
#### User Stories
- As a user, I want the app to pull clues from listings and images so that I can capture fit information faster.

#### MVP Scope
- extracted observations store
- editable extracted notes
- source/confidence indicators

### Acceptance Criteria
- URL ingestion improves property creation flow
- uploaded media is visible in property detail
- extracted observations can be reviewed and edited

---

# Epic I — Activity and Cross-Quest Features

## Objective
Support deeper collaborative planning across quests.

### Feature Group I1 — Activity Feed
#### User Stories
- As a user, I want to see recent comments, scenario proposals, and updates so that I understand what changed.

#### MVP Scope
- quest activity feed

### Feature Group I2 — Property Copy Across Quests
#### User Stories
- As a user, I want to copy a home from one quest into another so that separate family members can evaluate the same property independently.

#### MVP Scope
- property copy action
- lineage metadata

### Acceptance Criteria
- recent quest activity is visible
- property copy across quests works

---

# Epic J — Portfolio Foundations

## Objective
Lay groundwork for future multi-property support.

### Feature Group J1 — Basic Multi-Property Readiness
#### User Stories
- As a user, I want the app to support more than one owned property eventually so that I do not outgrow it.

#### MVP Scope
- schema support
- minimal owned property list if needed

### MVP Note
This epic is primarily structural for MVP and should not distract from the decision loop.

---

## 7. Prioritization Matrix

## Tier 1 — Must Have
- auth
- quests
- invitations
- current and target properties
- liabilities
- contributors
- household members
- scenario creation
- scenario calculations
- scenario compare
- KPI cards
- plain-English summaries
- readiness labels
- dream gap targets
- property comments

## Tier 2 — Strong MVP Additions
- listing URL analysis
- property media uploads
- extracted observations
- scenario variants
- activity feed
- property copy across quests

## Tier 3 — Post-MVP or Capacity Dependent
- advanced image analysis
- richer external enrichment
- full portfolio dashboard
- maintenance tracking
- refinance workflows
- advanced notifications

---

## 8. Suggested Sprint/Milestone Breakdown

## Milestone 1 — Core Account and Quest Shell
Deliver:
- auth
- quest creation
- quest membership
- quest switcher
- base navigation shell

## Milestone 2 — Property and Household Foundation
Deliver:
- current and target properties
- property board/detail
- household members
- liabilities
- contributors

## Milestone 3 — Scenario MVP
Deliver:
- create scenario
- calculate scenario outputs
- compare scenarios
- KPI cards
- summary explanations

## Milestone 4 — Dream Gap MVP
Deliver:
- readiness labels
- unlock targets
- save unlock path as scenario

## Milestone 5 — Collaboration MVP
Deliver:
- property comments
- scenario variants
- activity feed

## Milestone 6 — Smart Input MVP
Deliver:
- listing URL parsing
- media uploads
- extracted observations
- editable enrichment

---

## 9. Risks and Scope Controls

### Risk 1 — Overexpanding enrichment too early
Mitigation:
- make external data optional
- rely on manual editable fields first

### Risk 2 — Overcomplicating recommendation logic
Mitigation:
- keep recommendation rules explainable
- avoid opaque model-based scoring in MVP

### Risk 3 — Turning portfolio management into a separate product too soon
Mitigation:
- keep portfolio support structural, not feature-heavy, in MVP

### Risk 4 — Collaboration complexity
Mitigation:
- keep permissions simple in MVP
- default to full edit for co-planners as requested

### Risk 5 — Too many scenario dimensions at once
Mitigation:
- use assumption groups and progressive disclosure
- focus first on sell/rent/hold + contributor + debt inputs

---

## 10. Definition of Done for MVP

NestQuest MVP is done when a shared household can:
- create a quest together
- add their current home and several target homes
- track debts and possible contributor support
- create and compare scenarios
- understand KPIs and recommendations
- see what financial targets would unlock a saved home
- discuss a property inside the app
- use the app effectively on mobile

---

## 11. Recommended Immediate Next Step

Translate the Tier 1 backlog into:
- engineering tickets
- UI tasks
- schema migrations
- API tasks
- calculation rules tickets

The first implementation package should likely cover:
1. auth and quests
2. properties
3. liabilities and contributors
4. scenario engine baseline
5. property comments

That gives the fastest path to a usable internal alpha.

