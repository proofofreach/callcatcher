import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { twilioClient } from "@/lib/twilio";
import { formatPhoneNumber } from "@/lib/format";

/**
 * POST /api/twilio/sms
 * Twilio SMS webhook - handles inbound SMS messages
 *
 * Two-way routing:
 * 1. Customer -> Twilio number: Forward to owner's personal phone with sender info
 * 2. Owner (personal phone) -> Twilio number: Route reply back to customer
 */
export async function POST(request: NextRequest) {
  try {
    // Parse Twilio webhook data
    const formData = await request.formData();
    const to = formData.get("To") as string; // The Twilio number that received the SMS
    const from = formData.get("From") as string; // The sender's phone number
    const body = formData.get("Body") as string; // Message body

    console.log("SMS webhook:", { to, from, body: body?.slice(0, 50) });

    if (!to || !from || !body) {
      console.error("Missing required SMS parameters");
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Look up profile by Twilio number
    const supabase = createServiceClient();
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, personal_phone, business_name, twilio_number")
      .eq("twilio_number", to)
      .single();

    if (profileError || !profile) {
      console.error("No profile found for Twilio number:", to, profileError);
      return NextResponse.json({ success: false, error: "Profile not found" });
    }

    if (!twilioClient) {
      console.error("Twilio client not configured - cannot forward SMS");
      return NextResponse.json({ success: false, error: "Twilio not configured" });
    }

    // Determine if this is from the owner or a customer
    // Normalize phone numbers for comparison (remove non-digits, get last 10)
    const normalizedFrom = from.replace(/\D/g, "").slice(-10);
    const normalizedOwnerPhone = profile.personal_phone?.replace(/\D/g, "").slice(-10);

    const isFromOwner = normalizedFrom === normalizedOwnerPhone;

    if (isFromOwner) {
      // Owner is replying via Twilio number - route to customer
      // The owner's message format should be: "PHONE: message" or we use last customer
      await handleOwnerReply(supabase, profile, body, from);
    } else {
      // Customer message - forward to owner
      await handleCustomerMessage(supabase, profile, from, body);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in SMS webhook:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handle inbound message from a customer
 * Forward to owner's personal phone with sender info
 */
async function handleCustomerMessage(
  supabase: ReturnType<typeof createServiceClient>,
  profile: {
    user_id: string;
    personal_phone: string | null;
    business_name: string | null;
    twilio_number: string | null;
  },
  customerPhone: string,
  messageBody: string
) {
  // Log inbound message to messages table
  const { error: messageInsertError } = await supabase.from("messages").insert({
    user_id: profile.user_id,
    customer_phone: customerPhone,
    direction: "inbound",
    body: messageBody,
    is_auto_reply: false,
  });

  if (messageInsertError) {
    console.error("Failed to log inbound message:", messageInsertError);
  }

  // Forward to owner's personal phone
  if (!profile.personal_phone) {
    console.error("Owner has no personal phone configured");
    return;
  }

  if (!twilioClient || !profile.twilio_number) {
    console.error("Cannot forward: Twilio not configured");
    return;
  }

  // Format the forwarding message with sender info
  const formattedSenderPhone = formatPhoneNumber(customerPhone);
  const forwardedMessage = `From: ${formattedSenderPhone}\n\n${messageBody}`;

  try {
    await twilioClient.messages.create({
      body: forwardedMessage,
      from: profile.twilio_number,
      to: profile.personal_phone,
    });
    console.log(`Forwarded SMS from ${customerPhone} to owner`);
  } catch (smsError) {
    console.error("Failed to forward SMS to owner:", smsError);
  }
}

/**
 * Handle reply from owner - route back to customer
 * Owner texts the Twilio number, and we route to the last customer who texted
 */
async function handleOwnerReply(
  supabase: ReturnType<typeof createServiceClient>,
  profile: {
    user_id: string;
    personal_phone: string | null;
    business_name: string | null;
    twilio_number: string | null;
  },
  messageBody: string,
  ownerPhone: string
) {
  // Find the most recent customer that messaged us
  // The owner is replying to the last conversation
  const { data: lastCustomerMessage, error: msgError } = await supabase
    .from("messages")
    .select("customer_phone")
    .eq("user_id", profile.user_id)
    .eq("direction", "inbound")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (msgError || !lastCustomerMessage) {
    console.error("No recent customer to reply to:", msgError);
    // Could send error SMS back to owner
    return;
  }

  const customerPhone = lastCustomerMessage.customer_phone;

  if (!twilioClient || !profile.twilio_number) {
    console.error("Cannot send reply: Twilio not configured");
    return;
  }

  // Send the owner's reply to the customer
  try {
    await twilioClient.messages.create({
      body: messageBody,
      from: profile.twilio_number,
      to: customerPhone,
    });
    console.log(`Sent owner reply to ${customerPhone}`);
  } catch (smsError) {
    console.error("Failed to send reply to customer:", smsError);
    return;
  }

  // Log the outbound message
  const { error: logError } = await supabase.from("messages").insert({
    user_id: profile.user_id,
    customer_phone: customerPhone,
    direction: "outbound",
    body: messageBody,
    is_auto_reply: false,
  });

  if (logError) {
    console.error("Failed to log outbound reply:", logError);
  }
}
