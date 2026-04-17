import Link from 'next/link';
import { getUserQuests } from '@/lib/queries';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export const dynamic = 'force-dynamic';

export default async function QuestsPage() {
  const quests = await getUserQuests();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle title="Quests" subtitle="Your shared and personal planning workspaces." />
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
    </div>
  );
}
