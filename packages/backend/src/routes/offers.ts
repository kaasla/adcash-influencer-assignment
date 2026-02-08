import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { conflict, notFound } from '../lib/errors.js';
import { validate } from '../lib/validate.js';
import {
  createCustomPayoutSchema,
  customPayoutParamsSchema,
  type CreateCustomPayoutInput,
} from '../schemas/custom-payout-schemas.js';
import { createOfferSchema, uuidParamSchema, updateOfferSchema } from '../schemas/offer-schemas.js';
import * as customPayoutService from '../services/custom-payout-service.js';
import * as influencerService from '../services/influencer-service.js';
import * as offerService from '../services/offer-service.js';

export const offersRouter = Router();

type OfferRecord = NonNullable<Awaited<ReturnType<typeof offerService.findOfferById>>>;

const parseAmount = (amount: string | null | undefined): number | null => {
  if (amount === null || amount === undefined) return null;
  const parsed = Number(amount);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizePayout = (payoutType: 'cpa' | 'fixed' | 'cpa_fixed', cpaAmount: string | null | undefined, fixedAmount: string | null | undefined) => ({
  payoutType,
  cpaAmount: payoutType === 'cpa' || payoutType === 'cpa_fixed' ? parseAmount(cpaAmount) : null,
  fixedAmount: payoutType === 'fixed' || payoutType === 'cpa_fixed' ? parseAmount(fixedAmount) : null,
});

const isSameAsBaseOfferPayout = (offer: OfferRecord, customPayout: CreateCustomPayoutInput): boolean => {
  const base = normalizePayout(offer.payoutType, offer.cpaAmount, offer.fixedAmount);
  const next = normalizePayout(customPayout.payoutType, customPayout.cpaAmount, customPayout.fixedAmount);

  return (
    base.payoutType === next.payoutType &&
    base.cpaAmount === next.cpaAmount &&
    base.fixedAmount === next.fixedAmount
  );
};

/**
 * @openapi
 * /api/v1/offers:
 *   get:
 *     tags: [Offers]
 *     summary: List all offers
 *     responses:
 *       200:
 *         description: List of offers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Offer'
 */
offersRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const offers = await offerService.findAllOffers();
    res.json(offers);
  }),
);

/**
 * @openapi
 * /api/v1/offers/{id}:
 *   get:
 *     tags: [Offers]
 *     summary: Get an offer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: The offer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Offer'
 *       404:
 *         description: Offer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
offersRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = validate(uuidParamSchema, req.params);
    const offer = await offerService.findOfferById(id);

    if (!offer) {
      throw notFound(`Offer with id '${id}' not found`);
    }

    res.json(offer);
  }),
);

/**
 * @openapi
 * /api/v1/offers:
 *   post:
 *     tags: [Offers]
 *     summary: Create a new offer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOffer'
 *     responses:
 *       201:
 *         description: The created offer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Offer'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
offersRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = validate(createOfferSchema, req.body);
    const offer = await offerService.createOffer(data);
    res.status(201).json(offer);
  }),
);

/**
 * @openapi
 * /api/v1/offers/{id}:
 *   put:
 *     tags: [Offers]
 *     summary: Update an offer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOffer'
 *     responses:
 *       200:
 *         description: The updated offer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Offer'
 *       404:
 *         description: Offer not found
 *       400:
 *         description: Validation error
 */
offersRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = validate(uuidParamSchema, req.params);
    const data = validate(updateOfferSchema, req.body);
    const offer = await offerService.updateOffer(id, data);

    if (!offer) {
      throw notFound(`Offer with id '${id}' not found`);
    }

    res.json(offer);
  }),
);

/**
 * @openapi
 * /api/v1/offers/{id}:
 *   delete:
 *     tags: [Offers]
 *     summary: Delete an offer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Offer deleted
 *       404:
 *         description: Offer not found
 */
offersRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = validate(uuidParamSchema, req.params);
    const offer = await offerService.deleteOfferById(id);

    if (!offer) {
      throw notFound(`Offer with id '${id}' not found`);
    }

    res.status(204).send();
  }),
);

/**
 * @openapi
 * /api/v1/offers/{offerId}/custom-payouts:
 *   post:
 *     tags: [Custom Payouts]
 *     summary: Create a custom payout for an influencer
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomPayout'
 *     responses:
 *       201:
 *         description: The created custom payout
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CustomPayout'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Offer or influencer not found
 *       409:
 *         description: Custom payout already exists
 */
offersRouter.post(
  '/:offerId/custom-payouts',
  asyncHandler(async (req, res) => {
    const { offerId } = validate(customPayoutParamsSchema.pick({ offerId: true }), req.params);
    const data = validate(createCustomPayoutSchema, req.body);

    const offer = await offerService.findOfferById(offerId);
    if (!offer) {
      throw notFound(`Offer with id '${offerId}' not found`);
    }

    const influencer = await influencerService.findInfluencerById(data.influencerId);
    if (!influencer) {
      throw notFound(`Influencer with id '${data.influencerId}' not found`);
    }

    const existing = await customPayoutService.findCustomPayout(offerId, data.influencerId);
    if (existing) {
      throw conflict('Custom payout already exists for this influencer and offer');
    }

    if (isSameAsBaseOfferPayout(offer, data)) {
      throw conflict('Custom payout matches the base offer payout. No custom payout is needed');
    }

    const customPayout = await customPayoutService.createCustomPayout(offerId, data);
    res.status(201).json(customPayout);
  }),
);

/**
 * @openapi
 * /api/v1/offers/{offerId}/custom-payouts/{influencerId}:
 *   delete:
 *     tags: [Custom Payouts]
 *     summary: Delete a custom payout
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: influencerId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Custom payout deleted
 *       404:
 *         description: Custom payout not found
 */
offersRouter.delete(
  '/:offerId/custom-payouts/:influencerId',
  asyncHandler(async (req, res) => {
    const { offerId, influencerId } = validate(customPayoutParamsSchema, req.params);

    const deleted = await customPayoutService.deleteCustomPayout(offerId, influencerId);
    if (!deleted) {
      throw notFound('Custom payout not found');
    }

    res.status(204).send();
  }),
);
