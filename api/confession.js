const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Store pending responses (in production, use a database)
const pendingResponses = new Map();

export default async function handler(request) {
  try {
    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    if (request.method === 'POST') {
      const { message } = await request.json();
      
      if (!message || message.trim() === '') {
        return new Response(
          JSON.stringify({ error: 'Message cannot be empty' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!DISCORD_WEBHOOK_URL) {
        console.error('DISCORD_WEBHOOK_URL not set');
        return new Response(
          JSON.stringify({ error: 'Discord webhook URL not configured in environment variables' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const confessionId = Date.now().toString();
      
      // Send confession to Discord via webhook
      const webhookResponse = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `🔒 **Confession #${confessionId}**\n\n${message}\n\n_Réponse en attente..._`
        })
      });

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text();
        console.error('Webhook failed:', webhookResponse.status, errorText);
        throw new Error(`Webhook failed with status ${webhookResponse.status}`);
      }

      // Store for response tracking
      pendingResponses.set(confessionId, {
        message,
        timestamp: new Date(),
        responded: false
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          confessionId,
          message: 'Confession sent successfully'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (request.method === 'GET') {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
      
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'Confession ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const confession = pendingResponses.get(id);
      
      if (!confession) {
        return new Response(
          JSON.stringify({ error: 'Confession not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          id,
          message: confession.message,
          timestamp: confession.timestamp,
          responded: confession.responded,
          response: confession.response || null
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
