# 🔒 Bot Confession

Un bot Discord de confession avec interface web permettant aux utilisateurs d'envoyer des messages secrets de manière anonyme.

## 📋 Fonctionnalités

- **Interface web intuitive** : Les utilisateurs peuvent envoyer des confessions via un site web
- **Anonymat total** : Les messages sont envoyés de manière anonyme
- **Intégration Discord** : Les confessions sont automatiquement postées dans le salon Discord spécifié
- **Système de réponse** : Les modérateurs peuvent répondre aux confessions via Discord
- **Interface moderne** : Design responsive et élégant

## 🚀 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Un token de bot Discord

### Étapes d'installation

1. **Cloner ou télécharger le projet**

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Créez un fichier `.env` à la racine du projet et ajoutez :
   ```env
   DISCORD_TOKEN=votre_token_discord_ici
   PORT=3000
   ```

   Pour obtenir votre token Discord :
   - Allez sur le [Discord Developer Portal](https://discord.com/developers/applications)
   - Créez une application
   - Allez dans l'onglet "Bot" et créez un bot
   - Copiez le token du bot
   - Activez les intents suivants :
     - Server Members Intent
     - Message Content Intent
   - Invitez le bot sur votre serveur avec les permissions nécessaires

4. **Démarrer le serveur**
   ```bash
   npm start
   ```

   Le serveur web démarrera sur `http://localhost:3000`

## 📖 Utilisation

### Pour les utilisateurs

1. Accédez à l'interface web : `http://localhost:3000`
2. Écrivez votre message secret dans le formulaire
3. Cliquez sur "Envoyer la confession"
4. Votre message sera posté sur le Discord de manière anonyme
5. Vous recevrez un ID de confession pour suivre votre message

### Pour les modérateurs (Discord)

Pour répondre à une confession, utilisez la commande :
```
!repondre <id_confession> <votre_réponse>
```

Exemple :
```
!repondre 1234567890 Merci pour votre confession, nous apprécions votre partage.
```

## 🛠️ Configuration

### Changer le salon Discord

Par défaut, le bot poste dans le salon avec l'ID `1502031882487988236`. Pour le changer :

1. Ouvrez `server.js`
2. Modifiez la ligne :
   ```javascript
   const DISCORD_CHANNEL_ID = '1502031882487988236';
   ```
3. Remplacez par l'ID de votre salon

### Changer le port

Par défaut, le serveur utilise le port 3000. Pour le changer :

1. Modifiez le fichier `.env` :
   ```env
   PORT=votre_port
   ```

## 📁 Structure du projet

```
Bot confession/
├── public/
│   ├── index.html      # Interface web principale
│   ├── style.css       # Styles CSS
│   └── script.js       # JavaScript frontend
├── server.js           # Serveur backend + Bot Discord
├── package.json        # Dépendances Node.js
├── .env.example        # Exemple de variables d'environnement
└── README.md           # Documentation
```

## 🔒 Sécurité

- Ne partagez jamais votre token Discord
- Les confessions sont stockées en mémoire uniquement (non persistantes)
- Utilisez HTTPS en production pour sécuriser les communications

## 🐛 Dépannage

### Le bot ne se connecte pas à Discord

- Vérifiez que votre token est correct dans le fichier `.env`
- Assurez-vous que les intents nécessaires sont activés sur le Discord Developer Portal
- Vérifiez que le bot a les permissions nécessaires sur le serveur

### L'interface web ne fonctionne pas

- Vérifiez que le serveur est bien démarré
- Assurez-vous que le port spécifié n'est pas déjà utilisé
- Vérifiez les logs du serveur pour les erreurs

### Les messages ne s'affichent pas sur Discord

- Vérifiez que l'ID du salon est correct
- Assurez-vous que le bot a la permission d'écrire dans le salon
- Vérifiez que le bot est bien présent sur le serveur

## 📝 Licence

Ce projet est fourni tel quel pour un usage personnel.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request.
"# confession-shinjukai" 
