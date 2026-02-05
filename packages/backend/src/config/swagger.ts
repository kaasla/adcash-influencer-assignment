import swaggerJsdoc from 'swagger-jsdoc';

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
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
