import type { CreateInfluencerInput, CreateOfferInput, PayoutType } from '../../api/types';

export type CustomPayoutForm = {
  payoutType: PayoutType;
  cpaAmount: string;
  fixedAmount: string;
};

export const emptyInfluencerForm: CreateInfluencerInput = {
  name: '',
  email: '',
};

export const emptyOfferForm: CreateOfferInput = {
  title: '',
  description: '',
  payoutType: 'cpa',
  cpaAmount: '',
  fixedAmount: '',
};

export const emptyCustomPayoutForm: CustomPayoutForm = {
  payoutType: 'cpa',
  cpaAmount: '',
  fixedAmount: '',
};
