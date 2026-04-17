import { createQuestAction } from '@/app/actions/quest-actions';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default function NewQuestPage() {
  return (
    <div className="max-w-2xl">
      <SectionTitle title="Create a New Quest" subtitle="Set up a shared workspace for your household planning." />
      <Card>
        <form action={createQuestAction} className="grid gap-4">
          <input name="name" placeholder="Quest name" className="rounded-xl border border-slate-300 p-3" required />
          <textarea name="description" placeholder="Description" className="rounded-xl border border-slate-300 p-3" rows={4} />
          <input name="targetTimeline" placeholder="Target timeline" className="rounded-xl border border-slate-300 p-3" />
          <input name="defaultLocation" placeholder="Default location" className="rounded-xl border border-slate-300 p-3" />
          <SubmitButton label="Create Quest" />
        </form>
      </Card>
    </div>
  );
}
