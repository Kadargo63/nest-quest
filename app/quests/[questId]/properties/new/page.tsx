import { createPropertyAction } from '@/app/actions/property-actions';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function NewPropertyPage({ params }: { params: Promise<{ questId: string }> }) {
  const { questId } = await params;

  return (
    <div className="max-w-3xl">
      <SectionTitle title="Add Property" subtitle="Save a current home, target home, rental, or future property." />
      <Card>
        <form action={createPropertyAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="questId" value={questId} />
          <select name="propertyRole" className="rounded-xl border border-slate-300 p-3" defaultValue="target_candidate">
            <option value="current_primary">Current Home</option>
            <option value="target_candidate">Target Home</option>
            <option value="rental">Rental</option>
            <option value="secondary">Secondary</option>
          </select>
          <select name="watchlistStatus" className="rounded-xl border border-slate-300 p-3" defaultValue="researching">
            <option value="researching">Researching</option>
            <option value="interested">Interested</option>
            <option value="serious_contender">Serious contender</option>
            <option value="stretch_dream">Stretch dream</option>
            <option value="backup">Backup</option>
          </select>
          <input name="addressLine1" placeholder="Address" className="rounded-xl border border-slate-300 p-3 md:col-span-2" />
          <input name="city" placeholder="City" className="rounded-xl border border-slate-300 p-3" />
          <input name="state" placeholder="State" className="rounded-xl border border-slate-300 p-3" />
          <input name="postalCode" placeholder="Postal code" className="rounded-xl border border-slate-300 p-3" />
          <input name="listingPrice" placeholder="Listing price" className="rounded-xl border border-slate-300 p-3" />
          <input name="targetOfferPrice" placeholder="Target offer price" className="rounded-xl border border-slate-300 p-3" />
          <input name="estimatedValue" placeholder="Estimated value" className="rounded-xl border border-slate-300 p-3" />
          <input name="squareFeet" placeholder="Square feet" className="rounded-xl border border-slate-300 p-3" />
          <input name="yardSize" placeholder="Yard size" className="rounded-xl border border-slate-300 p-3" />
          <div className="md:col-span-2">
            <SubmitButton label="Save Property" />
          </div>
        </form>
      </Card>
    </div>
  );
}