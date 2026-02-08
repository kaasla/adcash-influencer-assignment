import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

type InfluencerOffer = {
  id: string;
  title: string;
  payoutType: string;
  cpaAmount: string | null;
  fixedAmount: string | null;
  hasCustomPayout: boolean;
};

type EntityWithId = { id: string };

const app = createApp();

describe('Influencer-specific offer payouts', () => {
  let offerId: string;
  let aliceId: string;
  let bobId: string;

  beforeAll(async () => {
    const offerRes = await request(app).post('/api/v1/offers').send({
      title: 'Test Campaign',
      description: 'A test offer for integration testing',
      payoutType: 'cpa',
      cpaAmount: '30.00',
    });
    expect(offerRes.status).toBe(201);
    offerId = (offerRes.body as EntityWithId).id;

    const aliceRes = await request(app)
      .post('/api/v1/influencers')
      .send({
        name: 'Test Alice',
        email: `test-alice-${Date.now()}@example.com`,
      });
    expect(aliceRes.status).toBe(201);
    aliceId = (aliceRes.body as EntityWithId).id;

    const bobRes = await request(app)
      .post('/api/v1/influencers')
      .send({
        name: 'Test Bob',
        email: `test-bob-${Date.now()}@example.com`,
      });
    expect(bobRes.status).toBe(201);
    bobId = (bobRes.body as EntityWithId).id;

    const customPayoutRes = await request(app)
      .post(`/api/v1/offers/${offerId}/custom-payouts`)
      .send({
        influencerId: aliceId,
        payoutType: 'fixed',
        fixedAmount: '1000.00',
      });
    expect(customPayoutRes.status).toBe(201);
  });

  afterAll(async () => {
    await request(app).delete(`/api/v1/offers/${offerId}/custom-payouts/${aliceId}`);
    await request(app).delete(`/api/v1/offers/${offerId}`);
  });

  it('should return custom payout for Alice (Fixed $1000)', async () => {
    const res = await request(app).get(`/api/v1/influencers/${aliceId}/offers`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const offers = res.body as InfluencerOffer[];
    const testOffer = offers.find((o) => o.id === offerId);
    expect(testOffer).toBeDefined();
    expect(testOffer?.payoutType).toBe('fixed');
    expect(testOffer?.fixedAmount).toBe('1000.00');
    expect(testOffer?.cpaAmount).toBeNull();
    expect(testOffer?.hasCustomPayout).toBe(true);
  });

  it('should return base payout for Bob (CPA $30)', async () => {
    const res = await request(app).get(`/api/v1/influencers/${bobId}/offers`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const offers = res.body as InfluencerOffer[];
    const testOffer = offers.find((o) => o.id === offerId);
    expect(testOffer).toBeDefined();
    expect(testOffer?.payoutType).toBe('cpa');
    expect(testOffer?.cpaAmount).toBe('30.00');
    expect(testOffer?.fixedAmount).toBeNull();
    expect(testOffer?.hasCustomPayout).toBe(false);
  });

  it('should filter offers by title search', async () => {
    const res = await request(app).get(
      `/api/v1/influencers/${aliceId}/offers?search=Test Campaign`,
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const offers = res.body as InfluencerOffer[];
    const testOffer = offers.find((o) => o.id === offerId);
    expect(testOffer).toBeDefined();
    expect(testOffer?.title).toBe('Test Campaign');
  });

  it('should return empty array for non-matching search', async () => {
    const res = await request(app).get(
      `/api/v1/influencers/${aliceId}/offers?search=NonExistentOffer12345`,
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const offers = res.body as InfluencerOffer[];
    expect(offers.find((o) => o.id === offerId)).toBeUndefined();
  });
});
