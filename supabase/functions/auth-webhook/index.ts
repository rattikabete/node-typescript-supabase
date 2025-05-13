import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: corsHeaders,
            status: 204,
        })
    }

    try {
        // Get the auth event from the request
        const { type, record } = await req.json()

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Handle different auth events
        switch (type) {
            case 'signup': {
                // User signed up, create a profile record
                if (record?.id) {
                    const { error } = await supabaseAdmin
                        .from('profiles')
                        .insert({
                            id: record.id,
                            username: record.email?.split('@')[0] || null,
                            full_name: record.user_metadata?.full_name || null,
                            avatar_url: record.user_metadata?.avatar_url || null,
                        })

                    if (error) throw error

                    console.log('Created new profile for user:', record.id)
                }
                break
            }

            case 'delete': {
                // User was deleted, any cleanup needed
                console.log('User deleted:', record?.id)
                break
            }

            default:
                // Unknown event type
                console.log('Unhandled auth event type:', type)
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: `Processed auth webhook event: ${type}`
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        console.error('Error processing auth webhook:', error)

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})