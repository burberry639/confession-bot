const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Store pending responses (in production, use a database)
const pendingResponses = new Map();

export default async function handler(request, response) {
  try {
    // Enable CORS
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    response.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (request.method === 'OPTIONS') {
      response.status(200).end();
      return;
    }

    if (request.method === 'POST') {
      const { message } = request.body;
      
      if (!message || message.trim() === '') {
        return response.status(400).json({ error: 'Message cannot be empty' });
      }

      if (!DISCORD_WEBHOOK_URL) {
        console.error('DISCORD_WEBHOOK_URL not set');
        return response.status(500).json({ error: 'Discord webhook URL not configured in environment variables' });
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

      response.json({ 
        success: true, 
        confessionId,
        message: 'Confession sent successfully'
      });
    } else if (request.method === 'GET') {
      const { id } = request.query;
      
      if (!id) {
        return response.status(400).json({ error: 'Confession ID required' });
      }

      const confession = pendingResponses.get(id);
      
      if (!confession) {
        return response.status(404).json({ error: 'Confession not found' });
      }

      response.json({
        id,
        message: confession.message,
        timestamp: confession.timestamp,
        responded: confession.responded,
        response: confession.response || null
      });
    } else {
      response.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    response.status(500).json({ error: error.message || 'Internal server error' });
  }
};
