import Link from 'next/link';
import { getQuestOrThrow } from '@/lib/queries';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function QuestPropertiesPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;
  const quest = await getQuestOrThrow(questId);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle title="Properties" subtitle="Current, target, and future homes in this quest." />
        <Link href={`/quests/${questId}/properties/new`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm">
          Add Property
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quest.properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}