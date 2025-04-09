# Portfolio de Frédéric KOLLER

Ce projet est un site web moderne et interactif présentant le CV et portfolio de Frédéric KOLLER, développeur Web Full-Stack.

## Technologies utilisées

- [Vite](https://vitejs.dev/) - Outil de build ultra-rapide
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS utilitaire
- [AlpineJS](https://alpinejs.dev/) - Framework JavaScript minimaliste
- [AOS](https://michalsnik.github.io/aos/) - Animate On Scroll library

## Prérequis

- Node.js (v14.0.0 ou plus récent)
- npm ou yarn
- Docker
- Docker Compose

## Installation

1. Clonez ce dépôt
2. Naviguez dans le répertoire du projet
3. Installez les dépendances :

```bash
cd src
npm install
# ou
yarn
```

## Développement

Pour lancer le serveur de développement :

```bash
npm run dev
# ou
yarn dev
```

Le site sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

### Développement avec Docker

Pour lancer l'environnement de développement avec hot-reload :

```bash
docker-compose up dev
```

L'application sera disponible à l'adresse http://localhost:3000

## Construction pour la production

Pour construire le site pour la production :

```bash
npm run build
# ou
yarn build
```

Les fichiers générés seront disponibles dans le répertoire `dist`.

### Production avec Docker

Pour construire et exécuter l'application en mode production :

```bash
docker-compose up prod
```

L'application sera disponible à l'adresse http://localhost:80

#### Construction manuelle de l'image Docker

Vous pouvez également construire l'image Docker manuellement :

```bash
docker build -t frederic-portfolio .
docker run -p 80:80 frederic-portfolio
```

## Prévisualisation de la production

Pour prévisualiser la version de production :

```bash
npm run preview
# ou
yarn preview
```

## Fonctionnalités

- Design responsive adapté à tous les appareils
- Mode sombre/clair
- Animations au défilement
- Formulaire de contact
- Affichage interactif des compétences
- Fonction "Voir plus" pour les expériences professionnelles

## Personnalisation

Vous pouvez personnaliser les couleurs, polices et autres aspects du design en modifiant le fichier `tailwind.config.js`.

## Licence

MIT
