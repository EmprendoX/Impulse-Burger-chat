/**
 * Escape HTML special characters to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Validate token format (64 character hexadecimal string)
 */
export function isValidToken(token: string): boolean {
  return /^[a-f0-9]{64}$/i.test(token);
}
