# Utiliser une image de base officielle de Node.js
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package.json package-lock.json ./

# Installer les dépendances de développement
RUN npm install

# Copier le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Exposer le port sur lequel l'application Next.js sera accessible
EXPOSE 3000

# Démarrer l'application Next.js en mode développement avec turbopack (si activé dans votre package.json)
CMD ["npm", "run", "dev"]
