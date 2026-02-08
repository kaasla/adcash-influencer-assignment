import { fileURLToPath } from 'node:url';
import path from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const apiDefinitionGlobs = [
  path.resolve(currentDir, '../routes/*.ts'),
  path.resolve(currentDir, '../routes/*.js'),
  path.resolve(process.cwd(), 'src/routes/*.ts'),
  path.resolve(process.cwd(), 'dist/routes/*.js'),
];

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Adcash Influencer Platform API',
      version: '1.0.0',
      description: 'API for managing offers and influencer payouts',
    },
    components: {
      schemas: {
        Offer: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            payoutType: { type: 'string', enum: ['cpa', 'fixed', 'cpa_fixed'] },
            cpaAmount: { type: 'string', nullable: true, example: '25.00' },
            fixedAmount: { type: 'string', nullable: true, example: '500.00' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateOffer: {
          type: 'object',
          required: ['title', 'description', 'payoutType'],
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 255 },
            description: { type: 'string', minLength: 1 },
            payoutType: { type: 'string', enum: ['cpa', 'fixed', 'cpa_fixed'] },
            cpaAmount: { type: 'string', example: '25.00' },
            fixedAmount: { type: 'string', example: '500.00' },
          },
        },
        Influencer: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateInfluencer: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 255 },
            email: { type: 'string', format: 'email' },
          },
        },
        InfluencerOffer: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            payoutType: { type: 'string', enum: ['cpa', 'fixed', 'cpa_fixed'] },
            cpaAmount: { type: 'string', nullable: true, example: '25.00' },
            fixedAmount: { type: 'string', nullable: true, example: '500.00' },
            hasCustomPayout: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CustomPayout: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            offerId: { type: 'string', format: 'uuid' },
            influencerId: { type: 'string', format: 'uuid' },
            payoutType: { type: 'string', enum: ['cpa', 'fixed', 'cpa_fixed'] },
            cpaAmount: { type: 'string', nullable: true, example: '50.00' },
            fixedAmount: { type: 'string', nullable: true, example: '1000.00' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateCustomPayout: {
          type: 'object',
          required: ['influencerId', 'payoutType'],
          properties: {
            influencerId: { type: 'string', format: 'uuid' },
            payoutType: { type: 'string', enum: ['cpa', 'fixed', 'cpa_fixed'] },
            cpaAmount: { type: 'string', example: '50.00' },
            fixedAmount: { type: 'string', example: '1000.00' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                code: { type: 'string' },
                details: { type: 'object' },
              },
            },
          },
        },
      },
    },
  },
  apis: apiDefinitionGlobs,
};

export const swaggerSpec = swaggerJsdoc(options);
