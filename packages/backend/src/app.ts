import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { notFound } from './lib/errors.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestLogger } from './middleware/request-logger.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use((_req, _res, next) => {
    next(notFound('Resource not found'));
  });

  app.use(errorHandler);

  return app;
};
