# NestQuest Repo-Ready File Dump

Copy each section below into a file with the exact filename shown.

---

## File: docs/openapi.yaml

```yaml
openapi: 3.1.0
info:
  title: NestQuest API
  version: 0.1.0
  summary: Collaborative housing and homestead planning API
servers:
  - url: http://localhost:3000/api
    description: Local development
security:
  - bearerAuth: []
tags:
  - name: Quests
  - name: Members
  - name: Properties
  - name: Comments
  - name: Household
  - name: Contributors
  - name: Liabilities
  - name: DreamTargets
  - name: Scenarios
  - name: Activity
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    Error:
      type: object
      properties:
        message:
          type: string
      required: [message]
    Quest:
      type: object
      properties:
        id: { type: string }
        name: { type: string }
        description: { type: string, nullable: true }
        ownerUserId: { type: string }
        targetTimeline: { type: string, nullable: true }
        defaultLocation: { type: string, nullable: true }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
      required: [id, name, ownerUserId, createdAt, updatedAt]
    QuestCreate:
      type: object
      properties:
        name: { type: string }
        description: { type: string }
        targetTimeline: { type: string }
        defaultLocation: { type: string }
      required: [name]
    QuestMember:
      type: object
      properties:
        id: { type: string }
        questId: { type: string }
        userId: { type: string }
        role:
          type: string
          enum: [owner, co_planner, contributor, viewer]
        invitationStatus:
          type: string
          enum: [pending, accepted, declined]
        joinedAt: { type: string, format: date-time }
      required: [id, questId, userId, role, invitationStatus, joinedAt]
    InvitationCreate:
      type: object
      properties:
        invitedEmail: { type: string, format: email }
        role:
          type: string
          enum: [co_planner, contributor, viewer]
      required: [invitedEmail, role]
    Property:
      type: object
      properties:
        id: { type: string }
        questId: { type: string }
        propertyRole:
          type: string
          enum: [current_primary, target_candidate, rental, sold, secondary]
        addressLine1: { type: string, nullable: true }
        addressLine2: { type: string, nullable: true }
        city: { type: string, nullable: true }
        state: { type: string, nullable: true }
        postalCode: { type: string, nullable: true }
        listingUrl: { type: string, nullable: true }
        listingPrice: { type: number, nullable: true }
        targetOfferPrice: { type: number, nullable: true }
        estimatedValue: { type: number, nullable: true }
        purchasePrice: { type: number, nullable: true }
        squareFeet: { type: number, nullable: true }
        lotSize: { type: number, nullable: true }
        yardSize: { type: number, nullable: true }
        beds: { type: number, nullable: true }
        baths: { type: number, nullable: true }
        yearBuilt: { type: integer, nullable: true }
        garageSpaces: { type: integer, nullable: true }
        hoaMonthly: { type: number, nullable: true }
        taxMonthly: { type: number, nullable: true }
        insuranceMonthly: { type: number, nullable: true }
        watchlistStatus:
          type: string
          enum: [researching, interested, serious_contender, stretch_dream, backup, paused, archived]
        sourceType: { type: string, nullable: true }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
      required: [id, questId, propertyRole, watchlistStatus, createdAt, updatedAt]
    PropertyCreate:
      type: object
      properties:
        propertyRole:
          type: string
          enum: [current_primary, target_candidate, rental, sold, secondary]
        addressLine1: { type: string }
        city: { type: string }
        state: { type: string }
        postalCode: { type: string }
        listingUrl: { type: string }
        listingPrice: { type: number }
        targetOfferPrice: { type: number }
        estimatedValue: { type: number }
        purchasePrice: { type: number }
        squareFeet: { type: number }
        lotSize: { type: number }
        yardSize: { type: number }
        beds: { type: number }
        baths: { type: number }
        yearBuilt: { type: integer }
        garageSpaces: { type: integer }
        hoaMonthly: { type: number }
        taxMonthly: { type: number }
        insuranceMonthly: { type: number }
        watchlistStatus:
          type: string
          enum: [researching, interested, serious_contender, stretch_dream, backup, paused, archived]
      required: [propertyRole]
    PropertyComment:
      type: object
      properties:
        id: { type: string }
        propertyId: { type: string }
        userId: { type: string }
        parentCommentId: { type: string, nullable: true }
        body: { type: string }
        tag: { type: string, nullable: true }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
      required: [id, propertyId, userId, body, createdAt, updatedAt]
    PropertyCommentCreate:
      type: object
      properties:
        parentCommentId: { type: string }
        body: { type: string }
        tag: { type: string }
      required: [body]
    HouseholdMember:
      type: object
      properties:
        id: { type: string }
        questId: { type: string }
        displayName: { type: string }
        role:
          type: string
          enum: [self, spouse, child, parent, in_law, other]
        status:
          type: string
          enum: [current_household, future_household]
        estimatedMoveInTimeline: { type: string, nullable: true }
        bedroomNeed: { type: string, nullable: true }
        bathroomNeed: { type: string, nullable: true }
        accessibilityNeedLevel: { type: string, nullable: true }
        privacyNeedLevel: { type: string, nullable: true }
        notes: { type: string, nullable: true }
      required: [id, questId, displayName, role, status]
    HouseholdMemberCreate:
      type: object
      properties:
        displayName: { type: string }
        role:
          type: string
          enum: [self, spouse, child, parent, in_law, other]
        status:
          type: string
          enum: [current_household, future_household]
        estimatedMoveInTimeline: { type: string }
        bedroomNeed: { type: string }
        bathroomNeed: { type: string }
        accessibilityNeedLevel: { type: string }
        privacyNeedLevel: { type: string }
        notes: { type: string }
      required: [displayName, role, status]
    FinancialContributor:
      type: object
      properties:
        id: { type: string }
        questId: { type: string }
        linkedUserId: { type: string, nullable: true }
        linkedHouseholdMemberId: { type: string, nullable: true }
        contributionType:
          type: string
          enum: [fixed_monthly, variable_monthly, utilities_only, rent_like, down_payment_support]
        amount: { type: number }
        startTimeline: { type: string, nullable: true }
        confidenceLevel:
          type: string
          enum: [low, medium, high]
        notes: { type: string, nullable: true }
        enteredByUserId: { type: string }
      required: [id, questId, contributionType, amount, confidenceLevel, enteredByUserId]
    ContributorCreate:
      type: object
      properties:
        linkedUserId: { type: string }
        linkedHouseholdMemberId: { type: string }
        contributionType:
          type: string
          enum: [fixed_monthly, variable_monthly, utilities_only, rent_like, down_payment_support]
        amount: { type: number }
        startTimeline: { type: string }
        confidenceLevel:
          type: string
          enum: [low, medium, high]
        notes: { type: string }
      required: [contributionType, amount, confidenceLevel]
    Liability:
      type: object
      properties:
        id: { type: string }
        questId: { type: string }
        linkedPropertyId: { type: string, nullable: true }
        liabilityType:
          type: string
          enum: [mortgage, student_loan, credit_card, auto_loan, personal_loan, heloc, recurring_obligation]
        lenderName: { type: string, nullable: true }
        currentBalance: { type: number, nullable: true }
        interestRate: { type: number, nullable: true }
        monthlyPayment: { type: number }
        payoffDate: { type: string, format: date, nullable: true }
        variablePaymentFlag: { type: boolean }
        notes: { type: string, nullable: true }
      required: [id, questId, liabilityType, monthlyPayment, variablePaymentFlag]
    LiabilityCreate:
      type: object
      properties:
        linkedPropertyId: { type: string }
        liabilityType:
          type: string
          enum: [mortgage, student_loan, credit_card, auto_loan, personal_loan, heloc, recurring_obligation]
        lenderName: { type: string }
        currentBalance: { type: number }
        interestRate: { type: number }
        monthlyPayment: { type: number }
        payoffDate: { type: string, format: date }
        variablePaymentFlag: { type: boolean }
        notes: { type: string }
      required: [liabilityType, monthlyPayment, variablePaymentFlag]
    DreamTarget:
      type: object
      properties:
        id: { type: string }
        questId: { type: string }
        name: { type: string }
        category:
          type: string
          enum: [homestead, garden, greenhouse, conservatory, courtyard, multigenerational, accessibility, financial, other]
        priority:
          type: string
          enum: [non_negotiable, must_have, strong_preference, nice_to_have, dream_feature]
        targetTimeline: { type: string, nullable: true }
        notes: { type: string, nullable: true }
      required: [id, questId, name, category, priority]
    DreamTargetCreate:
      type: object
      properties:
        name: { type: string }
        category:
          type: string
          enum: [homestead, garden, greenhouse, conservatory, courtyard, multigenerational, accessibility, financial, other]
        priority:
          type: string
          enum: [non_negotiable, must_have, strong_preference, nice_to_have, dream_feature]
        targetTimeline: { type: string }
        notes: { type: string }
      required: [name, category, priority]
    Scenario:
      type: object
      properties:
        id: { type: string }
        questId: { type: string }
        name: { type: string }
        currentPropertyId: { type: string, nullable: true }
        targetPropertyId: { type: string, nullable: true }
        strategyType:
          type: string
          enum: [sell_and_buy, rent_and_buy, hold_and_wait, renovate_and_stay, household_merge, buy_then_improve]
        expectedSalePrice: { type: number, nullable: true }
        sellingCostPercent: { type: number, nullable: true }
        rentEstimateMonthly: { type: number, nullable: true }
        vacancyPercent: { type: number, nullable: true }
        propertyManagementPercent: { type: number, nullable: true }
        maintenanceReservePercent: { type: number, nullable: true }
        appreciationRateAssumption: { type: number, nullable: true }
        downPaymentPercent: { type: number, nullable: true }
        downPaymentAmount: { type: number, nullable: true }
        loanRate: { type: number, nullable: true }
        loanTermMonths: { type: integer, nullable: true }
        closingCostsBuy: { type: number, nullable: true }
        closingCostsSell: { type: number, nullable: true }
        movingCosts: { type: number, nullable: true }
        renovationBudget: { type: number, nullable: true }
        greenhouseBuildCost: { type: number, nullable: true }
        conservatoryBuildCost: { type: number, nullable: true }
        gardenBuildCost: { type: number, nullable: true }
        beehiveSetupCost: { type: number, nullable: true }
        contributorMode:
          type: string
          enum: [none, partial, full, uncertain]
        moveInTimeline: { type: string, nullable: true }
        notes: { type: string, nullable: true }
      required: [id, questId, name, strategyType]
    ScenarioCreate:
      type: object
      properties:
        name: { type: string }
        currentPropertyId: { type: string }
        targetPropertyId: { type: string }
        strategyType:
          type: string
          enum: [sell_and_buy, rent_and_buy, hold_and_wait, renovate_and_stay, household_merge, buy_then_improve]
        expectedSalePrice: { type: number }
        sellingCostPercent: { type: number }
        rentEstimateMonthly: { type: number }
        vacancyPercent: { type: number }
        propertyManagementPercent: { type: number }
        maintenanceReservePercent: { type: number }
        appreciationRateAssumption: { type: number }
        downPaymentPercent: { type: number }
        downPaymentAmount: { type: number }
        loanRate: { type: number }
        loanTermMonths: { type: integer }
        closingCostsBuy: { type: number }
        closingCostsSell: { type: number }
        movingCosts: { type: number }
        renovationBudget: { type: number }
        greenhouseBuildCost: { type: number }
        conservatoryBuildCost: { type: number }
        gardenBuildCost: { type: number }
        beehiveSetupCost: { type: number }
        contributorMode:
          type: string
          enum: [none, partial, full, uncertain]
        moveInTimeline: { type: string }
        notes: { type: string }
      required: [name, strategyType]
    ScenarioVariantCreate:
      type: object
      properties:
        variantName: { type: string }
        notes: { type: string }
        changedInputsJson: { type: object, additionalProperties: true }
      required: [variantName, changedInputsJson]
    ScenarioResult:
      type: object
      properties:
        scenarioId: { type: string }
        netSaleProceeds: { type: number, nullable: true }
        equityDollars: { type: number, nullable: true }
        equityPercent: { type: number, nullable: true }
        retainedEquity: { type: number, nullable: true }
        newMortgageAmount: { type: number, nullable: true }
        projectedPaymentMonthly: { type: number, nullable: true }
        totalMonthlyHousingCost: { type: number, nullable: true }
        totalMonthlyDebt: { type: number, nullable: true }
        dtiProxy: { type: number, nullable: true }
        rentalCashFlowMonthly: { type: number, nullable: true }
        cashRequiredToClose: { type: number, nullable: true }
        oneYearOutcome: { type: number, nullable: true }
        fiveYearOutcome: { type: number, nullable: true }
        affordabilityScore: { type: number, nullable: true }
        riskScore: { type: number, nullable: true }
        dreamFitScore: { type: number, nullable: true }
        multigenerationalFitScore: { type: number, nullable: true }
        landSuitabilityScore: { type: number, nullable: true }
        portfolioGrowthScore: { type: number, nullable: true }
        recommendationLabel: { type: string, nullable: true }
        recommendationSummary: { type: string, nullable: true }
        calculatedAt: { type: string, format: date-time }
      required: [scenarioId, calculatedAt]
paths:
  /quests:
    post:
      tags: [Quests]
      summary: Create quest
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/QuestCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Quest' }
    get:
      tags: [Quests]
      summary: List quests for current user
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Quest' }
  /quests/{questId}:
    get:
      tags: [Quests]
      summary: Get quest
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Quest' }
    patch:
      tags: [Quests]
      summary: Update quest
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/QuestCreate' }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Quest' }
  /quests/{questId}/invitations:
    post:
      tags: [Members]
      summary: Invite quest member
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/InvitationCreate' }
      responses:
        '201':
          description: Created
  /quests/{questId}/members:
    get:
      tags: [Members]
      summary: List quest members
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/QuestMember' }
  /quests/{questId}/properties:
    post:
      tags: [Properties]
      summary: Create property
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PropertyCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Property' }
    get:
      tags: [Properties]
      summary: List properties in quest
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Property' }
  /properties/{propertyId}:
    get:
      tags: [Properties]
      summary: Get property
      parameters:
        - in: path
          name: propertyId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Property' }
    patch:
      tags: [Properties]
      summary: Update property
      parameters:
        - in: path
          name: propertyId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PropertyCreate' }
      responses:
        '200':
          description: OK
  /properties/{propertyId}/comments:
    get:
      tags: [Comments]
      summary: List property comments
      parameters:
        - in: path
          name: propertyId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/PropertyComment' }
    post:
      tags: [Comments]
      summary: Add property comment
      parameters:
        - in: path
          name: propertyId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/PropertyCommentCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/PropertyComment' }
  /properties/{propertyId}/copy:
    post:
      tags: [Properties]
      summary: Copy property to another quest
      parameters:
        - in: path
          name: propertyId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                destinationQuestId: { type: string }
              required: [destinationQuestId]
      responses:
        '201':
          description: Created
  /properties/analyze-listing:
    post:
      tags: [Properties]
      summary: Analyze listing URL and return extracted property draft
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                listingUrl: { type: string }
              required: [listingUrl]
      responses:
        '200':
          description: OK
  /quests/{questId}/household-members:
    post:
      tags: [Household]
      summary: Create household member
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/HouseholdMemberCreate' }
      responses:
        '201':
          description: Created
  /household-members/{id}:
    patch:
      tags: [Household]
      summary: Update household member
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/HouseholdMemberCreate' }
      responses:
        '200':
          description: OK
  /quests/{questId}/contributors:
    post:
      tags: [Contributors]
      summary: Create contributor
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ContributorCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/FinancialContributor' }
  /contributors/{id}:
    patch:
      tags: [Contributors]
      summary: Update contributor
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ContributorCreate' }
      responses:
        '200':
          description: OK
  /quests/{questId}/liabilities:
    post:
      tags: [Liabilities]
      summary: Create liability
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/LiabilityCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Liability' }
    get:
      tags: [Liabilities]
      summary: List liabilities
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Liability' }
  /liabilities/{id}:
    patch:
      tags: [Liabilities]
      summary: Update liability
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/LiabilityCreate' }
      responses:
        '200':
          description: OK
    delete:
      tags: [Liabilities]
      summary: Delete liability
      parameters:
        - in: path
          name: id
          required: true
          schema: { type: string }
      responses:
        '204':
          description: No Content
  /quests/{questId}/dream-targets:
    post:
      tags: [DreamTargets]
      summary: Create dream target
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/DreamTargetCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/DreamTarget' }
    get:
      tags: [DreamTargets]
      summary: List dream targets
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/DreamTarget' }
  /quests/{questId}/scenarios:
    post:
      tags: [Scenarios]
      summary: Create scenario
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ScenarioCreate' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Scenario' }
    get:
      tags: [Scenarios]
      summary: List scenarios
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items: { $ref: '#/components/schemas/Scenario' }
  /scenarios/{scenarioId}:
    get:
      tags: [Scenarios]
      summary: Get scenario
      parameters:
        - in: path
          name: scenarioId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Scenario' }
    patch:
      tags: [Scenarios]
      summary: Update scenario
      parameters:
        - in: path
          name: scenarioId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ScenarioCreate' }
      responses:
        '200':
          description: OK
  /scenarios/{scenarioId}/run:
    post:
      tags: [Scenarios]
      summary: Run scenario calculation
      parameters:
        - in: path
          name: scenarioId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ScenarioResult' }
  /scenarios/{scenarioId}/variants:
    post:
      tags: [Scenarios]
      summary: Create scenario variant
      parameters:
        - in: path
          name: scenarioId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/ScenarioVariantCreate' }
      responses:
        '201':
          description: Created
  /scenarios/{scenarioId}/results:
    get:
      tags: [Scenarios]
      summary: Get latest scenario result
      parameters:
        - in: path
          name: scenarioId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema: { $ref: '#/components/schemas/ScenarioResult' }
  /scenarios/compare:
    post:
      tags: [Scenarios]
      summary: Compare scenarios
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                scenarioIds:
                  type: array
                  items: { type: string }
              required: [scenarioIds]
      responses:
        '200':
          description: OK
  /quests/{questId}/activity:
    get:
      tags: [Activity]
      summary: List quest activity feed
      parameters:
        - in: path
          name: questId
          required: true
          schema: { type: string }
      responses:
        '200':
          description: OK
```

