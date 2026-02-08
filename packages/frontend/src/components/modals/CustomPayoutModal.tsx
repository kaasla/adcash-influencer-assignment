import type { Offer, PayoutType } from '../../api/types';
import type { CustomPayoutForm } from '../../features/offers/forms';
import { SelectWithChevron } from '../form/SelectWithChevron';
import { ModalContainer } from './ModalContainer';

type CustomPayoutModalProps = {
  open: boolean;
  offer: Offer | null;
  form: CustomPayoutForm;
  isPending: boolean;
  onFormChange: (form: CustomPayoutForm) => void;
  onDismiss: () => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export const CustomPayoutModal = ({
  open,
  offer,
  form,
  isPending,
  onFormChange,
  onDismiss,
  onCancel,
  onSubmit,
}: CustomPayoutModalProps) => (
  <ModalContainer open={open && offer !== null} onClose={onDismiss}>
    <div className="bg-white px-6 py-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Custom Payout for "{offer?.title}"</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="customPayoutType" className="block text-sm font-medium text-gray-700 mb-1">
            Payout Type
          </label>
          <SelectWithChevron
            id="customPayoutType"
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
            <label htmlFor="customCpaAmount" className="block text-sm font-medium text-gray-700 mb-1">
              CPA Amount
            </label>
            <input
              id="customCpaAmount"
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
            <label htmlFor="customFixedAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Fixed Amount
            </label>
            <input
              id="customFixedAmount"
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
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </div>
  </ModalContainer>
);
