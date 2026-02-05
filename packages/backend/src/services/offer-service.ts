import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { offers } from '../db/schema.js';
import type { CreateOfferInput, UpdateOfferInput } from '../schemas/offer-schemas.js';

export const findAllOffers = async () => db.select().from(offers).orderBy(offers.createdAt);

export const findOfferById = async (id: string) => {
  const results = await db.select().from(offers).where(eq(offers.id, id));
  return results[0];
};

export const createOffer = async (data: CreateOfferInput) => {
  const results = await db
    .insert(offers)
    .values({
      title: data.title,
      description: data.description,
      payoutType: data.payoutType,
      cpaAmount: data.cpaAmount ?? null,
      fixedAmount: data.fixedAmount ?? null,
    })
    .returning();
  return results[0];
};

export const updateOffer = async (id: string, data: UpdateOfferInput) => {
  const results = await db
    .update(offers)
    .set({
      title: data.title,
      description: data.description,
      payoutType: data.payoutType,
      cpaAmount: data.cpaAmount ?? null,
      fixedAmount: data.fixedAmount ?? null,
      updatedAt: new Date(),
    })
    .where(eq(offers.id, id))
    .returning();
  return results[0];
};

export const deleteOfferById = async (id: string) => {
  const results = await db.delete(offers).where(eq(offers.id, id)).returning();
  return results[0];
};
