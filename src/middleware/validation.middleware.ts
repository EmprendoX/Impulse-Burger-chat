import { Request, Response, NextFunction } from 'express';
import { isValidPhone } from '../utils/phone.util';

/**
 * Validate order creation payload
 */
export function validateOrderPayload(req: Request, res: Response, next: NextFunction) {
  const { orderNumber, customer, items, total, paymentStatus, paymentMethod, address } = req.body;

  // Check required fields
  if (!orderNumber || typeof orderNumber !== 'string') {
    return res.status(400).json({
      ok: false,
      error: 'orderNumber is required and must be a string',
    });
  }

  if (!customer || typeof customer !== 'object') {
    return res.status(400).json({
      ok: false,
      error: 'customer is required and must be an object',
    });
  }

  if (!customer.name || typeof customer.name !== 'string') {
    return res.status(400).json({
      ok: false,
      error: 'customer.name is required and must be a string',
    });
  }

  if (!customer.phone || typeof customer.phone !== 'string') {
    return res.status(400).json({
      ok: false,
      error: 'customer.phone is required and must be a string',
    });
  }

  if (!isValidPhone(customer.phone)) {
    return res.status(400).json({
      ok: false,
      error: 'customer.phone is not a valid phone number',
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      ok: false,
      error: 'items is required and must be a non-empty array',
    });
  }

  for (const item of items) {
    if (!item.name || typeof item.name !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'Each item must have a name (string)',
      });
    }
    if (typeof item.qty !== 'number' || item.qty < 1) {
      return res.status(400).json({
        ok: false,
        error: 'Each item must have a qty (number >= 1)',
      });
    }
  }

  if (!total || typeof total !== 'string') {
    return res.status(400).json({
      ok: false,
      error: 'total is required and must be a string',
    });
  }

  if (!paymentStatus || !['paid', 'pending', 'failed'].includes(paymentStatus)) {
    return res.status(400).json({
      ok: false,
      error: 'paymentStatus must be one of: paid, pending, failed',
    });
  }

  if (!paymentMethod || typeof paymentMethod !== 'string') {
    return res.status(400).json({
      ok: false,
      error: 'paymentMethod is required and must be a string',
    });
  }

  if (!address || typeof address !== 'string') {
    return res.status(400).json({
      ok: false,
      error: 'address is required and must be a string',
    });
  }

  next();
}

/**
 * Validate location ping payload
 */
export function validateLocationPayload(req: Request, res: Response, next: NextFunction) {
  const { lat, lng, accuracy } = req.body;

  if (typeof lat !== 'number' || lat < -90 || lat > 90) {
    return res.status(400).json({
      ok: false,
      error: 'lat must be a number between -90 and 90',
    });
  }

  if (typeof lng !== 'number' || lng < -180 || lng > 180) {
    return res.status(400).json({
      ok: false,
      error: 'lng must be a number between -180 and 180',
    });
  }

  if (typeof accuracy !== 'number' || accuracy < 0) {
    return res.status(400).json({
      ok: false,
      error: 'accuracy must be a non-negative number',
    });
  }

  next();
}
