import Link from 'next/link';
import { getUserQuests } from '@/lib/queries';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const quests = await getUserQuests();

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Welcome to NestQuest"
        subtitle="Collaborative housing and homestead planning for dream homes, multigenerational living, and debt-aware scenarios."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>Track current home, target homes, debt, and contributors.</Card>
        <Card>Model sell, rent, hold, and buy-then-improve scenarios.</Card>
        <Card>See dream-gap targets for greenhouse, gardens, beehives, and family plans.</Card>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle title="Your Quests" />
          <Link href="/quests/new" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm">
            New Quest
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quests.map((quest) => (
            <Link key={quest.id} href={`/quests/${quest.id}`}>
              <Card>
                <h3 className="font-medium">{quest.name}</h3>
                <p className="mt-2 text-sm text-slate-500">{quest.description || 'No description yet.'}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