---

## File: prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum QuestRole {
  owner
  co_planner
  contributor
  viewer
}

enum InvitationStatus {
  pending
  accepted
  declined
}

enum PropertyRole {
  current_primary
  target_candidate
  rental
  sold
  secondary
}

enum WatchlistStatus {
  researching
  interested
  serious_contender
  stretch_dream
  backup
  paused
  archived
}

enum HouseholdRole {
  self
  spouse
  child
  parent
  in_law
  other
}

enum HouseholdStatus {
  current_household
  future_household
}

enum ContributorType {
  fixed_monthly
  variable_monthly
  utilities_only
  rent_like
  down_payment_support
}

enum ConfidenceLevel {
  low
  medium
  high
}

enum LiabilityType {
  mortgage
  student_loan
  credit_card
  auto_loan
  personal_loan
  heloc
  recurring_obligation
}

enum DreamCategory {
  homestead
  garden
  greenhouse
  conservatory
  courtyard
  multigenerational
  accessibility
  financial
  other
}

enum DreamPriority {
  non_negotiable
  must_have
  strong_preference
  nice_to_have
  dream_feature
}

enum ObservationSourceType {
  manual
  listing_text
  listing_image
  external_data
}

enum StrategyType {
  sell_and_buy
  rent_and_buy
  hold_and_wait
  renovate_and_stay
  household_merge
  buy_then_improve
}

