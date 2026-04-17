import { getQuestOrThrow } from '@/lib/queries';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function DreamGapPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;
  const quest = await getQuestOrThrow(questId);
  const targetProperties = quest.properties.filter((item) => item.propertyRole === 'target_candidate');

  return (
    <div>
      <SectionTitle title="Dream Gap Planner" subtitle="See what financial targets would make a dream property realistic." />
      <div className="space-y-4">
        {targetProperties.map((property) => (
          <Card key={property.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">{property.addressLine1 || 'Untitled property'}</h3>
                <p className="mt-1 text-sm text-slate-500">Readiness: Close</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">Close</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4 text-sm">
              <div className="rounded-xl border border-slate-200 p-3">Debt reduction target: $9,000</div>
              <div className="rounded-xl border border-slate-200 p-3">Cash gap: $12,500</div>
              <div className="rounded-xl border border-slate-200 p-3">Contribution gap: $800/mo</div>
              <div className="rounded-xl border border-slate-200 p-3">Suggested timeline: 9-12 months</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}