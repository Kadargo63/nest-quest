import Link from 'next/link';
import { getQuestOrThrow } from '@/lib/queries';
import { currency } from '@/lib/utils';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function QuestDetailPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;
  const quest = await getQuestOrThrow(questId);

  const currentProperty = quest.properties.find((item) => item.propertyRole === 'current_primary');
  const targetProperties = quest.properties.filter((item) => item.propertyRole === 'target_candidate');
  const totalDebt = quest.liabilities.reduce((sum, item) => sum + Number(item.monthlyPayment), 0);
  const totalContributors = quest.contributors.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle title={quest.name} subtitle={quest.description || 'No description yet.'} />
        <div className="flex gap-2">
          <Link href={`/quests/${questId}/properties/new`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm">
            Add Property
          </Link>
          <Link href={`/quests/${questId}/liabilities/new`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm">
            Add Liability
          </Link>
          <Link href={`/quests/${questId}/scenarios/new`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm">
            Add Scenario
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="text-sm text-slate-500">Current Home Value</div>
          <div className="mt-2 text-xl font-semibold">{currency(currentProperty?.estimatedValue as any)}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Monthly Debt</div>
          <div className="mt-2 text-xl font-semibold">{currency(totalDebt)}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Contributor Support</div>
          <div className="mt-2 text-xl font-semibold">{currency(totalContributors)}</div>
        </Card>
        <Card>
          <div className="text-sm text-slate-500">Target Homes</div>
          <div className="mt-2 text-xl font-semibold">{targetProperties.length}</div>
        </Card>
      </div>

      <section>
        <SectionTitle title="Liabilities" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quest.liabilities.map((liability) => (
            <Card key={liability.id}>
              <h3 className="font-medium">{liability.lenderName || liability.liabilityType}</h3>
              <div className="mt-2 text-sm text-slate-600">Type: {liability.liabilityType}</div>
              <div className="text-sm text-slate-600">Monthly: {currency(liability.monthlyPayment as any)}</div>
              <div className="text-sm text-slate-600">Balance: {currency(liability.currentBalance as any)}</div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle title="Target Properties" />
          <Link href={`/quests/${questId}/properties`} className="text-sm text-slate-600 underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {targetProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Recent Scenarios" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quest.scenarios.slice(0, 6).map((scenario) => (
            <Link key={scenario.id} href={`/scenarios/${scenario.id}`}>
              <Card>
                <h3 className="font-medium">{scenario.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{scenario.strategyType}</p>
                <p className="mt-3 text-sm">{scenario.results[0]?.recommendationSummary || 'No result yet.'}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}