import { z } from 'zod';

const amountSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Invalid format. Use decimal notation (e.g., "25.00")')
  .refine((val) => parseFloat(val) > 0, 'Amount must be greater than 0');

export const createCustomPayoutSchema = z
  .object({
    influencerId: z.string().uuid('Invalid influencer ID format'),
    payoutType: z.enum(['cpa', 'fixed', 'cpa_fixed'], {
      message: 'Payout type must be "cpa", "fixed", or "cpa_fixed"',
    }),
    cpaAmount: amountSchema.optional(),
    fixedAmount: amountSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const needsCpa = data.payoutType === 'cpa' || data.payoutType === 'cpa_fixed';
    const needsFixed = data.payoutType === 'fixed' || data.payoutType === 'cpa_fixed';

    if (needsCpa && !data.cpaAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cpaAmount'],
        message: 'CPA amount is required for this payout type',
      });
    }

    if (!needsCpa && data.cpaAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cpaAmount'],
        message: 'CPA amount is not allowed for this payout type',
      });
    }

    if (needsFixed && !data.fixedAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fixedAmount'],
        message: 'Fixed amount is required for this payout type',
      });
    }

    if (!needsFixed && data.fixedAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fixedAmount'],
        message: 'Fixed amount is not allowed for this payout type',
      });
    }
  });

export const customPayoutParamsSchema = z.object({
  offerId: z.string().uuid('Invalid offer ID format'),
  influencerId: z.string().uuid('Invalid influencer ID format'),
});

export type CreateCustomPayoutInput = z.infer<typeof createCustomPayoutSchema>;
