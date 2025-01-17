# Projet Cocagne Next

## Introduction
Ce projet est une application web développée avec Next.js et Docker. Elle permet de gérer des tournées, des commandes et des calendriers pour les Jardins de Cocagne.

## Prérequis
- Docker
- Docker Compose

## Installation

1. Clonez le dépôt GitHub :
    ```sh
    git clone https://github.com/votre-utilisateur/projet_cocagne_next.git
    cd projet_cocagne_next
    ```

2. Créez un fichier `.env` à la racine du projet avec le contenu suivant :
    ```properties
    POSTGRES_PASSWORD=mdpdefou
    PGADMIN_EMAIL=admin@example.com
    PGADMIN_PASSWORD=admin
    ```

## Lancer l'application

1. Assurez-vous que Docker et Docker Compose sont installés sur votre machine.
2. Exécutez la commande suivante pour démarrer l'application :
    ```sh
    docker-compose up --build
    ```

## Accéder à l'application

- **Application Web** : [http://localhost:3000](http://localhost:3000)
- **PgAdmin** : [http://localhost:5050](http://localhost:5050)

### Identifiants PgAdmin
- **Email** : `admin@example.com`
- **Mot de passe** : `admin`

## Endpoints de l'API

### Authentification
- **POST** `/api/auth/register` : Inscription d'un utilisateur
- **POST** `/api/auth/login` : Connexion d'un utilisateur
- **GET** `/api/auth/users` : Récupérer les informations de l'utilisateur authentifié

### Structures
- **GET** `/api/structures` : Récupérer toutes les structures

### Points de Dépôt
- **GET** `/api/points` : Récupérer tous les points de dépôt

### Commandes
- **POST** `/api/commandes` : Créer une nouvelle commande
- **PUT** `/api/commandes` : Mettre à jour le statut d'une commande

### Tournées
- **GET** `/api/tournees` : Récupérer les tournées
- **POST** `/api/tournees` : Créer une nouvelle tournée
- **GET** `/api/tournees/{id}/calendrier` : Récupérer le calendrier d'une tournée
- **POST** `/api/tournees/{id}/calendrier` : Ajouter ou mettre à jour le calendrier d'une tournée
- **GET** `/api/tournees/{id}/points` : Récupérer les points de dépôt d'une tournée
- **POST** `/api/tournees/{id}/points` : Ajouter ou mettre à jour les points de dépôt d'une tournée

## Swagger Documentation
La documentation Swagger de l'API est disponible à l'adresse suivante :
- **Swagger UI** : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Tests
Pour exécuter les tests, utilisez la commande suivante :
```sh
npm run test:unit
```

## Contribution
Les contributions sont les bienvenues. Veuillez soumettre une pull request pour toute amélioration ou correction.

## Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
