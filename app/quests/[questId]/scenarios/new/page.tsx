import { createScenarioAction } from '@/app/actions/scenario-actions';
import { getQuestOrThrow } from '@/lib/queries';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function NewScenarioPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;
  const quest = await getQuestOrThrow(questId);
  const currentProperties = quest.properties.filter((item) => item.propertyRole === 'current_primary');
  const targetProperties = quest.properties.filter((item) => item.propertyRole === 'target_candidate');

  return (
    <div className="max-w-4xl">
      <SectionTitle title="Create Scenario" subtitle="Model sell, rent, hold, or improvement paths." />
      <Card>
        <form action={createScenarioAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="questId" value={questId} />
          <input name="name" placeholder="Scenario name" className="rounded-xl border border-slate-300 p-3 md:col-span-2" required />
          <select name="currentPropertyId" className="rounded-xl border border-slate-300 p-3">
            <option value="">Select current property</option>
            {currentProperties.map((item) => (<option key={item.id} value={item.id}>{item.addressLine1}</option>))}
          </select>
          <select name="targetPropertyId" className="rounded-xl border border-slate-300 p-3">
            <option value="">Select target property</option>
            {targetProperties.map((item) => (<option key={item.id} value={item.id}>{item.addressLine1}</option>))}
          </select>
          <select name="strategyType" className="rounded-xl border border-slate-300 p-3" defaultValue="sell_and_buy">
            <option value="sell_and_buy">Sell and buy</option>
            <option value="rent_and_buy">Rent and buy</option>
            <option value="hold_and_wait">Hold and wait</option>
            <option value="renovate_and_stay">Renovate and stay</option>
            <option value="household_merge">Household merge</option>
            <option value="buy_then_improve">Buy then improve</option>
          </select>
          <input name="expectedSalePrice" placeholder="Expected sale price" className="rounded-xl border border-slate-300 p-3" />
          <input name="sellingCostPercent" placeholder="Selling cost %" className="rounded-xl border border-slate-300 p-3" />
          <input name="rentEstimateMonthly" placeholder="Rent estimate monthly" className="rounded-xl border border-slate-300 p-3" />
          <input name="vacancyPercent" placeholder="Vacancy %" className="rounded-xl border border-slate-300 p-3" />
          <input name="propertyManagementPercent" placeholder="Management %" className="rounded-xl border border-slate-300 p-3" />
          <input name="maintenanceReservePercent" placeholder="Maintenance reserve %" className="rounded-xl border border-slate-300 p-3" />
          <input name="downPaymentAmount" placeholder="Down payment amount" className="rounded-xl border border-slate-300 p-3" />
          <input name="loanRate" placeholder="Loan rate" className="rounded-xl border border-slate-300 p-3" />
          <input name="loanTermMonths" placeholder="Loan term months" className="rounded-xl border border-slate-300 p-3" defaultValue="360" />
          <input name="closingCostsBuy" placeholder="Buyer closing costs" className="rounded-xl border border-slate-300 p-3" />
          <input name="movingCosts" placeholder="Moving costs" className="rounded-xl border border-slate-300 p-3" />
          <div className="md:col-span-2"><SubmitButton label="Create Scenario" /></div>
        </form>
      </Card>
    </div>
  );
}