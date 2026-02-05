import type { ApiError, Influencer, InfluencerOffer } from './types';

const API_BASE = '/api/v1';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(error.error.message);
  }
  return response.json() as Promise<T>;
};

export const fetchInfluencers = async (): Promise<Influencer[]> => {
  const response = await fetch(`${API_BASE}/influencers`);
  return handleResponse<Influencer[]>(response);
};

export const fetchInfluencerOffers = async (
  influencerId: string,
  search?: string,
): Promise<InfluencerOffer[]> => {
  const params = new URLSearchParams();
  if (search) {
    params.set('search', search);
  }
  const query = params.toString();
  const url = `${API_BASE}/influencers/${influencerId}/offers${query ? `?${query}` : ''}`;
  const response = await fetch(url);
  return handleResponse<InfluencerOffer[]>(response);
};
