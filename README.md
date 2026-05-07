# 🔒 Bot Confession

Un bot Discord de confession avec interface web permettant aux utilisateurs d'envoyer des messages secrets de manière anonyme.

## 📋 Fonctionnalités

- **Interface web intuitive** : Les utilisateurs peuvent envoyer des confessions via un site web
- **Anonymat total** : Les messages sont envoyés de manière anonyme
- **Intégration Discord** : Les confessions sont automatiquement postées via Webhook
- **Interface moderne** : Design responsive et élégant
- **Déploiement Vercel** : Prêt pour le déploiement serverless

## 🚀 Déploiement sur Vercel

### Étape 1 : Obtenir un Webhook Discord

1. Allez dans votre serveur Discord
2. Cliquez sur les paramètres du salon où vous voulez recevoir les confessions
3. Allez dans "Intégrations" → "Webhooks"
4. Cliquez sur "Créer un Webhook"
5. Copiez l'URL du webhook

### Étape 2 : Déployer sur Vercel

1. **Pusher votre code sur GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/votre-username/bot-confession.git
   git push -u origin main
   ```

2. **Importer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Add New Project"
   - Importez votre repository GitHub
   - Cliquez sur "Deploy"

3. **Configurer les variables d'environnement**
   - Dans les paramètres du projet Vercel
   - Allez dans "Settings" → "Environment Variables"
   - Ajoutez :
     - Nom : `DISCORD_WEBHOOK_URL`
     - Valeur : votre URL de webhook Discord
   - Redéployez le projet

4. **Accéder à votre site**
   - Vercel vous fournira une URL comme `https://bot-confession.vercel.app`
   - Partagez cette URL avec vos utilisateurs

### Alternative : Déploiement local

Si vous préférez exécuter localement :

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement**
   
   Créez un fichier `.env` à la racine du projet et ajoutez :
   ```env
   DISCORD_WEBHOOK_URL=votre_url_webhook_discord_ici
   ```

3. **Démarrer le serveur**
   ```bash
   npm start
   ```

   Le serveur web démarrera sur `http://localhost:3000`

## 📖 Utilisation

### Pour les utilisateurs

1. Accédez à l'interface web (URL Vercel ou localhost)
2. Écrivez votre message secret dans le formulaire
3. Cliquez sur "Envoyer la confession"
4. Votre message sera posté sur le Discord de manière anonyme
5. Vous recevrez un ID de confirmation

### Pour les modérateurs (Discord)

Les confessions apparaîtront directement dans le salon configuré avec le webhook. Les modérateurs peuvent répondre manuellement dans le salon Discord.

## 🛠️ Configuration

### Changer le Webhook Discord

Pour utiliser un autre webhook :
- Modifiez la variable d'environnement `DISCORD_WEBHOOK_URL`
- Sur Vercel : Settings → Environment Variables
- En local : Modifiez le fichier `.env`

## 📁 Structure du projet

```
Bot confession/
├── public/
│   ├── index.html      # Interface web principale
│   ├── style.css       # Styles CSS
│   └── script.js       # JavaScript frontend
├── api/
│   └── confession.js   # API serverless Vercel
├── vercel.json         # Configuration Vercel
├── package.json        # Dépendances Node.js
├── .env.example        # Exemple de variables d'environnement
└── README.md           # Documentation
```

## 🔒 Sécurité

- Ne partagez jamais votre URL de webhook Discord
- Les confessions sont stockées en mémoire uniquement (non persistantes)
- Vercel utilise HTTPS automatiquement

## 🐛 Dépannage

### Les messages ne s'affichent pas sur Discord

- Vérifiez que l'URL du webhook est correcte
- Assurez-vous que le webhook a la permission d'écrire dans le salon
- Vérifiez les logs Vercel pour les erreurs

### Erreur sur l'interface web

- Vérifiez que la variable d'environnement est configurée
- Regardez les logs dans le tableau de bord Vercel
- Assurez-vous que le webhook Discord est actif

## 📝 Licence

Ce projet est fourni tel quel pour un usage personnel.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou un pull request.
"# confession-shinjukai" 
"# confession-shinjukai" 
"# confession-shinjukai" 