enum ContributorMode {
  none
  partial
  full
  uncertain
}

enum ImprovementType {
  greenhouse
  conservatory
  courtyard
  landscaping
  garden_buildout
  beehive_setup
  accessibility_retrofit
  in_law_suite_conversion
  adu
}

model User {
  id                  String                 @id @default(cuid())
  email               String                 @unique
  displayName         String
  createdAt           DateTime               @default(now())
  updatedAt           DateTime               @updatedAt
  ownedQuests         Quest[]                @relation("QuestOwner")
  memberships         QuestMember[]
  invitationsCreated  QuestInvitation[]      @relation("InvitationCreator")
  propertiesCreated   Property[]
  comments            PropertyComment[]
  contributorsEntered FinancialContributor[] @relation("ContributorEnteredBy")
  scenariosCreated    Scenario[]
  scenarioVariants    ScenarioVariant[]
  copiedProperties    PropertyCopyEvent[]
}

model Quest {
  id                String              @id @default(cuid())
  name              String
  description       String?
  ownerUserId       String
  targetTimeline    String?
  defaultLocation   String?
  archivedAt        DateTime?
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt
  owner             User                @relation("QuestOwner", fields: [ownerUserId], references: [id])
  members           QuestMember[]
  invitations       QuestInvitation[]
  properties        Property[]
  householdMembers  HouseholdMember[]
  contributors      FinancialContributor[]
  liabilities       Liability[]
  dreamTargets      DreamTarget[]
  scenarios         Scenario[]
  sourceCopies      PropertyCopyEvent[] @relation("CopySourceQuest")
  destinationCopies PropertyCopyEvent[] @relation("CopyDestinationQuest")
}

