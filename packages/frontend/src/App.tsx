import { useEffect, useState } from 'react';
import type { InfluencerOffer, PayoutType } from './api/types';
import { useInfluencerOffers } from './hooks/useInfluencerOffers';
import { useInfluencers } from './hooks/useInfluencers';
import { AppLayout } from './layouts/AppLayout';

const payoutLabels: Record<PayoutType, string> = {
  cpa: 'CPA',
  fixed: 'Fixed',
  cpa_fixed: 'CPA + Fixed',
};

const payoutColors: Record<PayoutType, string> = {
  cpa: 'bg-blue-100 text-blue-700',
  fixed: 'bg-green-100 text-green-700',
  cpa_fixed: 'bg-amber-100 text-amber-700',
};

const formatAmount = (amount: string | null) => {
  if (!amount) return null;
  return `$${parseFloat(amount).toFixed(2)}`;
};

const OfferCard = ({ offer }: { offer: InfluencerOffer }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
        <div className="flex items-center gap-2">
          {offer.hasCustomPayout && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              Custom
            </span>
          )}
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${payoutColors[offer.payoutType]}`}
          >
            {payoutLabels[offer.payoutType]}
          </span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{offer.description}</p>
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        {offer.cpaAmount && (
          <div>
            <span className="text-xs text-gray-500">CPA</span>
            <p className="text-lg font-semibold text-gray-900">{formatAmount(offer.cpaAmount)}</p>
          </div>
        )}
        {offer.fixedAmount && (
          <div>
            <span className="text-xs text-gray-500">Fixed</span>
            <p className="text-lg font-semibold text-gray-900">{formatAmount(offer.fixedAmount)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const App = () => {
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data: influencers, isLoading: loadingInfluencers } = useInfluencers();
  const { data: offers, isLoading: loadingOffers } = useInfluencerOffers(
    selectedInfluencerId,
    debouncedSearch,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="sm:w-64">
            <label htmlFor="influencer" className="block text-sm font-medium text-gray-700 mb-1">
              Select Influencer
            </label>
            <select
              id="influencer"
              value={selectedInfluencerId ?? ''}
              onChange={(e) => {
                setSelectedInfluencerId(e.target.value || null);
              }}
              disabled={loadingInfluencers}
              className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
            >
              <option value="">Choose an influencer...</option>
              {influencers?.map((influencer) => (
                <option key={influencer.id} value={influencer.id}>
                  {influencer.name}
                </option>
              ))}
            </select>
          </div>

          {selectedInfluencerId && (
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Offers
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                  }}
                  placeholder="Search by title..."
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          )}
        </div>

        {!selectedInfluencerId && (
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
            <p className="mt-1 text-gray-500">
              Select an influencer to view their available offers.
            </p>
          </div>
        )}

        {selectedInfluencerId && loadingOffers && (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        {selectedInfluencerId && !loadingOffers && offers?.length === 0 && (
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
              {debouncedSearch
                ? `No offers matching "${debouncedSearch}"`
                : 'No offers available for this influencer.'}
            </p>
          </div>
        )}

        {selectedInfluencerId && !loadingOffers && offers && offers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
