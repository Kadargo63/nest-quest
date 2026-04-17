# NestQuest Dependency Map

Last updated: 2026-04-17

---

## 1. External Dependencies

```
next@16.2.4           App Router, Server Actions, Turbopack
react@19.2.5          UI rendering
react-dom@19.2.5      DOM rendering
tailwindcss@4.2.2     Utility-first CSS (v4, no config file)
@tailwindcss/postcss  PostCSS integration for Tailwind
@prisma/client@6.19.3  Database ORM client
prisma@6.19.3         Schema management, migrations, studio
zod                   Runtime validation for server actions
tsx                   TypeScript execution (seed script)
typescript            Type checking
```

---

## 2. Internal Module Dependency Graph

```

                        PAGES (app/)                         
                                                             
  app/page.tsx  lib/queries.ts                
  app/quests/page.tsx  lib/queries.ts                
  app/quests/[questId]/page.tsx  lib/queries.ts           
  app/quests/[questId]/properties/page.tsx  lib/queries   
  app/quests/[questId]/household/page.tsx  lib/queries    
  app/quests/[questId]/dream-gap/page.tsx  lib/queries    
  app/quests/[questId]/activity/page.tsx  lib/prisma      
  app/properties/[propertyId]/page.tsx  lib/queries       
  app/scenarios/[scenarioId]/page.tsx  lib/prisma         
                                                             
  All pages  components/ui/{Card, SectionTitle}           
  Form pages  components/forms/SubmitButton               
  Property lists  components/properties/PropertyCard      
  Scenario detail  components/scenarios/KpiCard           

          
          

                   SERVER ACTIONS (app/actions/)              
                                                             
  quest-actions.ts  lib/prisma, lib/auth                  
  property-actions.ts  lib/prisma, lib/auth               
                         + @prisma/client enums              
  liability-actions.ts  lib/prisma                        
                           + @prisma/client enums            
  scenario-actions.ts  lib/prisma, lib/auth               
                          + lib/calculations/scenario-engine 
                          + lib/recommendations              
                          + @prisma/client enums             

          
          

                     LIB (lib/)                              
                                                             
  lib/queries.ts  lib/prisma, lib/auth                    
  lib/auth.ts  lib/prisma                                 
  lib/prisma.ts  @prisma/client                           
  lib/utils.ts  (no deps)                                 
  lib/recommendations.ts  lib/calculations/scenario-engine
  lib/calculations/scenario-engine.ts  lib/calculations/  
                                          mortgage           
  lib/calculations/mortgage.ts  (no deps)                 

          
          

                    PRISMA (prisma/)                          
                                                             
  prisma/schema.prisma  DATABASE_URL env var              
  prisma/seed.ts  @prisma/client (all enums)              

```

---

## 3. File-Level Import Map

### lib/prisma.ts
```
 @prisma/client
 used by: lib/auth, lib/queries, app/actions/*, app/scenarios/*/page, app/activity/page
```

### lib/auth.ts
```
 lib/prisma
 used by: lib/queries, app/actions/{quest,property,scenario}
```

### lib/queries.ts
```
 lib/prisma, lib/auth
 used by: app/page, app/quests/page, app/quests/[questId]/page,
           app/quests/[questId]/properties/*, app/quests/[questId]/household,
           app/quests/[questId]/dream-gap, app/quests/[questId]/scenarios/new,
           app/properties/[propertyId]/page
```

### lib/utils.ts
```
 (none)
 used by: app/quests/[questId]/page, app/scenarios/[scenarioId]/page,
           components/properties/PropertyCard
```

### lib/calculations/mortgage.ts
```
 (none)
 used by: lib/calculations/scenario-engine
```

### lib/calculations/scenario-engine.ts
```
 lib/calculations/mortgage
 used by: app/actions/scenario-actions, lib/recommendations
```

### lib/recommendations.ts
```
 lib/calculations/scenario-engine (types only)
 used by: app/actions/scenario-actions
```

---

## 4. Component Usage Map

| Component | Used By |
|-----------|---------|
| `Card` | app/page, quests/page, quests/[questId]/page, properties/[propertyId]/page, scenarios/[scenarioId]/page, household/page, dream-gap/page, activity/page |
| `SectionTitle` | All pages |
| `SubmitButton` | quests/new, properties/new, liabilities/new, scenarios/new, properties/[propertyId], scenarios/[scenarioId] |
| `PropertyCard` | quests/[questId]/page, quests/[questId]/properties/page |
| `KpiCard` | scenarios/[scenarioId]/page |

---

## 5. Data Flow: Scenario Execution

```
User clicks "Run Scenario" on /scenarios/[scenarioId]
    
    
app/actions/scenario-actions.ts  runScenarioAction(formData)
    
     prisma.scenario.findUnique (with currentProperty, targetProperty, quest.liabilities, quest.contributors)
    
     Extract: currentMortgageLiability, nonHousingMonthlyDebt, contributorDownPaymentSupport
    
     lib/calculations/scenario-engine.ts  calculateScenario(input)
        lib/calculations/mortgage.ts  calculateMonthlyPrincipalAndInterest()
    
     lib/recommendations.ts  buildRecommendation(result)
        scoreAffordability() + scoreRisk()  label + summary
    
     prisma.scenarioResult.create (persist calculated result)
    
     revalidatePath  page re-renders with new result
```