model QuestMember {
  id               String           @id @default(cuid())
  questId          String
  userId           String
  role             QuestRole
  joinedAt         DateTime         @default(now())
  invitationStatus InvitationStatus @default(accepted)
  quest            Quest            @relation(fields: [questId], references: [id], onDelete: Cascade)
  user             User             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([questId, userId])
}

model QuestInvitation {
  id              String           @id @default(cuid())
  questId         String
  invitedEmail    String
  invitedUserId   String?
  role            QuestRole
  status          InvitationStatus @default(pending)
  createdByUserId String
  createdAt       DateTime         @default(now())
  quest           Quest            @relation(fields: [questId], references: [id], onDelete: Cascade)
  createdBy       User             @relation("InvitationCreator", fields: [createdByUserId], references: [id], onDelete: Cascade)
}

model Property {
  id                 String              @id @default(cuid())
  questId            String
  propertyRole       PropertyRole
  addressLine1       String?
  addressLine2       String?
  city               String?
  state              String?
  postalCode         String?
  latitude           Float?
  longitude          Float?
  listingUrl         String?
  listingPrice       Decimal?            @db.Decimal(12, 2)
  targetOfferPrice   Decimal?            @db.Decimal(12, 2)
  estimatedValue     Decimal?            @db.Decimal(12, 2)
  purchasePrice      Decimal?            @db.Decimal(12, 2)
  squareFeet         Float?
  lotSize            Float?
  yardSize           Float?
  beds               Float?
  baths              Float?
  yearBuilt          Int?
  garageSpaces       Int?
  hoaMonthly         Decimal?            @db.Decimal(10, 2)
  taxMonthly         Decimal?            @db.Decimal(10, 2)
  insuranceMonthly   Decimal?            @db.Decimal(10, 2)
  watchlistStatus    WatchlistStatus     @default(researching)
  sourceType         String?
  createdByUserId    String
  createdAt          DateTime            @default(now())
  updatedAt          DateTime            @updatedAt
  quest              Quest               @relation(fields: [questId], references: [id], onDelete: Cascade)
  createdBy          User                @relation(fields: [createdByUserId], references: [id], onDelete: Cascade)
  media              PropertyMedia[]
  observations       PropertyObservation[]
  comments           PropertyComment[]
  fitProfile         FitProfile?
  landProfile        LandProfile?
  improvementPlans   ImprovementPlan[]
  liabilities        Liability[]
  scenariosAsCurrent Scenario[]          @relation("CurrentProperty")
  scenariosAsTarget  Scenario[]          @relation("TargetProperty")
  copiedFrom         PropertyCopyEvent[] @relation("CopySourceProperty")

  @@index([questId, propertyRole])
}

model PropertyMedia {
  id               String   @id @default(cuid())
  propertyId       String
  mediaType        String
  fileUrl          String
  thumbnailUrl     String?
  caption          String?
  uploadedByUserId String
  createdAt        DateTime @default(now())
  property         Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
}

model PropertyObservation {
  id              String                @id @default(cuid())
  propertyId      String
  category        String
  key             String
  valueText       String?
  valueNumeric    Float?
  valueJson       Json?
  sourceType      ObservationSourceType
  confidence      ConfidenceLevel?
  editableFlag    Boolean               @default(true)
  createdByUserId String?
  createdAt       DateTime              @default(now())
  property        Property              @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@index([propertyId, category])
}

model PropertyComment {
  id              String            @id @default(cuid())
  propertyId      String
  userId          String
  parentCommentId String?
  body            String
  tag             String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  property        Property          @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent          PropertyComment?  @relation("CommentReplies", fields: [parentCommentId], references: [id])
  replies         PropertyComment[] @relation("CommentReplies")

  @@index([propertyId, createdAt])
}

model HouseholdMember {
  id                      String                @id @default(cuid())
  questId                 String
  displayName             String
  role                    HouseholdRole
  status                  HouseholdStatus
  estimatedMoveInTimeline String?
  bedroomNeed             String?
  bathroomNeed            String?
  accessibilityNeedLevel  String?
  privacyNeedLevel        String?
  notes                   String?
  createdAt               DateTime              @default(now())
  updatedAt               DateTime              @updatedAt
  quest                   Quest                 @relation(fields: [questId], references: [id], onDelete: Cascade)
  contributors            FinancialContributor[]
}

model FinancialContributor {
  id                      String           @id @default(cuid())
  questId                 String
  linkedUserId            String?
  linkedHouseholdMemberId String?
  contributionType        ContributorType
  amount                  Decimal          @db.Decimal(10, 2)
  startTimeline           String?
  confidenceLevel         ConfidenceLevel
  notes                   String?
  enteredByUserId         String
  createdAt               DateTime         @default(now())
  updatedAt               DateTime         @updatedAt
  quest                   Quest            @relation(fields: [questId], references: [id], onDelete: Cascade)
  linkedHouseholdMember   HouseholdMember? @relation(fields: [linkedHouseholdMemberId], references: [id], onDelete: SetNull)
  enteredBy               User             @relation("ContributorEnteredBy", fields: [enteredByUserId], references: [id], onDelete: Cascade)
}

model Liability {
  id                  String        @id @default(cuid())
  questId             String
  linkedPropertyId    String?
  liabilityType       LiabilityType
  lenderName          String?
  currentBalance      Decimal?      @db.Decimal(12, 2)
  interestRate        Decimal?      @db.Decimal(5, 2)
  monthlyPayment      Decimal       @db.Decimal(10, 2)
  payoffDate          DateTime?
  variablePaymentFlag Boolean       @default(false)
  notes               String?
  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt
  quest               Quest         @relation(fields: [questId], references: [id], onDelete: Cascade)
  linkedProperty      Property?     @relation(fields: [linkedPropertyId], references: [id], onDelete: SetNull)
}

model DreamTarget {
  id             String        @id @default(cuid())
  questId        String
  name           String
  category       DreamCategory
  priority       DreamPriority
  targetTimeline String?
  notes          String?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
  quest          Quest         @relation(fields: [questId], references: [id], onDelete: Cascade)
}

model FitProfile {
  id                   String   @id @default(cuid())
  propertyId           String   @unique
  multigenerationalFit String?
  privacyFit           String?
  agingInPlaceFit      String?
  accessibilityFit     String?
  expansionPotential   String?
  dreamFitSummary      String?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  property             Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
}

model LandProfile {
  id                        String   @id @default(cuid())
  propertyId                String   @unique
  sunlightQuality           String?
  soilQuality               String?
  drainageQuality           String?
  floodRisk                 String?
  slopeUsability            String?
  greenhouseFeasibility     String?
  conservatoryFeasibility   String?
  gardenFeasibility         String?
  beehiveSuitability        String?
  pollinatorPotential       String?
  irrigationFeasibility     String?
  hoaOrZoningConstraintRisk String?
  notes                     String?
  sourceType                String?
  updatedAt                 DateTime @updatedAt
  property                  Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
}

