import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

async function logSyncEvent(eventType: string, source: string, status: string, payload: any) {
  try {
    await supabase.from('sync_logs').insert({
      event_type: eventType,
      source: source,
      status: status,
      payload: payload
    })
  } catch (error) {
    console.error('Error logging sync event:', error)
  }
}

async function handleUserCreated(userData: any) {
  try {
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select()
      .eq('wordpress_user_id', userData.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingUser) {
      console.log('User already exists:', existingUser.id)
      return existingUser
    }

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        wordpress_user_id: userData.id,
        username: userData.username,
        email: userData.email,
        avatar_url: userData.avatar_url || null,
        cover_url: null
      })
      .select()
      .single()

    if (insertError) throw insertError
    console.log('Created new user:', newUser.id)
    return newUser
  } catch (error) {
    console.error('Error handling user creation:', error)
    throw error
  }
}

async function handleUserUpdated(userData: any) {
  try {
    const { data: user, error: updateError } = await supabase
      .from('users')
      .update({
        username: userData.username,
        email: userData.email,
        avatar_url: userData.avatar_url || null
      })
      .eq('wordpress_user_id', userData.id)
      .select()
      .single()

    if (updateError) throw updateError
    console.log('Updated user:', user.id)
    return user
  } catch (error) {
    console.error('Error handling user update:', error)
    throw error
  }
}

async function handleUserDeleted(wordpressUserId: number) {
  try {
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('wordpress_user_id', wordpressUserId)

    if (deleteError) throw deleteError
    console.log('Deleted user with WordPress ID:', wordpressUserId)
  } catch (error) {
    console.error('Error handling user deletion:', error)
    throw error
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, user_data } = await req.json()
    console.log('Received webhook:', { action, user_data })

    let result
    switch (action) {
      case 'user_created':
        result = await handleUserCreated(user_data)
        await logSyncEvent('user_created', 'webhook', 'success', user_data)
        break
      
      case 'user_updated':
        result = await handleUserUpdated(user_data)
        await logSyncEvent('user_updated', 'webhook', 'success', user_data)
        break
      
      case 'user_deleted':
        await handleUserDeleted(user_data.id)
        result = { success: true }
        await logSyncEvent('user_deleted', 'webhook', 'success', user_data)
        break
      
      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    await logSyncEvent(
      'error',
      'webhook',
      'error',
      { error: error.message }
    )

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})