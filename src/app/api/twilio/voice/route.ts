import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getBaseUrl } from "@/lib/twilio";
import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(request: NextRequest) {
  try {
    // Parse Twilio webhook data
    const formData = await request.formData();
    const to = formData.get("To") as string; // The Twilio number that was called
    const from = formData.get("From") as string; // The caller's phone number

    if (!to || !from) {
      console.error("Missing To or From in voice webhook");
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Look up user by Twilio number
    const supabase = createServiceClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("user_id, personal_phone, ring_duration")
      .eq("twilio_number", to)
      .single();

    if (error || !profile) {
      console.error("No profile found for Twilio number:", to, error);
      // Return a polite message if we can't find the business
      const response = new VoiceResponse();
      response.say(
        "Sorry, this number is not currently configured. Please try again later."
      );
      return new NextResponse(response.toString(), {
        headers: { "Content-Type": "text/xml" },
      });
    }

    if (!profile.personal_phone) {
      console.error("No personal phone configured for profile");
      const response = new VoiceResponse();
      response.say(
        "Sorry, this business has not completed setup. Please try again later."
      );
      return new NextResponse(response.toString(), {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Build TwiML response to dial owner's personal phone
    const response = new VoiceResponse();
    const baseUrl = getBaseUrl();

    // Dial the owner's personal phone with configured ring duration
    const dial = response.dial({
      timeout: profile.ring_duration || 20, // Default 20 seconds
      action: `${baseUrl}/api/twilio/status`, // Status callback URL
      method: "POST",
      callerId: to, // Show the Twilio number as caller ID
    });

    // Add the owner's personal phone number
    dial.number(profile.personal_phone);

    return new NextResponse(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("Error in voice webhook:", err);
    const response = new VoiceResponse();
    response.say(
      "Sorry, we encountered an error. Please try again later."
    );
    return new NextResponse(response.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
