import { z } from 'zod';

const amountSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, 'Invalid format. Use decimal notation (e.g., "25.00")')
  .refine((val) => parseFloat(val) > 0, 'Amount must be greater than 0');

export const createOfferSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
    description: z.string().min(1, 'Description is required'),
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

export const updateOfferSchema = createOfferSchema;

export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;
