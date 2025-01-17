# Utiliser une image de base officielle de Node.js avec une version spécifique
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le reste des fichiers de l'application
COPY . .

# Construire l'application
RUN npm run build

# Exposer le port sur lequel l'application Next.js sera accessible
EXPOSE 3000

# Démarrer le serveur Next.js
CMD ["npm", "start"]
