import Link from 'next/link';
import React from 'react';
import { currency } from '@/lib/utils';

export function PropertyCard({ property }: { property: any }) {
  return (
    <Link href={`/properties/${property.id}`} className="block">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium">{property.addressLine1 || 'Untitled property'}</h3>
            <p className="text-sm text-slate-500">{[property.city, property.state].filter(Boolean).join(', ')}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{property.watchlistStatus}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-slate-500">Price</div>
            <div>{currency(property.listingPrice)}</div>
          </div>
          <div>
            <div className="text-slate-500">Sq Ft</div>
            <div>{property.squareFeet || '\u2014'}</div>
          </div>
          <div>
            <div className="text-slate-500">Yard</div>
            <div>{property.yardSize || '\u2014'}</div>
          </div>
          <div>
            <div className="text-slate-500">Role</div>
            <div>{property.propertyRole}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
