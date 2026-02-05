import type { ZodSchema } from 'zod';
import { AppError } from './errors.js';

export const validate = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new AppError(
      400,
      'Validation failed',
      'VALIDATION_ERROR',
      result.error.flatten().fieldErrors,
    );
  }

  return result.data;
};
