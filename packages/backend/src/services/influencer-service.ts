import { and, eq, ilike } from 'drizzle-orm';
import { db } from '../db/index.js';
import { customPayouts, influencers, offers } from '../db/schema.js';
import type { CreateInfluencerInput } from '../schemas/influencer-schemas.js';

export const findAllInfluencers = async () =>
  db.select().from(influencers).orderBy(influencers.createdAt);

export const findInfluencerById = async (id: string) => {
  const results = await db.select().from(influencers).where(eq(influencers.id, id));
  return results[0];
};

export const findInfluencerByEmail = async (email: string) => {
  const results = await db.select().from(influencers).where(eq(influencers.email, email));
  return results[0];
};

export const createInfluencer = async (data: CreateInfluencerInput) => {
  const results = await db
    .insert(influencers)
    .values({
      name: data.name,
      email: data.email,
    })
    .returning();
  return results[0];
};

export const findOffersForInfluencer = async (influencerId: string, search?: string) => {
  const baseQuery = db
    .select({
      id: offers.id,
      title: offers.title,
      description: offers.description,
      basePayoutType: offers.payoutType,
      baseCpaAmount: offers.cpaAmount,
      baseFixedAmount: offers.fixedAmount,
      customPayoutType: customPayouts.payoutType,
      customCpaAmount: customPayouts.cpaAmount,
      customFixedAmount: customPayouts.fixedAmount,
      createdAt: offers.createdAt,
      updatedAt: offers.updatedAt,
    })
    .from(offers)
    .leftJoin(
      customPayouts,
      and(eq(customPayouts.offerId, offers.id), eq(customPayouts.influencerId, influencerId)),
    )
    .orderBy(offers.createdAt);

  const rows = search ? await baseQuery.where(ilike(offers.title, `%${search}%`)) : await baseQuery;

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    payoutType: row.customPayoutType ?? row.basePayoutType,
    cpaAmount: row.customPayoutType ? row.customCpaAmount : row.baseCpaAmount,
    fixedAmount: row.customPayoutType ? row.customFixedAmount : row.baseFixedAmount,
    hasCustomPayout: row.customPayoutType !== null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
};
