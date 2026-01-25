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
