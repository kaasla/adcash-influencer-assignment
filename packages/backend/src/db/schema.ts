import {
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const payoutTypeEnum = pgEnum('payout_type', ['cpa', 'fixed', 'cpa_fixed']);

export const offers = pgTable('offers', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  payoutType: payoutTypeEnum('payout_type').notNull(),
  cpaAmount: decimal('cpa_amount', { precision: 10, scale: 2 }),
  fixedAmount: decimal('fixed_amount', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const influencers = pgTable('influencers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const customPayouts = pgTable(
  'custom_payouts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    offerId: uuid('offer_id')
      .notNull()
      .references(() => offers.id, { onDelete: 'cascade' }),
    influencerId: uuid('influencer_id')
      .notNull()
      .references(() => influencers.id, { onDelete: 'cascade' }),
    payoutType: payoutTypeEnum('payout_type').notNull(),
    cpaAmount: decimal('cpa_amount', { precision: 10, scale: 2 }),
    fixedAmount: decimal('fixed_amount', { precision: 10, scale: 2 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique().on(table.offerId, table.influencerId)],
);

export type Offer = typeof offers.$inferSelect;
export type NewOffer = typeof offers.$inferInsert;
export type Influencer = typeof influencers.$inferSelect;
export type NewInfluencer = typeof influencers.$inferInsert;
export type CustomPayout = typeof customPayouts.$inferSelect;
export type NewCustomPayout = typeof customPayouts.$inferInsert;
