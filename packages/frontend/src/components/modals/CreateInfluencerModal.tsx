import type { CreateInfluencerInput } from '../../api/types';
import { ModalContainer } from './ModalContainer';

type CreateInfluencerModalProps = {
  open: boolean;
  form: CreateInfluencerInput;
  isPending: boolean;
  onFormChange: (form: CreateInfluencerInput) => void;
  onDismiss: () => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export const CreateInfluencerModal = ({
  open,
  form,
  isPending,
  onFormChange,
  onDismiss,
  onCancel,
  onSubmit,
}: CreateInfluencerModalProps) => (
  <ModalContainer open={open} onClose={onDismiss}>
    <div className="bg-white px-6 py-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Influencer</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => {
              onFormChange({ ...form, name: e.target.value });
            }}
            className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => {
              onFormChange({ ...form, email: e.target.value });
            }}
            className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
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
        onClick={onSubmit}
        disabled={isPending}
        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
      >
        {isPending ? 'Creating...' : 'Create'}
      </button>
    </div>
  </ModalContainer>
);
