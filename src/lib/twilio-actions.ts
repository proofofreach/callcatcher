'use server'

import { twilioClient, getBaseUrl } from './twilio'
import { createClient } from '@/lib/supabase/server'

interface ProvisionPhoneNumberResult {
  success: boolean
  phoneNumber?: string
  error?: string
}

/**
 * Extract area code from ZIP code
 * This is a simplified mapping - in production you'd use a proper ZIP to area code API
 */
function getAreaCodeFromZip(zipCode: string): string {
  // Use first 3 digits of ZIP as a rough approximation
  // Real implementation would use a proper lookup service
  const zipPrefix = zipCode.slice(0, 3)

  // Common area code mappings based on ZIP prefixes (simplified)
  const zipToAreaCode: Record<string, string> = {
    // NYC
    '100': '212',
    '101': '212',
    '102': '212',
    '103': '212',
    '104': '212',
    // LA
    '900': '213',
    '901': '213',
    '902': '310',
    // Chicago
    '606': '312',
    '607': '312',
    // San Francisco
    '941': '415',
    '940': '415',
    // Seattle
    '981': '206',
    '980': '206',
    // Miami
    '331': '305',
    '330': '305',
    // Dallas
    '750': '214',
    '751': '214',
    // Default fallback
  }

  return zipToAreaCode[zipPrefix] || '415' // Default to San Francisco if unknown
}

/**
 * Provision a phone number from Twilio for the user
 * @param areaCodeOrZip - Either a 3-digit area code or 5-digit ZIP code
 * @param userId - The authenticated user's ID
 */
export async function provisionPhoneNumber(
  areaCodeOrZip: string,
  userId: string
): Promise<ProvisionPhoneNumberResult> {
  // Validate Twilio client is configured
  if (!twilioClient) {
    return {
      success: false,
      error: 'Twilio is not configured. Please contact support.',
    }
  }

  // Determine area code from input
  let areaCode: string
  if (areaCodeOrZip.length === 5) {
    // It's a ZIP code
    areaCode = getAreaCodeFromZip(areaCodeOrZip)
  } else if (areaCodeOrZip.length === 3) {
    // It's an area code
    areaCode = areaCodeOrZip
  } else {
    return {
      success: false,
      error: 'Please enter a valid 3-digit area code or 5-digit ZIP code.',
    }
  }

  try {
    // Search for available local numbers in the area code
    const availableNumbers = await twilioClient.availablePhoneNumbers('US')
      .local
      .list({
        areaCode: parseInt(areaCode),
        limit: 1,
        voiceEnabled: true,
        smsEnabled: true,
      })

    if (availableNumbers.length === 0) {
      // Fallback: search without area code restriction
      const fallbackNumbers = await twilioClient.availablePhoneNumbers('US')
        .local
        .list({
          limit: 1,
          voiceEnabled: true,
          smsEnabled: true,
        })

      if (fallbackNumbers.length === 0) {
        return {
          success: false,
          error: 'No phone numbers available. Please try again later.',
        }
      }

      // Use fallback number
      availableNumbers.push(fallbackNumbers[0])
    }

    const numberToPurchase = availableNumbers[0].phoneNumber

    // Get webhook URLs
    const baseUrl = getBaseUrl()
    const voiceUrl = `${baseUrl}/api/twilio/voice`
    const statusCallbackUrl = `${baseUrl}/api/twilio/status`
    const smsUrl = `${baseUrl}/api/twilio/sms`

    // Purchase the number
    const purchasedNumber = await twilioClient.incomingPhoneNumbers.create({
      phoneNumber: numberToPurchase,
      voiceUrl: voiceUrl,
      voiceMethod: 'POST',
      statusCallback: statusCallbackUrl,
      statusCallbackMethod: 'POST',
      smsUrl: smsUrl,
      smsMethod: 'POST',
    })

    // Store the number in the user's profile
    const supabase = await createClient()
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        twilio_number: purchasedNumber.phoneNumber,
      })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating profile with Twilio number:', updateError)
      // Note: The number is already purchased at this point
      // In production, you might want to release it or handle this differently
      return {
        success: false,
        error: 'Phone number purchased but failed to save to profile. Please contact support.',
      }
    }

    return {
      success: true,
      phoneNumber: purchasedNumber.phoneNumber,
    }
  } catch (error) {
    console.error('Error provisioning phone number:', error)

    // Provide a user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Check for common Twilio errors
    if (errorMessage.includes('21606')) {
      return {
        success: false,
        error: 'Your Twilio account needs to be verified to purchase phone numbers.',
      }
    }
    if (errorMessage.includes('20003')) {
      return {
        success: false,
        error: 'Twilio authentication failed. Please contact support.',
      }
    }

    return {
      success: false,
      error: 'Failed to provision phone number. Please try again.',
    }
  }
}
