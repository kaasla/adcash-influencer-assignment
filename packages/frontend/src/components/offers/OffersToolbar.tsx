import type { Influencer } from '../../api/types';
import { SelectWithChevron } from '../form/SelectWithChevron';

type OffersToolbarProps = {
  influencers: Influencer[] | undefined;
  loadingInfluencers: boolean;
  selectedInfluencerId: string | null;
  searchInput: string;
  onInfluencerChange: (influencerId: string | null) => void;
  onSearchChange: (search: string) => void;
  onAddInfluencer: () => void;
  onCreateOffer: () => void;
};

export const OffersToolbar = ({
  influencers,
  loadingInfluencers,
  selectedInfluencerId,
  searchInput,
  onInfluencerChange,
  onSearchChange,
  onAddInfluencer,
  onCreateOffer,
}: OffersToolbarProps) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <div className="sm:w-64">
      <label htmlFor="influencer" className="block text-sm font-medium text-gray-700 mb-1">
        Select Influencer
      </label>
      <SelectWithChevron
        id="influencer"
        value={selectedInfluencerId ?? ''}
        onChange={(e) => {
          onInfluencerChange(e.target.value || null);
        }}
        disabled={loadingInfluencers}
        className="disabled:bg-gray-100"
      >
        <option value="">Choose an influencer...</option>
        {influencers?.map((influencer) => (
          <option key={influencer.id} value={influencer.id}>
            {influencer.name}
          </option>
        ))}
      </SelectWithChevron>
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
              onSearchChange(e.target.value);
            }}
            placeholder="Search by title..."
            className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>
    )}

    <div className="sm:self-end flex gap-2">
      <button
        type="button"
        onClick={onAddInfluencer}
        className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
      >
        Add Influencer
      </button>
      <button
        type="button"
        onClick={onCreateOffer}
        className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
      >
        Create Offer
      </button>
    </div>
  </div>
);
