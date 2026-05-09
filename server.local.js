require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DISCORD_CHANNEL_ID = '1502031882487988236';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Discord Bot Setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
});

// Store pending responses
const pendingResponses = new Map();

// API Route to submit confession
app.post('/api/confession', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Send to Discord channel
    const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
    if (!channel) {
      return res.status(500).json({ error: 'Discord channel not found' });
    }

    const confessionId = Date.now().toString();
    
    // Send confession to Discord
    await channel.send({
      content: `🔒 **Confession #${confessionId}**\n\n${message}\n\n_Réponse en attente..._`
    });

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
});

// API Route to get confession status
app.get('/api/confession/:id', (req, res) => {
  const { id } = req.params;
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
});

// API Route for bot to send response
app.post('/api/response', async (req, res) => {
  try {
    const { confessionId, response } = req.body;
    
    const confession = pendingResponses.get(confessionId);
    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    // Update confession with response
    confession.responded = true;
    confession.response = response;
    confession.responseTimestamp = new Date();

    // Update Discord message
    const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
    const messages = await channel.messages.fetch({ limit: 50 });
    
    const botMessage = messages.find(m => m.content.includes(`Confession #${confessionId}`));
    if (botMessage) {
      await botMessage.edit({
        content: `🔒 **Confession #${confessionId}**\n\n${confession.message}\n\n✨ **Réponse:**\n${response}`
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({ error: 'Failed to add response' });
  }
});

// Discord Bot Command to respond to confessions
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'repondre') {
    if (args.length < 2) {
      return message.reply('Usage: !repondre <id> <réponse>');
    }

    const confessionId = args[0];
    const response = args.slice(1).join(' ');

    // Send response via internal API
    try {
      await fetch(`http://localhost:${PORT}/api/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confessionId, response })
      });
      message.reply(`Réponse envoyée pour la confession #${confessionId}`);
    } catch (error) {
      message.reply('Erreur lors de l\'envoi de la réponse');
    }
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Serveur web démarré sur le port ${PORT}`);
});

// Login Discord Bot
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
if (!DISCORD_TOKEN) {
  console.error('Erreur: DISCORD_TOKEN non défini dans les variables d\'environnement');
  process.exit(1);
}

client.login(DISCORD_TOKEN);
