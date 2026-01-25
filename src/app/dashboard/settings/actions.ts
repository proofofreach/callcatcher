'use server'

import { getServerUser } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface UpdateMessageTemplateInput {
  messageTemplate: string
}

interface UpdateMessageTemplateResult {
  success?: boolean
  error?: string
}

interface UpdateRingDurationInput {
  ringDuration: number
}

interface UpdateRingDurationResult {
  success?: boolean
  error?: string
}

const VALID_RING_DURATIONS = [10, 15, 20, 25, 30]

export async function updateRingDuration(
  input: UpdateRingDurationInput
): Promise<UpdateRingDurationResult> {
  const { user, error: authError } = await getServerUser()

  if (authError || !user) {
    return { error: 'You must be logged in to update settings' }
  }

  const { ringDuration } = input

  // Validate ring duration is one of the allowed values
  if (!VALID_RING_DURATIONS.includes(ringDuration)) {
    return { error: 'Invalid ring duration. Please select 10, 15, 20, 25, or 30 seconds.' }
  }

  const supabase = await createClient()

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      ring_duration: ringDuration,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Failed to update ring duration:', updateError)
    return { error: 'Failed to save ring duration. Please try again.' }
  }

  revalidatePath('/dashboard/settings')

  return { success: true }
}

export async function updateMessageTemplate(
  input: UpdateMessageTemplateInput
): Promise<UpdateMessageTemplateResult> {
  const { user, error: authError } = await getServerUser()

  if (authError || !user) {
    return { error: 'You must be logged in to update settings' }
  }

  const { messageTemplate } = input

  // Validate template length (SMS is 160 chars, but we allow more for template vars)
  if (!messageTemplate.trim()) {
    return { error: 'Message template cannot be empty' }
  }

  if (messageTemplate.length > 500) {
    return { error: 'Message template must be 500 characters or less' }
  }

  const supabase = await createClient()

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      message_template: messageTemplate,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)

  if (updateError) {
    console.error('Failed to update message template:', updateError)
    return { error: 'Failed to save message template. Please try again.' }
  }

  revalidatePath('/dashboard/settings')

  return { success: true }
}