model ImprovementPlan {
  id              String          @id @default(cuid())
  propertyId      String
  improvementType ImprovementType
  estimatedCost   Decimal?        @db.Decimal(12, 2)
  priority        String?
  timeline        String?
  feasibility     String?
  notes           String?
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  property        Property        @relation(fields: [propertyId], references: [id], onDelete: Cascade)
}

model Scenario {
  id                         String          @id @default(cuid())
  questId                    String
  name                       String
  currentPropertyId          String?
  targetPropertyId           String?
  strategyType               StrategyType
  expectedSalePrice          Decimal?        @db.Decimal(12, 2)
  sellingCostPercent         Decimal?        @db.Decimal(5, 2)
  rentEstimateMonthly        Decimal?        @db.Decimal(10, 2)
  vacancyPercent             Decimal?        @db.Decimal(5, 2)
  propertyManagementPercent  Decimal?        @db.Decimal(5, 2)
  maintenanceReservePercent  Decimal?        @db.Decimal(5, 2)
  appreciationRateAssumption Decimal?        @db.Decimal(5, 2)
  downPaymentPercent         Decimal?        @db.Decimal(5, 2)
  downPaymentAmount          Decimal?        @db.Decimal(12, 2)
  loanRate                   Decimal?        @db.Decimal(5, 2)
  loanTermMonths             Int?
  closingCostsBuy            Decimal?        @db.Decimal(12, 2)
  closingCostsSell           Decimal?        @db.Decimal(12, 2)
  movingCosts                Decimal?        @db.Decimal(12, 2)
  renovationBudget           Decimal?        @db.Decimal(12, 2)
  greenhouseBuildCost        Decimal?        @db.Decimal(12, 2)
  conservatoryBuildCost      Decimal?        @db.Decimal(12, 2)
  gardenBuildCost            Decimal?        @db.Decimal(12, 2)
  beehiveSetupCost           Decimal?        @db.Decimal(12, 2)
  contributorMode            ContributorMode @default(none)
  moveInTimeline             String?
  notes                      String?
  createdByUserId            String
  createdAt                  DateTime        @default(now())
  updatedAt                  DateTime        @updatedAt
  quest                      Quest           @relation(fields: [questId], references: [id], onDelete: Cascade)
  currentProperty            Property?       @relation("CurrentProperty", fields: [currentPropertyId], references: [id], onDelete: SetNull)
  targetProperty             Property?       @relation("TargetProperty", fields: [targetPropertyId], references: [id], onDelete: SetNull)
  createdBy                  User            @relation(fields: [createdByUserId], references: [id], onDelete: Cascade)
  variants                   ScenarioVariant[]
  results                    ScenarioResult[]
}

model ScenarioVariant {
  id                String   @id @default(cuid())
  parentScenarioId  String
  createdByUserId   String
  variantName       String
  notes             String?
  changedInputsJson Json
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  parentScenario    Scenario @relation(fields: [parentScenarioId], references: [id], onDelete: Cascade)
  createdBy         User     @relation(fields: [createdByUserId], references: [id], onDelete: Cascade)
}

model ScenarioResult {
  id                        String   @id @default(cuid())
  scenarioId                String
  netSaleProceeds           Decimal? @db.Decimal(12, 2)
  equityDollars             Decimal? @db.Decimal(12, 2)
  equityPercent             Decimal? @db.Decimal(6, 3)
  retainedEquity            Decimal? @db.Decimal(12, 2)
  newMortgageAmount         Decimal? @db.Decimal(12, 2)
  projectedPaymentMonthly   Decimal? @db.Decimal(10, 2)
  totalMonthlyHousingCost   Decimal? @db.Decimal(10, 2)
  totalMonthlyDebt          Decimal? @db.Decimal(10, 2)
  dtiProxy                  Decimal? @db.Decimal(6, 3)
  rentalCashFlowMonthly     Decimal? @db.Decimal(10, 2)
  cashRequiredToClose       Decimal? @db.Decimal(12, 2)
  oneYearOutcome            Decimal? @db.Decimal(12, 2)
  fiveYearOutcome           Decimal? @db.Decimal(12, 2)
  affordabilityScore        Int?
  riskScore                 Int?
  dreamFitScore             Int?
  multigenerationalFitScore Int?
  landSuitabilityScore      Int?
  portfolioGrowthScore      Int?
  recommendationLabel       String?
  recommendationSummary     String?
  calculatedAt              DateTime @default(now())
  scenario                  Scenario @relation(fields: [scenarioId], references: [id], onDelete: Cascade)

  @@index([scenarioId, calculatedAt])
}

