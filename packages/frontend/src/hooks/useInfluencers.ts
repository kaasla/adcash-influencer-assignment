import { useQuery } from '@tanstack/react-query';
import { fetchInfluencers } from '../api/client';

export const useInfluencers = () => {
  return useQuery({
    queryKey: ['influencers'],
    queryFn: fetchInfluencers,
  });
};
