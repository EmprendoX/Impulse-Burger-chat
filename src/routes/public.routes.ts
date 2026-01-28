import { Router, Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { env } from '../config/env';

const router = Router();

/**
 * Serve admin orders page
 */
router.get('/admin/orders', (req: Request, res: Response) => {
  try {
    const key = req.query.key;
    if (!key || typeof key !== 'string' || key !== env.ADMIN_API_KEY) {
      return res.status(401).send('Unauthorized');
    }
    const html = readFileSync(join(__dirname, '../../public/admin-orders.html'), 'utf-8');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading admin orders page');
  }
});

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

    let html = readFileSync(join(__dirname, '../../public/customer-track.html'), 'utf-8');
    
    // Inject orderNumber and token into the HTML
    html = html.replace('{{ORDER_NUMBER}}', orderNumber);
    html = html.replace('{{TOKEN}}', token);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
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

    let html = readFileSync(join(__dirname, '../../public/courier-track.html'), 'utf-8');
    
    // Inject orderNumber and token into the HTML
    html = html.replace('{{ORDER_NUMBER}}', orderNumber);
    html = html.replace('{{TOKEN}}', token);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading courier page');
  }
});

export default router;
