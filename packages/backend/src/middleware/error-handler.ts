import type { ErrorRequestHandler } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../lib/errors.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    const body: { message: string; code: string; details?: unknown } = {
      message: err.message,
      code: err.code,
    };

    if (err.details !== undefined) {
      body.details = err.details;
    }

    res.status(err.statusCode).json({ error: body });
    return;
  }

  if (err instanceof Error) {
    console.error('Unhandled error:', err.stack ?? err.message);
    res.status(500).json({
      error: {
        message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        code: 'INTERNAL_ERROR',
      },
    });
    return;
  }

  console.error('Unhandled non-error thrown:', String(err));
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  });
};
