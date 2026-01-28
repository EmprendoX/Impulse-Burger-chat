import crypto from 'crypto';

/**
 * Generate a secure random token (32 bytes = 64 hex characters)
 */
export function generateCustomerToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a secure random token for courier (32 bytes = 64 hex characters)
 */
export function generateCourierToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
