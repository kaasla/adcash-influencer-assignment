import type { InfluencerOffer } from '../../api/types';
import { OfferCard } from './OfferCard';

type OffersContentProps = {
  selectedInfluencerId: string | null;
  loadingOffers: boolean;
  offers: InfluencerOffer[] | undefined;
  debouncedSearch: string;
  onEdit: (offer: InfluencerOffer) => void;
  onDelete: (offer: InfluencerOffer) => void;
  onCustomPayout: (offer: InfluencerOffer) => void;
  onRemoveCustomPayout: (offer: InfluencerOffer) => void;
};

export const OffersContent = ({
  selectedInfluencerId,
  loadingOffers,
  offers,
  debouncedSearch,
  onEdit,
  onDelete,
  onCustomPayout,
  onRemoveCustomPayout,
}: OffersContentProps) => {
  if (!selectedInfluencerId) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No influencer selected</h3>
        <p className="mt-1 text-gray-500">Select an influencer to view their available offers.</p>
      </div>
    );
  }

  if (loadingOffers) {
    return (
      <div className="flex justify-center py-12">
        <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No offers found</h3>
        <p className="mt-1 text-gray-500">
          {debouncedSearch ? `No offers matching "${debouncedSearch}"` : 'No offers available for this influencer.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onEdit={onEdit}
          onDelete={onDelete}
          onCustomPayout={onCustomPayout}
          onRemoveCustomPayout={onRemoveCustomPayout}
        />
      ))}
    </div>
  );
};
