import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function ActivityPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;

  const [properties, comments, scenarios, contributors] = await Promise.all([
    prisma.property.findMany({ where: { questId }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.propertyComment.findMany({ where: { property: { questId } }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.scenario.findMany({ where: { questId }, orderBy: { createdAt: 'desc' }, take: 10 }),
    prisma.financialContributor.findMany({ where: { questId }, orderBy: { updatedAt: 'desc' }, take: 10 }),
  ]);

  return (
    <div>
      <SectionTitle title="Activity" subtitle="Recent property, scenario, and contribution updates." />
      <div className="space-y-3">
        {properties.map((item) => (
          <Card key={`p-${item.id}`}>Property added: {item.addressLine1 || 'Untitled property'}</Card>
        ))}
        {comments.map((item) => (
          <Card key={`c-${item.id}`}>Comment added: {item.body}</Card>
        ))}
        {scenarios.map((item) => (
          <Card key={`s-${item.id}`}>Scenario created: {item.name}</Card>
        ))}
        {contributors.map((item) => (
          <Card key={`f-${item.id}`}>Contributor updated: {Number(item.amount).toLocaleString()}</Card>
        ))}
      </div>
    </div>
  );
}