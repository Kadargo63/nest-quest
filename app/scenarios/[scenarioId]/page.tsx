import { runScenarioAction } from '@/app/actions/scenario-actions';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { KpiCard } from '@/components/scenarios/KpiCard';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { prisma } from '@/lib/prisma';
import { currency, percent } from '@/lib/utils';

export default async function ScenarioDetailPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;

  const scenario = await prisma.scenario.findUnique({
    where: { id: scenarioId },
    include: {
      currentProperty: true,
      targetProperty: true,
      results: { orderBy: { calculatedAt: 'desc' }, take: 1 },
    },
  });

  if (!scenario) throw new Error('Scenario not found');

  const result = scenario.results[0];

  return (
    <div className="space-y-8">
      <SectionTitle title={scenario.name} subtitle={scenario.strategyType} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <h3 className="font-medium">Scenario Inputs</h3>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div>Current property: {scenario.currentProperty?.addressLine1 || '\u2014'}</div>
            <div>Target property: {scenario.targetProperty?.addressLine1 || '\u2014'}</div>
            <div>Expected sale: {currency(scenario.expectedSalePrice as any)}</div>
            <div>Down payment: {currency(scenario.downPaymentAmount as any)}</div>
            <div>Loan rate: {scenario.loanRate?.toString() || '\u2014'}%</div>
            <div>Loan term: {scenario.loanTermMonths || '\u2014'} months</div>
          </div>
          <form action={runScenarioAction} className="mt-6 grid gap-3">
            <input type="hidden" name="scenarioId" value={scenario.id} />
            <input name="grossMonthlyIncome" placeholder="Gross monthly income" defaultValue="12000" className="rounded-xl border border-slate-300 p-3" />
            <SubmitButton label="Run Scenario" />
          </form>
        </Card>
        <Card>
          <h3 className="font-medium">Recommendation</h3>
          {result ? (
            <>
              <div className="mt-3 text-lg font-semibold">{result.recommendationLabel || 'No label yet'}</div>
              <p className="mt-2 text-sm text-slate-600">{result.recommendationSummary || 'Run the scenario to generate a recommendation.'}</p>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-600">Run the scenario to see results.</p>
          )}
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Cash to Close" value={result ? currency(result.cashRequiredToClose as any) : '\u2014'} />
        <KpiCard label="Monthly Housing" value={result ? currency(result.totalMonthlyHousingCost as any) : '\u2014'} />
        <KpiCard label="Monthly Debt" value={result ? currency(result.totalMonthlyDebt as any) : '\u2014'} />
        <KpiCard label="DTI Proxy" value={result ? percent(result.dtiProxy as any) : '\u2014'} />
      </div>
    </div>
  );
}