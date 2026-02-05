import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { notFound } from './lib/errors.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';
import { influencersRouter } from './routes/influencers.js';
import { offersRouter } from './routes/offers.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api/v1/offers', offersRouter);
  app.use('/api/v1/influencers', influencersRouter);

  app.use((_req, _res, next) => {
    next(notFound('Resource not found'));
  });

  app.use(errorHandler);

  return app;
};
