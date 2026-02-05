import { and, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { customPayouts } from '../db/schema.js';
import type { CreateCustomPayoutInput } from '../schemas/custom-payout-schemas.js';

export const findCustomPayout = async (offerId: string, influencerId: string) => {
  const results = await db
    .select()
    .from(customPayouts)
    .where(and(eq(customPayouts.offerId, offerId), eq(customPayouts.influencerId, influencerId)));
  return results[0];
};

export const createCustomPayout = async (offerId: string, data: CreateCustomPayoutInput) => {
  const results = await db
    .insert(customPayouts)
    .values({
      offerId,
      influencerId: data.influencerId,
      payoutType: data.payoutType,
      cpaAmount: data.cpaAmount ?? null,
      fixedAmount: data.fixedAmount ?? null,
    })
    .returning();
  return results[0];
};

export const deleteCustomPayout = async (offerId: string, influencerId: string) => {
  const results = await db
    .delete(customPayouts)
    .where(and(eq(customPayouts.offerId, offerId), eq(customPayouts.influencerId, influencerId)))
    .returning();
  return results[0];
};
