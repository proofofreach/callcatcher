/**
 * Format a phone number for display
 * Converts +1XXXXXXXXXX to (XXX) XXX-XXXX
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, '')
  const lastTen = digits.slice(-10)

  if (lastTen.length !== 10) {
    return phoneNumber // Return original if not 10 digits
  }

  return `(${lastTen.slice(0, 3)}) ${lastTen.slice(3, 6)}-${lastTen.slice(6)}`
}
