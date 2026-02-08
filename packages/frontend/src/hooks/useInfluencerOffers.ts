import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchInfluencerOffers } from '../api/client';

export const useInfluencerOffers = (influencerId: string | null, search: string) => {
  return useQuery({
    queryKey: ['influencerOffers', influencerId, search],
    queryFn: () => {
      if (!influencerId) throw new Error('Influencer ID is required');
      return fetchInfluencerOffers(influencerId, search);
    },
    enabled: !!influencerId,
    placeholderData: keepPreviousData,
  });
};
