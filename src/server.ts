import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error.middleware';

// Routes
import ordersRoutes from './routes/orders.routes';
import courierRoutes from './routes/courier.routes';
import trackingRoutes from './routes/tracking.routes';
import publicRoutes from './routes/public.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, status: 'healthy' });
});

// API Routes
app.use('/api/orders', ordersRoutes);
app.use('/api/courier', courierRoutes);
app.use('/api/track', trackingRoutes);

// Public Routes (HTML pages)
app.use('/', publicRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Base URL: ${env.BASE_URL}`);
  
  if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
    logger.warn('WhatsApp credentials not configured - running in dev mode');
  }
});
