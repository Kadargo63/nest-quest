import { getQuestOrThrow } from '@/lib/queries';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function HouseholdPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;
  const quest = await getQuestOrThrow(questId);

  return (
    <div>
      <SectionTitle title="Household Planning" subtitle="Current and future household members, contributions, and living needs." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quest.householdMembers.map((member) => (
          <Card key={member.id}>
            <h3 className="font-medium">{member.displayName}</h3>
            <div className="mt-2 text-sm text-slate-600">{member.role}</div>
            <div className="mt-1 text-sm text-slate-600">Timeline: {member.estimatedMoveInTimeline || '\u2014'}</div>
            <div className="mt-1 text-sm text-slate-600">Accessibility: {member.accessibilityNeedLevel || '\u2014'}</div>
            <div className="mt-1 text-sm text-slate-600">Privacy: {member.privacyNeedLevel || '\u2014'}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}