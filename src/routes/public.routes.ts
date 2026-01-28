import { Router, Request, Response } from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { escapeHtml, isValidToken } from '../utils/escape.util';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Get the path to public HTML files (works in both dev and production)
 */
function getPublicPath(filename: string): string {
  // In development: process.cwd() is the project root
  // In production: process.cwd() is still the project root after build
  return resolve(process.cwd(), 'public', filename);
}

/**
 * Serve customer tracking page
 */
router.get('/t/:orderNumber', (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const token = req.query.token as string;

    if (!token) {
      return res.status(400).send('Token is required');
    }

    // Validate token format
    if (!isValidToken(token)) {
      logger.warn('Invalid token format provided', { orderNumber });
      return res.status(400).send('Invalid token format');
    }

    // Escape inputs to prevent XSS
    const safeOrderNumber = escapeHtml(orderNumber);
    const safeToken = escapeHtml(token);

    const htmlPath = getPublicPath('customer-track.html');
    let html = readFileSync(htmlPath, 'utf-8');
    
    // Inject orderNumber and token into the HTML (already escaped)
    html = html.replace('{{ORDER_NUMBER}}', safeOrderNumber);
    html = html.replace('{{TOKEN}}', safeToken);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error: any) {
    logger.error('Error loading customer tracking page:', {
      error: error.message,
      stack: error.stack,
      orderNumber: req.params.orderNumber,
    });
    res.status(500).send('Error loading tracking page');
  }
});

/**
 * Serve courier tracking page
 */
router.get('/c/:orderNumber', (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const token = req.query.token as string;

    if (!token) {
      return res.status(400).send('Token is required');
    }

    // Validate token format
    if (!isValidToken(token)) {
      logger.warn('Invalid token format provided', { orderNumber });
      return res.status(400).send('Invalid token format');
    }

    // Escape inputs to prevent XSS
    const safeOrderNumber = escapeHtml(orderNumber);
    const safeToken = escapeHtml(token);

    const htmlPath = getPublicPath('courier-track.html');
    let html = readFileSync(htmlPath, 'utf-8');
    
    // Inject orderNumber and token into the HTML (already escaped)
    html = html.replace('{{ORDER_NUMBER}}', safeOrderNumber);
    html = html.replace('{{TOKEN}}', safeToken);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error: any) {
    logger.error('Error loading courier tracking page:', {
      error: error.message,
      stack: error.stack,
      orderNumber: req.params.orderNumber,
    });
    res.status(500).send('Error loading courier page');
  }
});

export default router;
