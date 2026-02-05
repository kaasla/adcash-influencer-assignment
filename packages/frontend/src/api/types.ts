export type PayoutType = 'cpa' | 'fixed' | 'cpa_fixed';

export type Influencer = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  payoutType: PayoutType;
  cpaAmount: string | null;
  fixedAmount: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InfluencerOffer = Offer & {
  hasCustomPayout: boolean;
};

export type ApiError = {
  error: {
    message: string;
    code: string;
    details?: Record<string, string[]>;
  };
};
