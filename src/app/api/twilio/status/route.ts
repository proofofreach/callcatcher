import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { twilioClient } from "@/lib/twilio";

// Default message template
const DEFAULT_MESSAGE_TEMPLATE =
  "Hi from {business_name}! Sorry we missed your call. We're open {hours}. How can we help?";

// Opt-out footer appended to all auto-replies
const OPT_OUT_FOOTER = "\n\nReply STOP to opt out.";

/**
 * Process message template, replacing variables with actual values
 */
function processTemplate(
  template: string,
  businessName: string | null,
  businessHours: string | null
): string {
  let message = template;

  // Replace {business_name}
  message = message.replace(/{business_name}/gi, businessName || "us");

  // Handle hours - if no hours set, remove the hours sentence entirely
  if (businessHours) {
    message = message.replace(/{hours}/gi, businessHours);
  } else {
    // Remove the hours sentence if no hours configured
    message = message
      .replace(/We're open {hours}\. ?/gi, "")
      .replace(/{hours}/gi, "");
  }

  return message.trim();
}

/**
 * POST /api/twilio/status
 * Twilio call status callback - handles call completion events
 * Sends auto-text for missed calls
 */
export async function POST(request: NextRequest) {
  try {
    // Parse Twilio webhook data
    const formData = await request.formData();
    const callStatus = formData.get("DialCallStatus") as string; // The status from <Dial> action
    const to = formData.get("To") as string; // The Twilio number
    const from = formData.get("From") as string; // The caller's phone number
    const callDuration = parseInt(formData.get("DialCallDuration") as string) || 0;

    console.log("Call status callback:", { callStatus, to, from, callDuration });

    if (!to || !from) {
      console.error("Missing To or From in status callback");
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Look up profile by Twilio number
    const supabase = createServiceClient();
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, business_name, business_hours, message_template, twilio_number")
      .eq("twilio_number", to)
      .single();

    if (profileError || !profile) {
      console.error("No profile found for Twilio number:", to, profileError);
      return NextResponse.json({ success: false, error: "Profile not found" });
    }

    // Determine if call was answered or missed
    // DialCallStatus values: completed (answered), no-answer, busy, failed, canceled
    const isAnswered = callStatus === "completed";
    const callDbStatus = isAnswered ? "answered" : "missed";

    // Log the call to the calls table
    const { error: callInsertError } = await supabase.from("calls").insert({
      user_id: profile.user_id,
      customer_phone: from,
      status: callDbStatus,
      duration: callDuration,
    });

    if (callInsertError) {
      console.error("Failed to log call:", callInsertError);
    }

    console.log(`Call logged: ${callDbStatus} from ${from}`);

    // If answered, no auto-text needed
    if (isAnswered) {
      return NextResponse.json({ success: true, action: "call_answered" });
    }

    // For missed calls, check if caller has opted out
    const { data: optOut, error: optOutError } = await supabase
      .from("opt_outs")
      .select("id")
      .eq("user_id", profile.user_id)
      .eq("phone_number", from)
      .maybeSingle();

    if (optOutError) {
      console.error("Error checking opt-out status:", optOutError);
    }

    if (optOut) {
      console.log(`Caller ${from} has opted out - skipping auto-text`);
      return NextResponse.json({ success: true, action: "opted_out" });
    }

    // Send auto-text to the caller
    if (!twilioClient) {
      console.error("Twilio client not configured - cannot send auto-text");
      return NextResponse.json({ success: false, error: "Twilio not configured" });
    }

    // Build the message with template variable replacement
    const template = profile.message_template || DEFAULT_MESSAGE_TEMPLATE;
    const messageBody = processTemplate(
      template,
      profile.business_name,
      profile.business_hours
    );
    const fullMessage = messageBody + OPT_OUT_FOOTER;

    // Send SMS via Twilio
    try {
      await twilioClient.messages.create({
        body: fullMessage,
        from: profile.twilio_number!,
        to: from,
      });
      console.log(`Auto-text sent to ${from}`);
    } catch (smsError) {
      console.error("Failed to send auto-text:", smsError);
      return NextResponse.json({ success: false, error: "Failed to send SMS" });
    }

    // Log the auto-reply message
    const { error: messageInsertError } = await supabase.from("messages").insert({
      user_id: profile.user_id,
      customer_phone: from,
      direction: "outbound",
      body: fullMessage,
      is_auto_reply: true,
    });

    if (messageInsertError) {
      console.error("Failed to log message:", messageInsertError);
    }

    return NextResponse.json({ success: true, action: "auto_text_sent" });
  } catch (err) {
    console.error("Error in status webhook:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
