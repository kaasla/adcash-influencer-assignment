import type { PayoutType } from '../../api/types';

export const payoutLabels: Record<PayoutType, string> = {
  cpa: 'CPA',
  fixed: 'Fixed',
  cpa_fixed: 'CPA + Fixed',
};

export const payoutColors: Record<PayoutType, string> = {
  cpa: 'bg-blue-100 text-blue-700',
  fixed: 'bg-green-100 text-green-700',
  cpa_fixed: 'bg-amber-100 text-amber-700',
};

export const formatAmount = (amount: string | null) => {
  if (!amount) return null;
  return `$${parseFloat(amount).toFixed(2)}`;
};

const parseAmount = (amount: string | null | undefined): number | null => {
  if (amount === null || amount === undefined || amount === '') return null;
  const parsed = Number(amount);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizePayout = (
  payoutType: PayoutType,
  cpaAmount: string | null | undefined,
  fixedAmount: string | null | undefined,
) => ({
  payoutType,
  cpaAmount: payoutType === 'cpa' || payoutType === 'cpa_fixed' ? parseAmount(cpaAmount) : null,
  fixedAmount: payoutType === 'fixed' || payoutType === 'cpa_fixed' ? parseAmount(fixedAmount) : null,
});

export const isSamePayout = (
  currentPayoutType: PayoutType,
  currentCpaAmount: string | null | undefined,
  currentFixedAmount: string | null | undefined,
  nextPayoutType: PayoutType,
  nextCpaAmount: string | null | undefined,
  nextFixedAmount: string | null | undefined,
) => {
  const current = normalizePayout(currentPayoutType, currentCpaAmount, currentFixedAmount);
  const next = normalizePayout(nextPayoutType, nextCpaAmount, nextFixedAmount);

  return (
    current.payoutType === next.payoutType &&
    current.cpaAmount === next.cpaAmount &&
    current.fixedAmount === next.fixedAmount
  );
};
