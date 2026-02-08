import type { Offer } from '../../api/types';
import { ModalContainer } from './ModalContainer';

type DeleteOfferModalProps = {
  open: boolean;
  offer: Offer | null;
  isPending: boolean;
  onDismiss: () => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DeleteOfferModal = ({
  open,
  offer,
  isPending,
  onDismiss,
  onCancel,
  onConfirm,
}: DeleteOfferModalProps) => (
  <ModalContainer open={open && offer !== null} onClose={onDismiss} maxWidthClass="sm:max-w-md">
    <div className="bg-white px-6 py-5">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Offer</h3>
          <p className="mt-2 text-sm text-gray-600">
            Are you sure you want to delete "{offer?.title}"? This action cannot be undone.
          </p>
        </div>
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
        onClick={onConfirm}
        disabled={isPending}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
      >
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  </ModalContainer>
);
