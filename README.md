# Projet jardins de cocagne

## Introduction
Projet jardins de cocagne pour la S.A.É. Développement avancé (S5.A.01).
 
## Environnement de développement
L'application utilise plusieurs technologies et outils pour le développement et la gestion des environnements.

**Technologies principales**

- **Next.js** : Un framework React pour le rendu côté serveur et la génération de sites statiques.
- **Docker** : Utilisé pour containeriser l'application et ses dépendances, facilitant ainsi le déploiement et la gestion des environnements.
- **PgAdmin** : Une interface web pour gérer la base de données PostgreSQL.

## Prérequis
- Docker
- Docker Compose

## Ports Utilisés

L'application utilise les ports suivants :

- **Application Web (Next.js)** : `3000`
- **Base de Données (PostgreSQL)** : `5432`
- **PgAdmin** : `5050`

### Modifier les Ports

Pour modifier les ports utilisés par les services, vous pouvez éditer le fichier `docker-compose.yml` à la racine du projet. Par exemple, pour changer le port de l'application web :

```yaml
services:
  web:
    ports:
      - "3000:3000"  # Changez le port ici
```

## Installation

1. On clone le dépôt GitHub :
    ```sh
    git clone https://github.com/JRinor/projet_cocagne_next.git
    cd projet_cocagne_next
    ```

2. On crée un fichier `.env` à la racine du projet avec le contenu suivant :
    ```properties
    POSTGRES_PASSWORD=password123
    PGADMIN_EMAIL=admin@example.com
    PGADMIN_PASSWORD=admin
    ```

## Lancer l'application

1. On s'assure que Docker et Docker Compose sont installés sur votre machine.
2. On exécute la commande suivante pour démarrer l'application :
    ```sh
    docker-compose up --build
    ```

    Si l'application ne fonctionne pas correctement, essayez les commandes suivantes :
    ```sh
    docker-compose down -v
    docker-compose up --build
    ```

3. Pour vous connecter à la base de données PostgreSQL via la ligne de commande, utilisez la commande suivante :
    ```sh
    docker exec -it db psql -U postgres -d jardins_cocagne
    ```

## Environnement Docker
- **Service Web** : Utilise une image Node.js pour exécuter l'application Next.js. Le code source est monté dans le conteneur permettant un développement interactif.
- **Service Base de Données (Postgres)** : Utilise une image Postgres. Les données sont stockées dans un volume Docker pour persistance. Un script SQL d'initialisation est exécuté au démarrage.
- **Service PgAdmin** : Utilise une image PgAdmin pour la gestion de la base de données via une interface web.

## Importer la base de données
Pour importer la base de données, on ajoute notre fichier SQL d'initialisation dans `my-next-app/lib/init.sql`. Ce fichier sera exécuté automatiquement lors du démarrage du conteneur PostgreSQL.

## Accéder à l'application
- **Application Web** : [http://localhost:3000](http://localhost:3000)
- **PgAdmin** : [http://localhost:5050](http://localhost:5050)

**Identifiants PgAdmin**
- **Email** : `admin@example.com`
- **Mot de passe** : `admin`

Pour vous connecter au serveur PostgreSQL via PgAdmin, on utilise les informations suivantes:

- **Nom du serveur** : Votre choix (par exemple, "Projet Cocagne")
- **Hôte** : `db`
- **Port** : `5432`
- **Nom de la base de données** : `jardins_cocagne`
- **Nom d'utilisateur** : `postgres`
- **Mot de passe** : `password123` (comme défini dans le fichier `.env`)

## Pipeline CI
Le pipeline CI utilise GitHub Actions pour automatiser les tests et la construction de l'application. Voici les étapes principales :
1. **Checkout du code** : Récupère le code source du dépôt.
2. **Setup Docker Buildx** : Configure l'environnement pour les builds multi-plateformes.
3. **Login Docker Hub** : Se connecte à Docker Hub pour accéder aux images nécessaires.
4. **Installation de Docker Compose** : Télécharge et installe Docker Compose.
5. **Docker Compose Down** : Arrête tous les conteneurs et supprime les volumes Docker existants pour un environnement propre.
6. **Docker Compose Up and Build** : Construit et démarre les conteneurs Docker.
7. **Wait for services to be healthy** : Attend que tous les services soient en bonne santé avant de continuer.
8. **Run API tests** : Exécute les tests API pour vérifier le bon fonctionnement de l'application.
9. **Docker Compose Down** : Arrête tous les conteneurs et supprime les volumes Docker.
10. **Clean up Docker images** : Nettoie les images Docker inutilisées pour libérer de l'espace.

## Endpoints de l'API

**Authentification**
- **POST** `/api/auth/register` : Inscription d'un utilisateur
- **POST** `/api/auth/login` : Connexion d'un utilisateur
- **GET** `/api/auth/users` : Récupérer les informations de l'utilisateur authentifié

**Structures**
- **GET** `/api/structures` : Récupérer toutes les structures

**Points de Dépôt**
- **GET** `/api/points` : Récupérer tous les points de dépôt

**Commandes**
- **POST** `/api/commandes` : Créer une nouvelle commande
- **PUT** `/api/commandes` : Mettre à jour le statut d'une commande

**Tournées**
- **GET** `/api/tournees` : Récupérer les tournées
- **POST** `/api/tournees` : Créer une nouvelle tournée
- **GET** `/api/tournees/{id}/calendrier` : Récupérer le calendrier d'une tournée
- **POST** `/api/tournees/{id}/calendrier` : Ajouter ou mettre à jour le calendrier d'une tournée
- **GET** `/api/tournees/{id}/points` : Récupérer les points de dépôt d'une tournée
- **POST** `/api/tournees/{id}/points` : Ajouter ou mettre à jour les points de dépôt d'une tournée

## Documentation Swagger
La documentation Swagger de l'API est disponible à l'adresse suivante :
- **Swagger UI** : [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
