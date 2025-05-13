import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: corsHeaders,
            status: 204,
        })
    }

    try {
        const { data } = await req.json()

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization') },
                },
            }
        )
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

        if (authError || !user) {
            throw new Error('Not authentication')
        }
        if (!data.itemId) {
            throw new Error('Item ID is required');
        }

        const { data: item, error: itemError } = await supabaseClient
            .from('items')
            .select('*')
            .eq('id', data.itemId)
            .eq('user_id', user.id)
            .single()
        
        if (itemError || !item) {
            throw new Error('Item not found');
        }

        const { data: updatedItem, error: updateError } = await supabaseClient
            .from('items')
            .update({
                title: data.title || item.title,
                description: data.description || item.description,
                is_complete: data.isComplete !== undefined ? data.isComplete : item.is_complete,
            })
            .eq('id', data.itemId)
            .select()
            .single()
        
        if (updateError) {
            throw updateError;
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: `Updated item successfully`,
                data: updatedItem,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        console.error('Error updating item:', error)

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