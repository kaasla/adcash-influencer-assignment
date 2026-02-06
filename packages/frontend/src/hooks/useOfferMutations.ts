import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCustomPayout,
  createOffer,
  deleteCustomPayout,
  deleteOffer,
  updateOffer,
} from '../api/client';
import type { CreateCustomPayoutInput, CreateOfferInput, UpdateOfferInput } from '../api/types';

export const useCreateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOfferInput) => createOffer(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['influencerOffers'] });
    },
  });
};

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOfferInput }) => updateOffer(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['influencerOffers'] });
    },
  });
};

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOffer(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['influencerOffers'] });
    },
  });
};

export const useCreateCustomPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ offerId, data }: { offerId: string; data: CreateCustomPayoutInput }) =>
      createCustomPayout(offerId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['influencerOffers'] });
    },
  });
};

export const useDeleteCustomPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ offerId, influencerId }: { offerId: string; influencerId: string }) =>
      deleteCustomPayout(offerId, influencerId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['influencerOffers'] });
    },
  });
};
