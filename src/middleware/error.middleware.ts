import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        ok: false,
        error: 'Duplicate entry',
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        ok: false,
        error: 'Record not found',
      });
    }
  }

  // Handle known AppError
  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      ok: false,
      error: err.message,
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      ok: false,
      error: err.message,
    });
  }

  // Default error response
  res.status(500).json({
    ok: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
}
