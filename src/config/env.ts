import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  IMPULSE_ORDER_SECRET: string;
  ADMIN_API_KEY: string;
  WHATSAPP_ACCESS_TOKEN?: string;
  WHATSAPP_PHONE_NUMBER_ID?: string;
  WHATSAPP_BUSINESS_ACCOUNT_ID?: string;
  DATABASE_URL: string;
  PORT: number;
  BASE_URL: string;
}

function getEnv(): EnvConfig {
  const IMPULSE_ORDER_SECRET = process.env.IMPULSE_ORDER_SECRET;
  if (!IMPULSE_ORDER_SECRET) {
    throw new Error('IMPULSE_ORDER_SECRET is required');
  }

  const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
  if (!ADMIN_API_KEY) {
    throw new Error('ADMIN_API_KEY is required');
  }

  const DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

  return {
    IMPULSE_ORDER_SECRET,
    ADMIN_API_KEY,
    WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_BUSINESS_ACCOUNT_ID: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
    DATABASE_URL,
    PORT,
    BASE_URL,
  };
}

export const env = getEnv();
