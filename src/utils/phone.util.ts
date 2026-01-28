/**
 * Normalize phone number to E.164 format
 * Example: "+52 55 1234 5678" -> "+525512345678"
 */
export function normalizePhone(phone: string): string {
  // Remove all non-digit characters except leading +
  let normalized = phone.trim();
  
  // If it doesn't start with +, assume it needs country code
  // For Mexico, we'll add +52 if missing
  if (!normalized.startsWith('+')) {
    // Remove any leading zeros or country codes that might be there
    normalized = normalized.replace(/^0+/, '');
    // If it looks like a Mexican number (10 digits), add +52
    if (/^\d{10}$/.test(normalized.replace(/\D/g, ''))) {
      normalized = '+52' + normalized;
    } else {
      normalized = '+' + normalized;
    }
  }
  
  // Remove all non-digit characters except the leading +
  normalized = normalized.replace(/(?!^\+)\D/g, '');
  
  return normalized;
}

/**
 * Validate phone number format (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // E.164 format: + followed by 7-15 digits
  return /^\+[1-9]\d{6,14}$/.test(normalized);
}
