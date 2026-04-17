import { createPropertyCommentAction } from '@/app/actions/property-actions';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { getPropertyOrThrow } from '@/lib/queries';

export default async function PropertyDetailPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params;
  const property = await getPropertyOrThrow(propertyId);

  return (
    <div className="space-y-8">
      <SectionTitle
        title={property.addressLine1 || 'Property Detail'}
        subtitle={[property.city, property.state].filter(Boolean).join(', ')}
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h3 className="font-medium">Overview</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2 text-sm">
            <div>Price: {property.listingPrice?.toString() || '\u2014'}</div>
            <div>Sq Ft: {property.squareFeet || '\u2014'}</div>
            <div>Garden fit: {property.landProfile?.gardenFeasibility || '\u2014'}</div>
            <div>Beehive suitability: {property.landProfile?.beehiveSuitability || '\u2014'}</div>
            <div>Flood risk: {property.landProfile?.floodRisk || '\u2014'}</div>
            <div>Sunlight: {property.landProfile?.sunlightQuality || '\u2014'}</div>
          </div>
        </Card>
        <Card>
          <h3 className="font-medium">Fit Summary</h3>
          <p className="mt-3 text-sm text-slate-600">{property.fitProfile?.dreamFitSummary || 'No fit summary yet.'}</p>
        </Card>
      </div>
      <Card>
        <h3 className="font-medium">Comments</h3>
        <div className="mt-4 space-y-3">
          {property.comments.map((comment) => (
            <div key={comment.id} className="rounded-xl border border-slate-200 p-3">
              <div className="text-sm font-medium">{comment.user.displayName}</div>
              <div className="mt-1 text-sm text-slate-600">{comment.body}</div>
            </div>
          ))}
        </div>
        <form action={createPropertyCommentAction} className="mt-4 grid gap-3">
          <input type="hidden" name="propertyId" value={property.id} />
          <textarea name="body" rows={4} placeholder="Add a comment" className="rounded-xl border border-slate-300 p-3" required />
          <input name="tag" placeholder="Optional tag (garden, fit, flood, parents)" className="rounded-xl border border-slate-300 p-3" />
          <SubmitButton label="Add Comment" />
        </form>
      </Card>
    </div>
  );
}