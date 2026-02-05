export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const notFound = (message: string) => new AppError(404, message, 'NOT_FOUND');

export const validationError = (message: string, details?: unknown) =>
  new AppError(400, message, 'VALIDATION_ERROR', details);

export const conflict = (message: string) => new AppError(409, message, 'CONFLICT');
