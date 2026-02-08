import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  CreateCustomPayoutInput,
  CreateInfluencerInput,
  CreateOfferInput,
  InfluencerOffer,
  Offer,
} from './api/types';
import { createInfluencer } from './api/client';
import { CustomPayoutModal } from './components/modals/CustomPayoutModal';
import { CreateInfluencerModal } from './components/modals/CreateInfluencerModal';
import { DeleteOfferModal } from './components/modals/DeleteOfferModal';
import { OfferFormModal } from './components/modals/OfferFormModal';
import { OffersContent } from './components/offers/OffersContent';
import { OffersToolbar } from './components/offers/OffersToolbar';
import {
  emptyCustomPayoutForm,
  emptyInfluencerForm,
  emptyOfferForm,
  type CustomPayoutForm,
} from './features/offers/forms';
import { isSamePayout } from './features/offers/payout';
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

export const App = () => {
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [showCreateInfluencer, setShowCreateInfluencer] = useState(false);
  const [influencerForm, setInfluencerForm] = useState<CreateInfluencerInput>(emptyInfluencerForm);

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerForm, setOfferForm] = useState<CreateOfferInput>(emptyOfferForm);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingOffer, setDeletingOffer] = useState<Offer | null>(null);

  const [showCustomPayoutModal, setShowCustomPayoutModal] = useState(false);
  const [customPayoutOffer, setCustomPayoutOffer] = useState<Offer | null>(null);
  const [customPayoutForm, setCustomPayoutForm] = useState<CustomPayoutForm>(emptyCustomPayoutForm);

  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data: influencers, isLoading: loadingInfluencers } = useInfluencers();
  const { data: offers, isLoading: loadingOffers } = useInfluencerOffers(selectedInfluencerId, debouncedSearch);

  const createInfluencerMutation = useMutation({
    mutationFn: (data: CreateInfluencerInput) => createInfluencer(data),
    onSuccess: (newInfluencer) => {
      void queryClient.invalidateQueries({ queryKey: ['influencers'] });
      showToast('Influencer created successfully', 'success');
      setShowCreateInfluencer(false);
      setInfluencerForm(emptyInfluencerForm);
      setSelectedInfluencerId(newInfluencer.id);
    },
    onError: (err) => {
      showToast(err instanceof Error ? err.message : 'Failed to create influencer', 'error');
    },
  });

  const createOfferMutation = useCreateOffer();
  const updateOfferMutation = useUpdateOffer();
  const deleteOfferMutation = useDeleteOffer();
  const createCustomPayoutMutation = useCreateCustomPayout();
  const deleteCustomPayoutMutation = useDeleteCustomPayout();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);

  const dismissCreateInfluencerModal = () => {
    setShowCreateInfluencer(false);
  };

  const cancelCreateInfluencerModal = () => {
    setShowCreateInfluencer(false);
    setInfluencerForm(emptyInfluencerForm);
  };

  const dismissOfferModal = () => {
    setShowOfferModal(false);
  };

  const cancelOfferModal = () => {
    setShowOfferModal(false);
    setOfferForm(emptyOfferForm);
    setEditingOffer(null);
  };

  const dismissDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const cancelDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingOffer(null);
  };

  const dismissCustomPayoutModal = () => {
    setShowCustomPayoutModal(false);
  };

  const cancelCustomPayoutModal = () => {
    setShowCustomPayoutModal(false);
    setCustomPayoutForm(emptyCustomPayoutForm);
    setCustomPayoutOffer(null);
  };

  const handleCreateInfluencer = () => {
    if (!influencerForm.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }

    if (!influencerForm.email.trim()) {
      showToast('Email is required', 'error');
      return;
    }

    createInfluencerMutation.mutate(influencerForm);
  };

  const openCreateOfferModal = () => {
    setEditingOffer(null);
    setOfferForm(emptyOfferForm);
    setShowOfferModal(true);
  };

  const openEditOfferModal = (offer: InfluencerOffer) => {
    setEditingOffer(offer);
    setOfferForm({
      title: offer.title,
      description: offer.description,
      payoutType: offer.payoutType,
      cpaAmount: offer.cpaAmount ?? '',
      fixedAmount: offer.fixedAmount ?? '',
    });
    setShowOfferModal(true);
  };

  const openDeleteModal = (offer: InfluencerOffer) => {
    setDeletingOffer(offer);
    setShowDeleteModal(true);
  };

  const openCustomPayoutModal = (offer: InfluencerOffer) => {
    setCustomPayoutOffer(offer);
    setCustomPayoutForm({
      payoutType: offer.payoutType,
      cpaAmount: offer.cpaAmount ?? '',
      fixedAmount: offer.fixedAmount ?? '',
    });
    setShowCustomPayoutModal(true);
  };

  const handleRemoveCustomPayout = (offer: InfluencerOffer) => {
    if (!selectedInfluencerId) return;

    deleteCustomPayoutMutation.mutate(
      { offerId: offer.id, influencerId: selectedInfluencerId },
      {
        onSuccess: () => {
          showToast('Custom payout removed', 'success');
        },
        onError: (err) => {
          showToast(err instanceof Error ? err.message : 'Failed to remove custom payout', 'error');
        },
      },
    );
  };

  const handleSaveOffer = () => {
    if (!offerForm.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    if (!offerForm.description.trim()) {
      showToast('Description is required', 'error');
      return;
    }

    const payload: CreateOfferInput = {
      title: offerForm.title,
      description: offerForm.description,
      payoutType: offerForm.payoutType,
    };

    if (offerForm.payoutType === 'cpa' || offerForm.payoutType === 'cpa_fixed') {
      if (!offerForm.cpaAmount) {
        showToast('CPA amount is required', 'error');
        return;
      }
      payload.cpaAmount = offerForm.cpaAmount;
    }

    if (offerForm.payoutType === 'fixed' || offerForm.payoutType === 'cpa_fixed') {
      if (!offerForm.fixedAmount) {
        showToast('Fixed amount is required', 'error');
        return;
      }
      payload.fixedAmount = offerForm.fixedAmount;
    }

    if (editingOffer) {
      updateOfferMutation.mutate(
        { id: editingOffer.id, data: payload },
        {
          onSuccess: () => {
            showToast('Offer updated successfully', 'success');
            setShowOfferModal(false);
            setOfferForm(emptyOfferForm);
            setEditingOffer(null);
          },
          onError: (err) => {
            showToast(err instanceof Error ? err.message : 'Failed to update offer', 'error');
          },
        },
      );
      return;
    }

    createOfferMutation.mutate(payload, {
      onSuccess: () => {
        showToast('Offer created successfully', 'success');
        setShowOfferModal(false);
        setOfferForm(emptyOfferForm);
      },
      onError: (err) => {
        showToast(err instanceof Error ? err.message : 'Failed to create offer', 'error');
      },
    });
  };

  const handleDeleteOffer = () => {
    if (!deletingOffer) return;

    deleteOfferMutation.mutate(deletingOffer.id, {
      onSuccess: () => {
        showToast('Offer deleted successfully', 'success');
        setShowDeleteModal(false);
        setDeletingOffer(null);
      },
      onError: (err) => {
        showToast(err instanceof Error ? err.message : 'Failed to delete offer', 'error');
      },
    });
  };

  const handleSaveCustomPayout = () => {
    if (!customPayoutOffer || !selectedInfluencerId) return;

    const payload: CreateCustomPayoutInput = {
      influencerId: selectedInfluencerId,
      payoutType: customPayoutForm.payoutType,
    };

    if (customPayoutForm.payoutType === 'cpa' || customPayoutForm.payoutType === 'cpa_fixed') {
      if (!customPayoutForm.cpaAmount) {
        showToast('CPA amount is required', 'error');
        return;
      }
      payload.cpaAmount = customPayoutForm.cpaAmount;
    }

    if (customPayoutForm.payoutType === 'fixed' || customPayoutForm.payoutType === 'cpa_fixed') {
      if (!customPayoutForm.fixedAmount) {
        showToast('Fixed amount is required', 'error');
        return;
      }
      payload.fixedAmount = customPayoutForm.fixedAmount;
    }

    if (
      isSamePayout(
        customPayoutOffer.payoutType,
        customPayoutOffer.cpaAmount,
        customPayoutOffer.fixedAmount,
        payload.payoutType,
        payload.cpaAmount,
        payload.fixedAmount,
      )
    ) {
      showToast('No payout changes to save', 'success');
      cancelCustomPayoutModal();
      return;
    }

    createCustomPayoutMutation.mutate(
      { offerId: customPayoutOffer.id, data: payload },
      {
        onSuccess: () => {
          showToast('Custom payout set successfully', 'success');
          cancelCustomPayoutModal();
        },
        onError: (err) => {
          showToast(err instanceof Error ? err.message : 'Failed to set custom payout', 'error');
        },
      },
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <OffersToolbar
          influencers={influencers}
          loadingInfluencers={loadingInfluencers}
          selectedInfluencerId={selectedInfluencerId}
          searchInput={searchInput}
          onInfluencerChange={setSelectedInfluencerId}
          onSearchChange={setSearchInput}
          onAddInfluencer={() => {
            setShowCreateInfluencer(true);
          }}
          onCreateOffer={openCreateOfferModal}
        />

        <OffersContent
          selectedInfluencerId={selectedInfluencerId}
          loadingOffers={loadingOffers}
          offers={offers}
          debouncedSearch={debouncedSearch}
          onEdit={openEditOfferModal}
          onDelete={openDeleteModal}
          onCustomPayout={openCustomPayoutModal}
          onRemoveCustomPayout={handleRemoveCustomPayout}
        />
      </div>

      <CreateInfluencerModal
        open={showCreateInfluencer}
        form={influencerForm}
        isPending={createInfluencerMutation.isPending}
        onFormChange={setInfluencerForm}
        onDismiss={dismissCreateInfluencerModal}
        onCancel={cancelCreateInfluencerModal}
        onSubmit={handleCreateInfluencer}
      />

      <OfferFormModal
        open={showOfferModal}
        editingOffer={editingOffer}
        form={offerForm}
        isPending={createOfferMutation.isPending || updateOfferMutation.isPending}
        onFormChange={setOfferForm}
        onDismiss={dismissOfferModal}
        onCancel={cancelOfferModal}
        onSubmit={handleSaveOffer}
      />

      <DeleteOfferModal
        open={showDeleteModal}
        offer={deletingOffer}
        isPending={deleteOfferMutation.isPending}
        onDismiss={dismissDeleteModal}
        onCancel={cancelDeleteModal}
        onConfirm={handleDeleteOffer}
      />

      <CustomPayoutModal
        open={showCustomPayoutModal}
        offer={customPayoutOffer}
        form={customPayoutForm}
        isPending={createCustomPayoutMutation.isPending}
        onFormChange={setCustomPayoutForm}
        onDismiss={dismissCustomPayoutModal}
        onCancel={cancelCustomPayoutModal}
        onSubmit={handleSaveCustomPayout}
      />
    </AppLayout>
  );
};
