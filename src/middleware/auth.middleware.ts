import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { logger } from '../utils/logger';

/**
 * Validate the x-impulse-secret header for order creation
 */
export function validateOrderSecret(req: Request, res: Response, next: NextFunction) {
  const secret = req.headers['x-impulse-secret'];
  
  if (!secret || secret !== env.IMPULSE_ORDER_SECRET) {
    logger.warn('Unauthorized order creation attempt', {
      ip: req.ip,
      hasSecret: !!secret,
    });
    
    return res.status(401).json({
      ok: false,
      error: 'Unauthorized',
    });
  }
  
  next();
}

/**
 * Validate admin API key from request headers
 */
export function validateAdminApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-admin-api-key'];

  if (!apiKey || apiKey !== env.ADMIN_API_KEY) {
    logger.warn('Unauthorized admin access attempt', {
      ip: req.ip,
      hasApiKey: !!apiKey,
    });

    return res.status(401).json({
      ok: false,
      error: 'Unauthorized',
    });
  }

  next();
}

/**
 * Validate courier token from request body
 */
export async function validateCourierToken(req: Request, res: Response, next: NextFunction) {
  const { orderNumber, token } = req.body;
  
  if (!orderNumber || !token) {
    return res.status(400).json({
      ok: false,
      error: 'Missing orderNumber or token',
    });
  }
  
  // Token validation will happen in the route handler
  // This middleware just ensures they're present
  next();
}

/**
 * Validate customer token from query parameters
 */
export function validateCustomerToken(req: Request, res: Response, next: NextFunction) {
  const { token } = req.query;
  
  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      ok: false,
      error: 'Missing or invalid token',
    });
  }
  
  next();
}
