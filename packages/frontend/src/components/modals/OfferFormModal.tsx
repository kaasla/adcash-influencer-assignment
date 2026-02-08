import type { CreateOfferInput, Offer, PayoutType } from '../../api/types';
import { SelectWithChevron } from '../form/SelectWithChevron';
import { ModalContainer } from './ModalContainer';

type OfferFormModalProps = {
  open: boolean;
  editingOffer: Offer | null;
  form: CreateOfferInput;
  isPending: boolean;
  onFormChange: (form: CreateOfferInput) => void;
  onDismiss: () => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export const OfferFormModal = ({
  open,
  editingOffer,
  form,
  isPending,
  onFormChange,
  onDismiss,
  onCancel,
  onSubmit,
}: OfferFormModalProps) => (
  <ModalContainer open={open} onClose={onDismiss}>
    <div className="bg-white px-6 py-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{editingOffer ? 'Edit Offer' : 'Create Offer'}</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="offerTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="offerTitle"
            type="text"
            value={form.title}
            onChange={(e) => {
              onFormChange({ ...form, title: e.target.value });
            }}
            className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label htmlFor="offerDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="offerDescription"
            rows={3}
            value={form.description}
            onChange={(e) => {
              onFormChange({ ...form, description: e.target.value });
            }}
            className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label htmlFor="payoutType" className="block text-sm font-medium text-gray-700 mb-1">
            Payout Type
          </label>
          <SelectWithChevron
            id="payoutType"
            value={form.payoutType}
            onChange={(e) => {
              onFormChange({ ...form, payoutType: e.target.value as PayoutType });
            }}
          >
            <option value="cpa">CPA</option>
            <option value="fixed">Fixed</option>
            <option value="cpa_fixed">CPA + Fixed</option>
          </SelectWithChevron>
        </div>
        {(form.payoutType === 'cpa' || form.payoutType === 'cpa_fixed') && (
          <div>
            <label htmlFor="cpaAmount" className="block text-sm font-medium text-gray-700 mb-1">
              CPA Amount
            </label>
            <input
              id="cpaAmount"
              type="number"
              step="0.01"
              min="0"
              value={form.cpaAmount}
              onChange={(e) => {
                onFormChange({ ...form, cpaAmount: e.target.value });
              }}
              className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        )}
        {(form.payoutType === 'fixed' || form.payoutType === 'cpa_fixed') && (
          <div>
            <label htmlFor="fixedAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Fixed Amount
            </label>
            <input
              id="fixedAmount"
              type="number"
              step="0.01"
              min="0"
              value={form.fixedAmount}
              onChange={(e) => {
                onFormChange({ ...form, fixedAmount: e.target.value });
              }}
              className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        )}
      </div>
    </div>
    <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isPending}
        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
      >
        {isPending ? 'Saving...' : editingOffer ? 'Update' : 'Create'}
      </button>
    </div>
  </ModalContainer>
);
