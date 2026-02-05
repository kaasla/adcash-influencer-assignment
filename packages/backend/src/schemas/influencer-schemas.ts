import { z } from 'zod';

export const createInfluencerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
  email: z.string().email('Invalid email format'),
});

export const influencerOffersQuerySchema = z.object({
  search: z.string().trim().optional(),
});

export type CreateInfluencerInput = z.infer<typeof createInfluencerSchema>;
