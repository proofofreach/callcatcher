import Twilio from "twilio";

// Twilio client configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.warn(
    "Twilio credentials not configured. Phone provisioning will not work."
  );
}

// Create Twilio client (only if credentials are available)
export const twilioClient =
  accountSid && authToken ? Twilio(accountSid, authToken) : null;

// Get the base URL for webhooks
export function getBaseUrl(): string {
  // In production, use NEXT_PUBLIC_BASE_URL or the Vercel URL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Default for local development (should be overridden with ngrok URL)
  return "http://localhost:3000";
}
