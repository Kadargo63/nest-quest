import { ScenarioCalculationResult } from '@/lib/calculations/scenario-engine';

export function buildRecommendation(result: ScenarioCalculationResult) {
  const affordabilityScore = scoreAffordability(result.dtiProxy, result.cashRequiredToClose);
  const riskScore = scoreRisk(result.dtiProxy, result.rentalCashFlowMonthly);

  let label = 'Balanced option';
  let summary = 'Solid baseline scenario with manageable tradeoffs.';

  if (affordabilityScore >= 80 && riskScore >= 70) {
    label = 'Best balanced option';
    summary = 'Strong overall scenario with good affordability and moderate risk.';
  } else if (result.cashRequiredToClose > 50000) {
    label = 'Stretch option';
    summary = 'Promising scenario, but cash to close is still a major hurdle.';
  } else if (result.rentalCashFlowMonthly > 0) {
    label = 'Long-term wealth option';
    summary = 'This path appears stronger for long-term wealth, but it adds complexity.';
  }

  return {
    label,
    summary,
    affordabilityScore,
    riskScore,
  };
}

function scoreAffordability(dtiProxy: number, cashRequiredToClose: number) {
  let score = 100;
  if (dtiProxy > 0.43) score -= 30;
  else if (dtiProxy > 0.36) score -= 15;

  if (cashRequiredToClose > 100000) score -= 30;
  else if (cashRequiredToClose > 50000) score -= 15;
  else if (cashRequiredToClose > 25000) score -= 5;

  return Math.max(0, score);
}

function scoreRisk(dtiProxy: number, rentalCashFlowMonthly: number) {
  let score = 100;
  if (dtiProxy > 0.43) score -= 25;
  else if (dtiProxy > 0.36) score -= 10;

  if (rentalCashFlowMonthly < 0) score -= 20;
  else if (rentalCashFlowMonthly < 200) score -= 10;

  return Math.max(0, score);
}
