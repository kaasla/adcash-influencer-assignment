import { randomUUID } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { db } from './db/index.js';
import { customPayouts, influencers, offers } from './db/schema.js';

const seed = async () => {
  const existingInfluencers = await db.select().from(influencers).limit(1);
  if (existingInfluencers.length > 0) {
    console.log('Database already seeded, skipping...');
    return;
  }

  console.log('Seeding database...');

  const influencerIds = {
    alice: randomUUID(),
    bob: randomUUID(),
    charlie: randomUUID(),
  };

  const offerIds = {
    summerFashion: randomUUID(),
    techGadget: randomUUID(),
    fitnessApp: randomUUID(),
    travelVlog: randomUUID(),
    gamingPeripherals: randomUUID(),
  };

  await db.insert(influencers).values([
    { id: influencerIds.alice, name: 'Alice Johnson', email: 'alice@example.com' },
    { id: influencerIds.bob, name: 'Bob Smith', email: 'bob@example.com' },
    { id: influencerIds.charlie, name: 'Charlie Davis', email: 'charlie@example.com' },
  ]);

  await db.insert(offers).values([
    {
      id: offerIds.summerFashion,
      title: 'Summer Fashion Campaign',
      description: 'Promote our new summer collection across your social channels.',
      payoutType: 'cpa',
      cpaAmount: '25.00',
    },
    {
      id: offerIds.techGadget,
      title: 'Tech Gadget Review',
      description: 'Create an honest review video for our latest smart home device.',
      payoutType: 'fixed',
      fixedAmount: '500.00',
    },
    {
      id: offerIds.fitnessApp,
      title: 'Fitness App Launch',
      description: 'Drive app downloads through your fitness and wellness content.',
      payoutType: 'cpa_fixed',
      cpaAmount: '10.00',
      fixedAmount: '200.00',
    },
    {
      id: offerIds.travelVlog,
      title: 'Travel Vlog Sponsorship',
      description: 'Feature our travel gear in your next adventure vlog.',
      payoutType: 'fixed',
      fixedAmount: '750.00',
    },
    {
      id: offerIds.gamingPeripherals,
      title: 'Gaming Peripherals Promo',
      description: 'Showcase our new gaming keyboard and mouse in a livestream.',
      payoutType: 'cpa',
      cpaAmount: '15.00',
    },
  ]);

  await db.insert(customPayouts).values([
    {
      offerId: offerIds.summerFashion,
      influencerId: influencerIds.alice,
      payoutType: 'fixed',
      fixedAmount: '1000.00',
    },
    {
      offerId: offerIds.fitnessApp,
      influencerId: influencerIds.bob,
      payoutType: 'cpa',
      cpaAmount: '50.00',
    },
  ]);

  console.log('Seed complete');
};

export const runStartup = async () => {
  console.log('Running startup tasks...');

  let retries = 10;
  while (retries > 0) {
    try {
      await db.execute(sql`SELECT 1`);
      console.log('Database connection established');
      break;
    } catch {
      console.log(`Waiting for database... (${retries} retries left)`);
      retries--;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  if (retries === 0) {
    throw new Error('Could not connect to database');
  }

  await seed();

  console.log('Startup tasks complete');
};
