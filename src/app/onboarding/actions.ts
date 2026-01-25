'use server'

import { createClient } from '@/lib/supabase/server'

interface SaveBusinessProfileInput {
  userId: string
  businessName: string
  businessHours: string | null
  personalPhone: string
}

interface SaveBusinessProfileResult {
  success: boolean
  error?: string
}

export async function saveBusinessProfile(
  input: SaveBusinessProfileInput
): Promise<SaveBusinessProfileResult> {
  const supabase = await createClient()

  // Validate the input on the server side as well
  if (!input.businessName || input.businessName.length < 2 || input.businessName.length > 100) {
    return { success: false, error: 'Business name must be between 2 and 100 characters' }
  }

  if (!input.personalPhone || input.personalPhone.length !== 10) {
    return { success: false, error: 'Phone number must be 10 digits' }
  }

  // Check if profile already exists (upsert)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', input.userId)
    .single()

  if (existingProfile) {
    // Update existing profile
    const { error } = await supabase
      .from('profiles')
      .update({
        business_name: input.businessName,
        business_hours: input.businessHours,
        personal_phone: input.personalPhone,
      })
      .eq('user_id', input.userId)

    if (error) {
      console.error('Error updating profile:', error)
      return { success: false, error: 'Failed to update profile. Please try again.' }
    }
  } else {
    // Insert new profile
    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: input.userId,
        business_name: input.businessName,
        business_hours: input.businessHours,
        personal_phone: input.personalPhone,
      })

    if (error) {
      console.error('Error creating profile:', error)
      return { success: false, error: 'Failed to create profile. Please try again.' }
    }
  }

  return { success: true }
}
