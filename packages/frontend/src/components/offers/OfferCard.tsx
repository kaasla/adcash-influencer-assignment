import type { InfluencerOffer } from '../../api/types';
import { formatAmount, payoutColors, payoutLabels } from '../../features/offers/payout';

type OfferCardProps = {
  offer: InfluencerOffer;
  onEdit: (offer: InfluencerOffer) => void;
  onDelete: (offer: InfluencerOffer) => void;
  onCustomPayout: (offer: InfluencerOffer) => void;
  onRemoveCustomPayout: (offer: InfluencerOffer) => void;
};

export const OfferCard = ({ offer, onEdit, onDelete, onCustomPayout, onRemoveCustomPayout }: OfferCardProps) => (
  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between gap-4 mb-3">
      <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
      <div className="flex items-center gap-2">
        {offer.hasCustomPayout && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap bg-purple-100 text-purple-700">
            Custom
          </span>
        )}
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${payoutColors[offer.payoutType]}`}
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
    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
      <button
        type="button"
        onClick={() => {
          onEdit(offer);
        }}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => {
          onDelete(offer);
        }}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        Delete
      </button>
      {offer.hasCustomPayout ? (
        <button
          type="button"
          onClick={() => {
            onRemoveCustomPayout(offer);
          }}
          className="px-3 py-1.5 text-sm font-medium text-purple-700 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
        >
          Remove Custom Payout
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            onCustomPayout(offer);
          }}
          className="px-3 py-1.5 text-sm font-medium text-purple-700 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
        >
          Set Custom Payout
        </button>
      )}
    </div>
  </div>
);
