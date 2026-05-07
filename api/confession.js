const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Store pending responses (in production, use a database)
const pendingResponses = new Map();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      
      if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Message cannot be empty' });
      }

      if (!DISCORD_WEBHOOK_URL) {
        return res.status(500).json({ error: 'Discord webhook URL not configured' });
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
        throw new Error('Failed to send webhook');
      }

      // Store for response tracking
      pendingResponses.set(confessionId, {
        message,
        timestamp: new Date(),
        responded: false
      });

      res.json({ 
        success: true, 
        confessionId,
        message: 'Confession sent successfully'
      });
    } catch (error) {
      console.error('Error submitting confession:', error);
      res.status(500).json({ error: 'Failed to submit confession' });
    }
  } else if (req.method === 'GET') {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Confession ID required' });
    }

    const confession = pendingResponses.get(id);
    
    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    res.json({
      id,
      message: confession.message,
      timestamp: confession.timestamp,
      responded: confession.responded,
      response: confession.response || null
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
