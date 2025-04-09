# Étape de build
FROM node:18-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:stable-alpine AS production

# Copier la configuration Nginx personnalisée
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de build depuis l'étape précédente
COPY --from=build /app/src/dist /usr/share/nginx/html

COPY robots.txt /usr/share/nginx/html/robots.txt
COPY sitemap.xml /usr/share/nginx/html/sitemap.xml

# Exposer le port 80
EXPOSE 80

# Commande pour démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
