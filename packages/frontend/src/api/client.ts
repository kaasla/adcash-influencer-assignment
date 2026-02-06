import type {
  ApiError,
  CreateCustomPayoutInput,
  CreateOfferInput,
  CustomPayout,
  Influencer,
  InfluencerOffer,
  Offer,
  UpdateOfferInput,
} from './types';

const API_BASE = '/api/v1';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(error.error.message);
  }
  return response.json() as Promise<T>;
};

const handleEmptyResponse = async (response: Response): Promise<void> => {
  if (!response.ok) {
    const error = (await response.json()) as ApiError;
    throw new Error(error.error.message);
  }
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

export const fetchOffers = async (): Promise<Offer[]> => {
  const response = await fetch(`${API_BASE}/offers`);
  return handleResponse<Offer[]>(response);
};

export const createOffer = async (data: CreateOfferInput): Promise<Offer> => {
  const response = await fetch(`${API_BASE}/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Offer>(response);
};

export const updateOffer = async (id: string, data: UpdateOfferInput): Promise<Offer> => {
  const response = await fetch(`${API_BASE}/offers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Offer>(response);
};

export const deleteOffer = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/offers/${id}`, {
    method: 'DELETE',
  });
  await handleEmptyResponse(response);
};

export const createCustomPayout = async (
  offerId: string,
  data: CreateCustomPayoutInput,
): Promise<CustomPayout> => {
  const response = await fetch(`${API_BASE}/offers/${offerId}/custom-payouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<CustomPayout>(response);
};

export const deleteCustomPayout = async (offerId: string, influencerId: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/offers/${offerId}/custom-payouts/${influencerId}`, {
    method: 'DELETE',
  });
  await handleEmptyResponse(response);
};
