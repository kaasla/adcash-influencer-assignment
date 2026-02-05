import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { conflict, notFound } from '../lib/errors.js';
import { validate } from '../lib/validate.js';
import { uuidParamSchema } from '../schemas/offer-schemas.js';
import {
  createInfluencerSchema,
  influencerOffersQuerySchema,
} from '../schemas/influencer-schemas.js';
import * as influencerService from '../services/influencer-service.js';

export const influencersRouter = Router();

/**
 * @openapi
 * /api/v1/influencers:
 *   get:
 *     tags: [Influencers]
 *     summary: List all influencers
 *     responses:
 *       200:
 *         description: List of influencers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Influencer'
 */
influencersRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    const influencers = await influencerService.findAllInfluencers();
    res.json(influencers);
  }),
);

/**
 * @openapi
 * /api/v1/influencers:
 *   post:
 *     tags: [Influencers]
 *     summary: Create a new influencer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInfluencer'
 *     responses:
 *       201:
 *         description: The created influencer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Influencer'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
influencersRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = validate(createInfluencerSchema, req.body);

    const existing = await influencerService.findInfluencerByEmail(data.email);
    if (existing) {
      throw conflict(`Influencer with email '${data.email}' already exists`);
    }

    const influencer = await influencerService.createInfluencer(data);
    res.status(201).json(influencer);
  }),
);

/**
 * @openapi
 * /api/v1/influencers/{id}/offers:
 *   get:
 *     tags: [Influencers]
 *     summary: List offers from an influencer's viewpoint
 *     description: Returns all offers with payouts resolved for this influencer. Custom payouts override base payouts.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Influencer ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter offers by title (case-insensitive)
 *     responses:
 *       200:
 *         description: List of offers with resolved payouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InfluencerOffer'
 *       404:
 *         description: Influencer not found
 */
influencersRouter.get(
  '/:id/offers',
  asyncHandler(async (req, res) => {
    const { id } = validate(uuidParamSchema, req.params);
    const { search } = validate(influencerOffersQuerySchema, req.query);

    const influencer = await influencerService.findInfluencerById(id);
    if (!influencer) {
      throw notFound(`Influencer with id '${id}' not found`);
    }

    const offers = await influencerService.findOffersForInfluencer(id, search);
    res.json(offers);
  }),
);
