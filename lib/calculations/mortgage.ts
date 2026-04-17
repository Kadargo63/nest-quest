export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateMonthlyPrincipalAndInterest(
  principal: number,
  annualRatePercent: number,
  termMonths: number,
): number {
  if (principal <= 0 || annualRatePercent <= 0 || termMonths <= 0) return 0;

  const monthlyRate = annualRatePercent / 100 / 12;
  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths);
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;

  if (denominator === 0) return 0;

  return roundCurrency(numerator / denominator);
}