model PropertyCopyEvent {
  id                 String   @id @default(cuid())
  sourcePropertyId   String
  sourceQuestId      String
  destinationQuestId String
  copiedByUserId     String
  createdAt          DateTime @default(now())
  sourceProperty     Property @relation("CopySourceProperty", fields: [sourcePropertyId], references: [id], onDelete: Cascade)
  sourceQuest        Quest    @relation("CopySourceQuest", fields: [sourceQuestId], references: [id], onDelete: Cascade)
  destinationQuest   Quest    @relation("CopyDestinationQuest", fields: [destinationQuestId], references: [id], onDelete: Cascade)
  copiedBy           User     @relation(fields: [copiedByUserId], references: [id], onDelete: Cascade)
}
```

---

## File: prisma/seed.ts

```ts
import {
  PrismaClient,
  QuestRole,
  PropertyRole,
  WatchlistStatus,
  HouseholdRole,
  HouseholdStatus,
  ContributorType,
  ConfidenceLevel,
  LiabilityType,
  DreamCategory,
  DreamPriority,
  StrategyType,
  ContributorMode,
  InvitationStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const rob = await prisma.user.upsert({
    where: { email: 'rob@example.com' },
    update: {},
    create: {
      email: 'rob@example.com',
      displayName: 'Rob',
    },
  });

  const husband = await prisma.user.upsert({
    where: { email: 'husband@example.com' },
    update: {},
    create: {
      email: 'husband@example.com',
      displayName: 'Husband',
    },
  });

  const mom = await prisma.user.upsert({
    where: { email: 'mom@example.com' },
    update: {},
    create: {
      email: 'mom@example.com',
      displayName: 'Mom',
    },
  });

  const quest = await prisma.quest.create({
    data: {
      name: 'Rob + Husband NestQuest',
      description: 'Primary shared planning workspace for move, garden, and multigenerational scenarios.',
      ownerUserId: rob.id,
      targetTimeline: '12-18 months',
      defaultLocation: 'Dallas-Fort Worth',
      members: {
        create: [
          { userId: rob.id, role: QuestRole.owner, invitationStatus: InvitationStatus.accepted },
          { userId: husband.id, role: QuestRole.co_planner, invitationStatus: InvitationStatus.accepted },
          { userId: mom.id, role: QuestRole.contributor, invitationStatus: InvitationStatus.accepted },
        ],
      },
    },
  });

  const currentHome = await prisma.property.create({
    data: {
      questId: quest.id,
      propertyRole: PropertyRole.current_primary,
      addressLine1: '101 Current Home Dr',
      city: 'Fort Worth',
      state: 'TX',
      postalCode: '76101',
      estimatedValue: 410000,
      purchasePrice: 315000,
      squareFeet: 2100,
      lotSize: 0.22,
      yardSize: 4500,
      beds: 4,
      baths: 2.5,
      yearBuilt: 2008,
      garageSpaces: 2,
      taxMonthly: 650,
      insuranceMonthly: 185,
      hoaMonthly: 55,
      watchlistStatus: WatchlistStatus.researching,
      sourceType: 'manual',
      createdByUserId: rob.id,
      fitProfile: {
        create: {
          multigenerationalFit: 'medium',
          privacyFit: 'low',
          agingInPlaceFit: 'low',
          accessibilityFit: 'low',
          expansionPotential: 'medium',
          dreamFitSummary: 'Usable but limited for greenhouse, parents, and larger garden vision.',
        },
      },
      landProfile: {
        create: {
          sunlightQuality: 'medium',
          soilQuality: 'fair',
          drainageQuality: 'good',
          floodRisk: 'low',
          slopeUsability: 'high',
          greenhouseFeasibility: 'medium',
          conservatoryFeasibility: 'low',
          gardenFeasibility: 'medium',
          beehiveSuitability: 'low',
          pollinatorPotential: 'medium',
          irrigationFeasibility: 'medium',
          hoaOrZoningConstraintRisk: 'medium',
          sourceType: 'manual',
        },
      },
    },
  });

  await prisma.liability.createMany({
    data: [
      {
        questId: quest.id,
        linkedPropertyId: currentHome.id,
        liabilityType: LiabilityType.mortgage,
        lenderName: 'Primary Mortgage Co',
        currentBalance: 248000,
        interestRate: 3.25,
        monthlyPayment: 1540,
        variablePaymentFlag: false,
        notes: 'Current primary mortgage',
      },
      {
        questId: quest.id,
        liabilityType: LiabilityType.student_loan,
        lenderName: 'Federal Student Aid',
        currentBalance: 28500,
        interestRate: 5.1,
        monthlyPayment: 320,
        variablePaymentFlag: false,
      },
      {
        questId: quest.id,
        liabilityType: LiabilityType.credit_card,
        lenderName: 'Rewards Card',
        currentBalance: 8900,
        interestRate: 21.99,
        monthlyPayment: 240,
        variablePaymentFlag: true,
      },
      {
        questId: quest.id,
        liabilityType: LiabilityType.auto_loan,
        lenderName: 'Auto Bank',
        currentBalance: 14500,
        interestRate: 4.2,
        monthlyPayment: 365,
        variablePaymentFlag: false,
      },
    ],
  });

  const momMember = await prisma.householdMember.create({
    data: {
      questId: quest.id,
      displayName: 'Mom',
      role: HouseholdRole.parent,
      status: HouseholdStatus.future_household,
      estimatedMoveInTimeline: '12-24 months',
      bedroomNeed: 'private suite preferred',
      bathroomNeed: 'easy access',
      accessibilityNeedLevel: 'medium',
      privacyNeedLevel: 'high',
      notes: 'May contribute monthly if she joins the household.',
    },
  });

  await prisma.householdMember.create({
    data: {
      questId: quest.id,
      displayName: 'Mother-in-law',
      role: HouseholdRole.in_law,
      status: HouseholdStatus.future_household,
      estimatedMoveInTimeline: '6-12 months',
      bedroomNeed: 'private bedroom',
      bathroomNeed: 'shared ok',
      accessibilityNeedLevel: 'medium',
      privacyNeedLevel: 'medium',
      notes: 'Move-in expected sooner than parents.',
    },
  });

  await prisma.financialContributor.create({
    data: {
      questId: quest.id,
      linkedUserId: mom.id,
      linkedHouseholdMemberId: momMember.id,
      contributionType: ContributorType.fixed_monthly,
      amount: 900,
      startTimeline: 'when moved in',
      confidenceLevel: ConfidenceLevel.medium,
      notes: 'Mom contribution if shared household plan moves forward.',
      enteredByUserId: mom.id,
    },
  });

  await prisma.dreamTarget.createMany({
    data: [
      {
        questId: quest.id,
        name: 'Greenhouse or room to build one',
        category: DreamCategory.greenhouse,
        priority: DreamPriority.must_have,
      },
      {
        questId: quest.id,
        name: 'Lush backyard garden',
        category: DreamCategory.garden,
        priority: DreamPriority.must_have,
      },
      {
        questId: quest.id,
        name: 'Beehive suitability',
        category: DreamCategory.homestead,
        priority: DreamPriority.strong_preference,
      },
      {
        questId: quest.id,
        name: 'Multigenerational living capacity',
        category: DreamCategory.multigenerational,
        priority: DreamPriority.must_have,
      },
      {
        questId: quest.id,
        name: 'Low flood risk',
        category: DreamCategory.other,
        priority: DreamPriority.non_negotiable,
      },
    ],
  });

  const targetA = await prisma.property.create({
    data: {
      questId: quest.id,
      propertyRole: PropertyRole.target_candidate,
      addressLine1: '22 Garden Terrace',
      city: 'Aledo',
      state: 'TX',
      postalCode: '76008',
      listingUrl: 'https://example.com/listings/22-garden-terrace',
      listingPrice: 575000,
      targetOfferPrice: 560000,
      squareFeet: 3120,
      lotSize: 0.62,
      yardSize: 18000,
      beds: 5,
      baths: 3.5,
      yearBuilt: 2016,
      garageSpaces: 3,
      hoaMonthly: 40,
      taxMonthly: 880,
      insuranceMonthly: 240,
      watchlistStatus: WatchlistStatus.serious_contender,
      sourceType: 'listing_url',
      createdByUserId: rob.id,
      fitProfile: {
        create: {
          multigenerationalFit: 'high',
          privacyFit: 'high',
          agingInPlaceFit: 'medium',
          accessibilityFit: 'medium',
          expansionPotential: 'high',
          dreamFitSummary: 'Strong candidate for greenhouse, garden, and future parent/in-law support.',
        },
      },
      landProfile: {
        create: {
          sunlightQuality: 'high',
          soilQuality: 'good',
          drainageQuality: 'good',
          floodRisk: 'low',
          slopeUsability: 'high',
          greenhouseFeasibility: 'high',
          conservatoryFeasibility: 'medium',
          gardenFeasibility: 'high',
          beehiveSuitability: 'high',
          pollinatorPotential: 'high',
          irrigationFeasibility: 'medium',
          hoaOrZoningConstraintRisk: 'low',
          sourceType: 'external_data',
        },
      },
    },
  });

  const targetB = await prisma.property.create({
    data: {
      questId: quest.id,
      propertyRole: PropertyRole.target_candidate,
      addressLine1: '88 Courtyard Lane',
      city: 'Benbrook',
      state: 'TX',
      postalCode: '76126',
      listingUrl: 'https://example.com/listings/88-courtyard-lane',
      listingPrice: 495000,
      targetOfferPrice: 485000,
      squareFeet: 2680,
      lotSize: 0.31,
      yardSize: 8200,
      beds: 4,
      baths: 3,
      yearBuilt: 2012,
      garageSpaces: 2,
      hoaMonthly: 0,
      taxMonthly: 710,
      insuranceMonthly: 210,
      watchlistStatus: WatchlistStatus.interested,
      sourceType: 'listing_url',
      createdByUserId: rob.id,
      fitProfile: {
        create: {
          multigenerationalFit: 'medium',
          privacyFit: 'medium',
          agingInPlaceFit: 'medium',
          accessibilityFit: 'medium',
          expansionPotential: 'medium',
          dreamFitSummary: 'Good courtyard and lifestyle potential, but less ideal for beehives and extended family layout.',
        },
      },
      landProfile: {
        create: {
          sunlightQuality: 'medium',
          soilQuality: 'fair',
          drainageQuality: 'good',
          floodRisk: 'low',
          slopeUsability: 'medium',
          greenhouseFeasibility: 'medium',
          conservatoryFeasibility: 'high',
          gardenFeasibility: 'medium',
          beehiveSuitability: 'low',
          pollinatorPotential: 'medium',
          irrigationFeasibility: 'medium',
          hoaOrZoningConstraintRisk: 'low',
          sourceType: 'manual',
        },
      },
    },
  });

  const sellScenario = await prisma.scenario.create({
    data: {
      questId: quest.id,
      name: 'Sell current home and buy Garden Terrace',
      currentPropertyId: currentHome.id,
      targetPropertyId: targetA.id,
      strategyType: StrategyType.sell_and_buy,
      expectedSalePrice: 405000,
      sellingCostPercent: 7,
      downPaymentPercent: 20,
      downPaymentAmount: 112000,
      loanRate: 6.5,
      loanTermMonths: 360,
      closingCostsBuy: 12000,
      closingCostsSell: 28000,
      movingCosts: 5500,
      contributorMode: ContributorMode.partial,
      moveInTimeline: '6-9 months',
      notes: 'Primary balanced scenario using sale proceeds.',
      createdByUserId: rob.id,
    },
  });

  await prisma.scenarioResult.create({
    data: {
      scenarioId: sellScenario.id,
      netSaleProceeds: 128650,
      equityDollars: 162000,
      equityPercent: 0.395,
      retainedEquity: 0,
      newMortgageAmount: 448000,
      projectedPaymentMonthly: 2832,
      totalMonthlyHousingCost: 3962,
      totalMonthlyDebt: 4887,
      dtiProxy: 0.39,
      rentalCashFlowMonthly: 0,
      cashRequiredToClose: 32950,
      oneYearOutcome: 18500,
      fiveYearOutcome: 128000,
      affordabilityScore: 76,
      riskScore: 69,
      dreamFitScore: 91,
      multigenerationalFitScore: 84,
      landSuitabilityScore: 90,
      portfolioGrowthScore: 62,
      recommendationLabel: 'best_balanced_option',
      recommendationSummary: 'Strong overall fit with garden, greenhouse, beehive, and multigenerational upside. Requires disciplined cash-to-close planning but is achievable with sale proceeds.',
    },
  });

  const rentScenario = await prisma.scenario.create({
    data: {
      questId: quest.id,
      name: 'Rent current home and buy Garden Terrace',
      currentPropertyId: currentHome.id,
      targetPropertyId: targetA.id,
      strategyType: StrategyType.rent_and_buy,
      expectedSalePrice: 405000,
      rentEstimateMonthly: 2650,
      vacancyPercent: 5,
      propertyManagementPercent: 8,
      maintenanceReservePercent: 7,
      downPaymentPercent: 15,
      downPaymentAmount: 84000,
      loanRate: 6.75,
      loanTermMonths: 360,
      closingCostsBuy: 12000,
      movingCosts: 6500,
      contributorMode: ContributorMode.partial,
      moveInTimeline: '9-12 months',
      notes: 'Long-term wealth path with more complexity.',
      createdByUserId: husband.id,
    },
  });

  await prisma.scenarioResult.create({
    data: {
      scenarioId: rentScenario.id,
      netSaleProceeds: 0,
      equityDollars: 162000,
      equityPercent: 0.395,
      retainedEquity: 162000,
      newMortgageAmount: 476000,
      projectedPaymentMonthly: 3087,
      totalMonthlyHousingCost: 4217,
      totalMonthlyDebt: 5142,
      dtiProxy: 0.41,
      rentalCashFlowMonthly: 155,
      cashRequiredToClose: 102500,
      oneYearOutcome: 24200,
      fiveYearOutcome: 176500,
      affordabilityScore: 58,
      riskScore: 51,
      dreamFitScore: 91,
      multigenerationalFitScore: 84,
      landSuitabilityScore: 90,
      portfolioGrowthScore: 86,
      recommendationLabel: 'best_long_term_wealth_option',
      recommendationSummary: 'Best long-term wealth path if cash flow remains stable. Harder near-term close due to higher cash requirement and more moving pieces.',
    },
  });

  await prisma.propertyComment.createMany({
    data: [
      {
        propertyId: targetA.id,
        userId: rob.id,
        body: 'This backyard looks ideal for greenhouse placement and a larger pollinator garden.',
        tag: 'garden',
      },
      {
        propertyId: targetA.id,
        userId: husband.id,
        body: 'Layout seems promising for mother-in-law and future parents, especially with extra bedroom separation.',
        tag: 'parents',
      },
      {
        propertyId: targetB.id,
        userId: mom.id,
        body: 'I like the courtyard concept, but this feels less flexible if more family joins later.',
        tag: 'fit',
      },
    ],
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## File: docs/sample-scenarios.md

```md
# Sample Scenarios

## Scenario 1: Sell and Buy Dream Garden Property
- Current home sold at expected market value
- 20% down on target home
- Moderate moving costs
- Goal: maximize dream fit while keeping affordability workable

## Scenario 2: Rent Current Home and Buy Dream Property
- Current home retained as rental
- Rent estimate based on neighborhood assumptions
- Lower down payment, higher ongoing debt burden
- Goal: maximize long-term wealth and retained equity

## Scenario 3: Buy Then Improve
- Choose more affordable home
- Add greenhouse and garden buildout later
- Lower purchase price, higher phased improvement spend
- Goal: reduce immediate affordability pressure while preserving dream trajectory

## Scenario 4: Multigenerational Merge Scenario
- Mother-in-law moves in within 12 months
- Mom may join within 24 months and contribute monthly
- Accessibility and privacy needs weighted more heavily
- Goal: optimize for household fit and lower future relocation pressure

## Scenario 5: Debt Paydown Unlock Path
- Delay purchase by 9–12 months
- Pay down credit card debt aggressively
- Improve affordability score and cash-to-close readiness
- Goal: turn stretch dream into close/ready path
```

---

## File: docs/engineering-tickets.md

```md
# Engineering Tickets

## Epic A: Foundation

### NQ-001 Set up NestQuest app scaffold
**Type:** Engineering
**Description:** Create the initial app structure for NestQuest with docs, src, server, and prisma folders.
**Acceptance Criteria:**
- Base app folders exist
- Project boots locally
- Environment variables documented

### NQ-002 Implement authentication foundation
**Type:** Engineering
**Description:** Add auth flow and protected API access.
**Acceptance Criteria:**
- User can sign up and sign in
- Protected routes require auth
- User identity available in API context

### NQ-003 Add Prisma and initial database configuration
**Type:** Engineering
**Description:** Configure Prisma, database connection, and migration tooling.
**Acceptance Criteria:**
- Prisma configured against Postgres
- Initial migration command works
- Prisma client generated

## Epic B: Quests and Membership

### NQ-010 Implement Quest model and CRUD API
**Type:** Backend
**Acceptance Criteria:**
- Create quest
- List current user quests
- Update quest metadata

### NQ-011 Implement quest membership model
**Type:** Backend
**Acceptance Criteria:**
- Owner membership created automatically
- User can belong to multiple quests
- Membership enforced in API authorization

### NQ-012 Implement quest invitation flow
**Type:** Backend/Frontend
**Acceptance Criteria:**
- Invite by email
- Invitation record stored
- Acceptance flow updates membership

### NQ-013 Build quest switcher UI
**Type:** Frontend
**Acceptance Criteria:**
- User can switch between quests
- Active quest context updates all pages

## Epic C: Properties

### NQ-020 Implement Property model and CRUD API
**Type:** Backend
**Acceptance Criteria:**
- Create current and target properties
- Update property fields
- List quest properties

### NQ-021 Build property board screen
**Type:** Frontend
**Acceptance Criteria:**
- Shows property cards
- Supports watchlist status display
- Filters by watchlist status

### NQ-022 Build property detail screen
**Type:** Frontend
**Acceptance Criteria:**
- Shows overview data
- Includes tabs for fit, scenarios, comments, media

### NQ-023 Add fit profile and land profile editing
**Type:** Full Stack
**Acceptance Criteria:**
- User can edit greenhouse, garden, flood, sunlight, beehive, and multigenerational fit fields

## Epic D: Household, Contributors, Liabilities

### NQ-030 Implement household member CRUD
**Type:** Full Stack
**Acceptance Criteria:**
- Add/edit household member
- Capture timeline, privacy, accessibility fields

### NQ-031 Implement contributor CRUD
**Type:** Full Stack
**Acceptance Criteria:**
- Add/edit contributor
- Capture amount, timeline, confidence
- Contributor tied to quest and optional household member

### NQ-032 Implement liability CRUD
**Type:** Full Stack
**Acceptance Criteria:**
- Add/edit/delete liabilities
- Support mortgage, student loan, credit card, auto loan, personal loan

## Epic E: Scenario Engine

### NQ-040 Implement Scenario model and CRUD API
**Type:** Backend
**Acceptance Criteria:**
- Create scenario
- Update scenario
- List scenarios by quest

### NQ-041 Build scenario calculation service
**Type:** Backend
**Acceptance Criteria:**
- Calculates mortgage payment
- Calculates net sale proceeds
- Calculates total monthly debt
- Calculates cash required to close
- Stores scenario results

### NQ-042 Build scenario lab UI
**Type:** Frontend
**Acceptance Criteria:**
- User can edit assumptions
- User can run scenario
- KPI results shown in readable layout

### NQ-043 Build scenario compare mode
**Type:** Frontend
**Acceptance Criteria:**
- Compare 2–4 scenarios side by side
- KPIs align consistently

## Epic F: Recommendations and Dream Gap

### NQ-050 Implement recommendation rule engine
**Type:** Backend
**Acceptance Criteria:**
- Produces recommendation label
- Produces plain-English summary
- Supports multiple optimization lenses

### NQ-051 Build KPI summary cards
**Type:** Frontend
**Acceptance Criteria:**
- Shows affordability, debt, and closing metrics clearly

### NQ-052 Implement dream gap calculations
**Type:** Backend
**Acceptance Criteria:**
- Produces readiness label
- Produces debt, cash, contribution, and sale threshold gaps

### NQ-053 Build dream gap planner UI
**Type:** Frontend
**Acceptance Criteria:**
- Shows readiness label
- Shows unlock targets
- Can save unlock path as scenario

## Epic G: Collaboration

### NQ-060 Implement property comments API
**Type:** Backend
**Acceptance Criteria:**
- Add comment
- Reply to comment
- List comments by property

### NQ-061 Build property comments UI
**Type:** Frontend
**Acceptance Criteria:**
- Threaded comment view
- Add reply flow
- Tag support

### NQ-062 Implement scenario variants
**Type:** Full Stack
**Acceptance Criteria:**
- Create variant from scenario
- Persist changed inputs JSON
- Compare baseline vs variant

## Epic H: Smart Input

### NQ-070 Implement listing analysis endpoint shell
**Type:** Backend
**Acceptance Criteria:**
- Accepts listing URL
- Returns extracted draft payload contract
- Safe failure handling if parsing fails

### NQ-071 Build add-by-URL property flow
**Type:** Frontend
**Acceptance Criteria:**
- User pastes listing URL
- Prefill form appears
- User can edit before save

### NQ-072 Implement media upload support
**Type:** Full Stack
**Acceptance Criteria:**
- Upload property media
- Display in property detail

### NQ-073 Implement property observations store
**Type:** Backend
**Acceptance Criteria:**
- Supports manual and extracted observations
- Stores source type and confidence

## Epic I: Cross-Quest and Activity

### NQ-080 Implement activity feed API
**Type:** Backend
**Acceptance Criteria:**
- Returns recent property, comment, scenario, and contributor events

### NQ-081 Build activity feed UI
**Type:** Frontend
**Acceptance Criteria:**
- Feed visible on quest home and activity page

### NQ-082 Implement property copy across quests
**Type:** Full Stack
**Acceptance Criteria:**
- User can copy property to another accessible quest
- Copy lineage recorded

## Epic J: Quality

### NQ-090 Add unit tests for calculation engine
**Type:** Engineering
**Acceptance Criteria:**
- Mortgage calculations tested
- Sale proceeds calculations tested
- Dream gap calculations tested

### NQ-091 Add integration tests for quest authorization
**Type:** Engineering
**Acceptance Criteria:**
- Non-members blocked
- Members can access their quest resources

### NQ-092 Add end-to-end smoke tests for core flow
**Type:** Engineering
**Acceptance Criteria:**
- Create quest
- Add property
- Add liability
- Run scenario
- View recommendation
```

---

## File: docs/next-steps.md

```md
# Next Steps

1. Create the Postgres database and set `DATABASE_URL`.
2. Save `prisma/schema.prisma` and run the first migration.
3. Save `prisma/seed.ts` and run the seed script.
4. Save `docs/openapi.yaml` and use it to scaffold route handlers.
5. Start with tickets NQ-001 through NQ-013.
6. Implement Tier 1 flow first: quest -> property -> liability -> scenario -> recommendation.

## Recommended First Implementation Slice
- Auth
- Quest CRUD
- Property CRUD
- Liability CRUD
- Scenario CRUD
- Scenario run endpoint
- Basic recommendation summary
- Property comments

## Suggested Commands
```bash
npx prisma migrate dev --name init
npx prisma generate
node --loader ts-node/esm prisma/seed.ts
```
```

