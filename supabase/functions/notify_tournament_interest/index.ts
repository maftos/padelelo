
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get the current user's ID
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (userError || !user) {
      throw new Error('Error getting user')
    }

    // Get the tournament ID from the request body
    const { tournament_id } = await req.json()
    if (!tournament_id) {
      throw new Error('No tournament ID provided')
    }

    console.log(`Processing interest toggle for tournament ${tournament_id} by user ${user.id}`)

    // Check if the user already has an interest record
    const { data: existingInterest, error: checkError } = await supabaseClient
      .from('tournament_application')
      .select('*')
      .eq('tournament_id', tournament_id)
      .eq('profile_id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw checkError
    }

    let result
    if (existingInterest) {
      // Toggle the existing interest (delete it)
      const { error: deleteError } = await supabaseClient
        .from('tournament_application')
        .delete()
        .eq('tournament_id', tournament_id)
        .eq('profile_id', user.id)

      if (deleteError) throw deleteError
      result = { isInterested: false }
    } else {
      // Create new interest
      const { error: insertError } = await supabaseClient
        .from('tournament_application')
        .insert([
          {
            tournament_id,
            profile_id: user.id,
            status: 'INTERESTED'
          }
        ])

      if (insertError) throw insertError
      result = { isInterested: true }
    }

    console.log(`Successfully processed interest toggle. Result:`, result)

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error processing tournament interest:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
