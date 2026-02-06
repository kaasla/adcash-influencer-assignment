import { useEffect, useState } from 'react';
import type { CreateCustomPayoutInput, CreateOfferInput, InfluencerOffer, PayoutType } from './api/types';
import { useInfluencerOffers } from './hooks/useInfluencerOffers';
import { useInfluencers } from './hooks/useInfluencers';
import {
  useCreateCustomPayout,
  useCreateOffer,
  useDeleteCustomPayout,
  useDeleteOffer,
  useUpdateOffer,
} from './hooks/useOfferMutations';
import { useToast } from './hooks/useToast';
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

type ModalType = 'create' | 'edit' | 'delete' | 'customPayout' | null;

const emptyOfferForm: CreateOfferInput = {
  title: '',
  description: '',
  payoutType: 'cpa',
  cpaAmount: '',
  fixedAmount: '',
};

const emptyCustomPayoutForm: Omit<CreateCustomPayoutInput, 'influencerId'> = {
  payoutType: 'cpa',
  cpaAmount: '',
  fixedAmount: '',
};

export const App = () => {
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedOffer, setSelectedOffer] = useState<InfluencerOffer | null>(null);
  const [offerForm, setOfferForm] = useState<CreateOfferInput>(emptyOfferForm);
  const [customPayoutForm, setCustomPayoutForm] =
    useState<Omit<CreateCustomPayoutInput, 'influencerId'>>(emptyCustomPayoutForm);

  const { showToast } = useToast();
  const { data: influencers, isLoading: loadingInfluencers } = useInfluencers();
  const { data: offers, isLoading: loadingOffers } = useInfluencerOffers(
    selectedInfluencerId,
    debouncedSearch,
  );

  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();
  const createCustomPayout = useCreateCustomPayout();
  const deleteCustomPayout = useDeleteCustomPayout();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  const openCreateModal = () => {
    setOfferForm(emptyOfferForm);
    setModalType('create');
  };

  const openEditModal = (offer: InfluencerOffer) => {
    setSelectedOffer(offer);
    setOfferForm({
      title: offer.title,
      description: offer.description,
      payoutType: offer.payoutType,
      cpaAmount: offer.cpaAmount ?? '',
      fixedAmount: offer.fixedAmount ?? '',
    });
    setModalType('edit');
  };

  const openDeleteModal = (offer: InfluencerOffer) => {
    setSelectedOffer(offer);
    setModalType('delete');
  };

  const openCustomPayoutModal = (offer: InfluencerOffer) => {
    setSelectedOffer(offer);
    setCustomPayoutForm({
      payoutType: offer.payoutType,
      cpaAmount: offer.cpaAmount ?? '',
      fixedAmount: offer.fixedAmount ?? '',
    });
    setModalType('customPayout');
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedOffer(null);
    setOfferForm(emptyOfferForm);
    setCustomPayoutForm(emptyCustomPayoutForm);
  };

  const validateOfferForm = (): string | null => {
    if (!offerForm.title.trim()) return 'Title is required';
    if (!offerForm.description.trim()) return 'Description is required';

    const { payoutType, cpaAmount, fixedAmount } = offerForm;
    const cpa = cpaAmount ? parseFloat(cpaAmount) : null;
    const fixed = fixedAmount ? parseFloat(fixedAmount) : null;

    switch (payoutType) {
      case 'cpa':
        if (!cpa || cpa <= 0) return 'CPA amount is required and must be positive';
        if (fixed) return 'Fixed amount should not be set for CPA payout type';
        break;
      case 'fixed':
        if (!fixed || fixed <= 0) return 'Fixed amount is required and must be positive';
        if (cpa) return 'CPA amount should not be set for Fixed payout type';
        break;
      case 'cpa_fixed':
        if (!cpa || cpa <= 0) return 'CPA amount is required and must be positive';
        if (!fixed || fixed <= 0) return 'Fixed amount is required and must be positive';
        break;
    }

    return null;
  };

  const validateCustomPayoutForm = (): string | null => {
    const { payoutType, cpaAmount, fixedAmount } = customPayoutForm;
    const cpa = cpaAmount ? parseFloat(cpaAmount) : null;
    const fixed = fixedAmount ? parseFloat(fixedAmount) : null;

    switch (payoutType) {
      case 'cpa':
        if (!cpa || cpa <= 0) return 'CPA amount is required and must be positive';
        if (fixed) return 'Fixed amount should not be set for CPA payout type';
        break;
      case 'fixed':
        if (!fixed || fixed <= 0) return 'Fixed amount is required and must be positive';
        if (cpa) return 'CPA amount should not be set for Fixed payout type';
        break;
      case 'cpa_fixed':
        if (!cpa || cpa <= 0) return 'CPA amount is required and must be positive';
        if (!fixed || fixed <= 0) return 'Fixed amount is required and must be positive';
        break;
    }

    return null;
  };

  const handleCreateOffer = () => {
    const error = validateOfferForm();
    if (error) {
      showToast(error, 'error');
      return;
    }

    const data: CreateOfferInput = {
      title: offerForm.title,
      description: offerForm.description,
      payoutType: offerForm.payoutType,
    };
    if (offerForm.cpaAmount) data.cpaAmount = offerForm.cpaAmount;
    if (offerForm.fixedAmount) data.fixedAmount = offerForm.fixedAmount;

    createOffer.mutate(data, {
      onSuccess: () => {
        showToast('Offer created successfully', 'success');
        closeModal();
      },
      onError: (err) => {
        showToast(err instanceof Error ? err.message : 'Failed to create offer', 'error');
      },
    });
  };

  const handleUpdateOffer = () => {
    if (!selectedOffer) return;

    const error = validateOfferForm();
    if (error) {
      showToast(error, 'error');
      return;
    }

    const data: CreateOfferInput = {
      title: offerForm.title,
      description: offerForm.description,
      payoutType: offerForm.payoutType,
    };
    if (offerForm.cpaAmount) data.cpaAmount = offerForm.cpaAmount;
    if (offerForm.fixedAmount) data.fixedAmount = offerForm.fixedAmount;

    updateOffer.mutate(
      { id: selectedOffer.id, data },
      {
        onSuccess: () => {
          showToast('Offer updated successfully', 'success');
          closeModal();
        },
        onError: (err) => {
          showToast(err instanceof Error ? err.message : 'Failed to update offer', 'error');
        },
      },
    );
  };

  const handleDeleteOffer = () => {
    if (!selectedOffer) return;

    deleteOffer.mutate(selectedOffer.id, {
      onSuccess: () => {
        showToast('Offer deleted successfully', 'success');
        closeModal();
      },
      onError: (err) => {
        showToast(err instanceof Error ? err.message : 'Failed to delete offer', 'error');
      },
    });
  };

  const handleCreateCustomPayout = () => {
    if (!selectedOffer || !selectedInfluencerId) return;

    const error = validateCustomPayoutForm();
    if (error) {
      showToast(error, 'error');
      return;
    }

    const data: CreateCustomPayoutInput = {
      influencerId: selectedInfluencerId,
      payoutType: customPayoutForm.payoutType,
    };
    if (customPayoutForm.cpaAmount) data.cpaAmount = customPayoutForm.cpaAmount;
    if (customPayoutForm.fixedAmount) data.fixedAmount = customPayoutForm.fixedAmount;

    createCustomPayout.mutate(
      { offerId: selectedOffer.id, data },
      {
        onSuccess: () => {
          showToast('Custom payout created successfully', 'success');
          closeModal();
        },
        onError: (err) => {
          showToast(err instanceof Error ? err.message : 'Failed to create custom payout', 'error');
        },
      },
    );
  };

  const handleRemoveCustomPayout = (offer: InfluencerOffer) => {
    if (!selectedInfluencerId) return;

    deleteCustomPayout.mutate(
      { offerId: offer.id, influencerId: selectedInfluencerId },
      {
        onSuccess: () => {
          showToast('Custom payout removed', 'success');
        },
        onError: (err) => {
          showToast(
            err instanceof Error ? err.message : 'Failed to remove custom payout',
            'error',
          );
        },
      },
    );
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
              <p className="text-lg font-semibold text-gray-900">
                {formatAmount(offer.fixedAmount)}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              openEditModal(offer);
            }}
            className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              openDeleteModal(offer);
            }}
            className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete
          </button>
          {selectedInfluencerId && (
            <>
              {offer.hasCustomPayout ? (
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveCustomPayout(offer);
                  }}
                  disabled={deleteCustomPayout.isPending}
                  className="ml-auto px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  Remove Custom
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    openCustomPayoutModal(offer);
                  }}
                  className="ml-auto px-3 py-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  Add Custom
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

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

          <div className="sm:self-end">
            <button
              type="button"
              onClick={openCreateModal}
              className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white font-medium rounded-lg shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Create Offer
            </button>
          </div>
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

      {/* Create/Edit Offer Modal */}
      {(modalType === 'create' || modalType === 'edit') && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            />
            <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-6 py-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {modalType === 'create' ? 'Create New Offer' : 'Edit Offer'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={offerForm.title}
                      onChange={(e) => {
                        setOfferForm((prev) => ({ ...prev, title: e.target.value }));
                      }}
                      className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      rows={3}
                      value={offerForm.description}
                      onChange={(e) => {
                        setOfferForm((prev) => ({ ...prev, description: e.target.value }));
                      }}
                      className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="payoutType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Payout Type
                    </label>
                    <select
                      id="payoutType"
                      value={offerForm.payoutType}
                      onChange={(e) => {
                        const payoutType = e.target.value as PayoutType;
                        setOfferForm((prev) => ({
                          ...prev,
                          payoutType,
                          cpaAmount: payoutType === 'fixed' ? '' : prev.cpaAmount,
                          fixedAmount: payoutType === 'cpa' ? '' : prev.fixedAmount,
                        }));
                      }}
                      className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="cpa">CPA</option>
                      <option value="fixed">Fixed</option>
                      <option value="cpa_fixed">CPA + Fixed</option>
                    </select>
                  </div>
                  {(offerForm.payoutType === 'cpa' || offerForm.payoutType === 'cpa_fixed') && (
                    <div>
                      <label
                        htmlFor="cpaAmount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        CPA Amount ($)
                      </label>
                      <input
                        id="cpaAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={offerForm.cpaAmount}
                        onChange={(e) => {
                          setOfferForm((prev) => ({ ...prev, cpaAmount: e.target.value }));
                        }}
                        className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                  {(offerForm.payoutType === 'fixed' || offerForm.payoutType === 'cpa_fixed') && (
                    <div>
                      <label
                        htmlFor="fixedAmount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Fixed Amount ($)
                      </label>
                      <input
                        id="fixedAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={offerForm.fixedAmount}
                        onChange={(e) => {
                          setOfferForm((prev) => ({ ...prev, fixedAmount: e.target.value }));
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
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={modalType === 'create' ? handleCreateOffer : handleUpdateOffer}
                  disabled={createOffer.isPending || updateOffer.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {createOffer.isPending || updateOffer.isPending
                    ? 'Saving...'
                    : modalType === 'create'
                      ? 'Create'
                      : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === 'delete' && selectedOffer && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            />
            <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
              <div className="bg-white px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Offer</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Are you sure you want to delete &quot;{selectedOffer.title}&quot;? This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteOffer}
                  disabled={deleteOffer.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {deleteOffer.isPending ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Payout Modal */}
      {modalType === 'customPayout' && selectedOffer && selectedInfluencerId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            />
            <div className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-6 py-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Custom Payout</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Set a custom payout for &quot;{selectedOffer.title}&quot; for the selected
                  influencer.
                </p>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="customPayoutType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Payout Type
                    </label>
                    <select
                      id="customPayoutType"
                      value={customPayoutForm.payoutType}
                      onChange={(e) => {
                        const payoutType = e.target.value as PayoutType;
                        setCustomPayoutForm((prev) => ({
                          ...prev,
                          payoutType,
                          cpaAmount: payoutType === 'fixed' ? '' : prev.cpaAmount,
                          fixedAmount: payoutType === 'cpa' ? '' : prev.fixedAmount,
                        }));
                      }}
                      className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="cpa">CPA</option>
                      <option value="fixed">Fixed</option>
                      <option value="cpa_fixed">CPA + Fixed</option>
                    </select>
                  </div>
                  {(customPayoutForm.payoutType === 'cpa' ||
                    customPayoutForm.payoutType === 'cpa_fixed') && (
                    <div>
                      <label
                        htmlFor="customCpaAmount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        CPA Amount ($)
                      </label>
                      <input
                        id="customCpaAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={customPayoutForm.cpaAmount}
                        onChange={(e) => {
                          setCustomPayoutForm((prev) => ({ ...prev, cpaAmount: e.target.value }));
                        }}
                        className="block w-full px-3 py-2 rounded-lg border border-gray-300 shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}
                  {(customPayoutForm.payoutType === 'fixed' ||
                    customPayoutForm.payoutType === 'cpa_fixed') && (
                    <div>
                      <label
                        htmlFor="customFixedAmount"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Fixed Amount ($)
                      </label>
                      <input
                        id="customFixedAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={customPayoutForm.fixedAmount}
                        onChange={(e) => {
                          setCustomPayoutForm((prev) => ({ ...prev, fixedAmount: e.target.value }));
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
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCustomPayout}
                  disabled={createCustomPayout.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {createCustomPayout.isPending ? 'Adding...' : 'Add Custom Payout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
