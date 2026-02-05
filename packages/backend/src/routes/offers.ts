import { Router } from 'express';
import { asyncHandler } from '../lib/async-handler.js';
import { notFound } from '../lib/errors.js';
import { validate } from '../lib/validate.js';
import { createOfferSchema, uuidParamSchema, updateOfferSchema } from '../schemas/offer-schemas.js';
import * as offerService from '../services/offer-service.js';

export const offersRouter = Router();

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
