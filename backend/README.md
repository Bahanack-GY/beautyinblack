# Beauty in Black - API Backend

Application backend NestJS pour la plateforme e-commerce Beauty in Black. API REST complète avec authentification JWT, gestion des produits, commandes, panier, favoris et notifications.

## Spécifications du projet

Cette application backend constitue le serveur API de la plateforme Beauty in Black. Elle fournit tous les endpoints nécessaires pour le fonctionnement de l'application frontend (userui) et du panneau d'administration (admin). L'architecture suit les meilleures pratiques NestJS avec une structure modulaire, l'injection de dépendances et la validation des données.

## Fonctionnalités

### Authentification

Système d'authentification complet avec JWT :

- **Inscription (Signup)** : Création de compte utilisateur avec validation
  - Validation des données d'entrée (email, mot de passe, nom)
  - Hashage sécurisé des mots de passe avec bcrypt
  - Génération de token JWT pour l'authentification
  - Gestion des erreurs (email déjà utilisé, etc.)

- **Connexion (Login)** : Authentification des utilisateurs
  - Vérification des identifiants
  - Comparaison du mot de passe hashé
  - Génération et retour du token JWT
  - Gestion des erreurs d'authentification

- **Réinitialisation de mot de passe** : Récupération de compte
  - Demande de réinitialisation (Forgot Password)
  - Réinitialisation avec token (Reset Password)
  - Validation et sécurité des tokens

- **Création d'administrateur** : Endpoint pour créer des comptes admin
  - Création de comptes administrateur avec privilèges élevés
  - Séparation des rôles utilisateur/admin

### Produits

Gestion complète du catalogue de produits :

- **Liste des produits** : Récupération de tous les produits avec pagination
  - Filtrage par catégorie
  - Recherche par nom ou description
  - Tri par prix, date, popularité
  - Pagination pour les grandes listes

- **Détails d'un produit** : Récupération des informations complètes
  - Informations détaillées (nom, description, images)
  - Tailles disponibles avec prix associés
  - Stock par taille
  - Catégorie et tags

- **Meilleures ventes** : Endpoint pour les produits les plus vendus
  - Calcul basé sur les ventes réelles
  - Limite configurable du nombre de produits

- **Création de produit** : Ajout de nouveaux produits (admin)
  - Validation des données (DTO)
  - Gestion des images (validation base64)
  - Création des tailles avec prix
  - Initialisation du stock

- **Modification de produit** : Mise à jour des produits (admin)
  - Mise à jour partielle ou complète
  - Validation des modifications
  - Gestion des images

- **Suppression de produit** : Suppression de produits (admin)
  - Vérification des dépendances (commandes, paniers)
  - Suppression sécurisée

### Panier

Gestion du panier d'achat :

- **Récupération du panier** : Panier de l'utilisateur connecté
  - Produits avec quantités et tailles sélectionnées
  - Calcul automatique des totaux
  - Synchronisation avec le stock

- **Ajout au panier** : Ajout de produits au panier
  - Validation de la taille et du stock
  - Gestion des quantités
  - Mise à jour si le produit existe déjà

- **Modification d'article** : Mise à jour de la quantité ou taille
  - Validation du stock disponible
  - Recalcul des totaux

- **Suppression d'article** : Retrait d'un produit du panier
  - Suppression sécurisée
  - Mise à jour des totaux

- **Checkout** : Finalisation de la commande
  - Validation du panier complet
  - Vérification des stocks
  - Création de la commande
  - Vidage du panier après commande réussie
  - Génération du numéro de commande

### Favoris

Gestion de la liste de souhaits (wishlist) :

- **Liste des favoris** : Récupération des favoris de l'utilisateur
  - Produits ajoutés aux favoris
  - Informations complètes des produits

- **Ajout aux favoris** : Ajout d'un produit aux favoris
  - Vérification de l'existence du produit
  - Éviter les doublons

- **Suppression des favoris** : Retrait d'un produit des favoris
  - Suppression sécurisée

- **Déplacer vers le panier** : Ajout direct au panier depuis les favoris
  - Conversion favori en article de panier
  - Suppression automatique des favoris après ajout

### Commandes

Gestion des commandes :

- **Liste des commandes** : Historique des commandes de l'utilisateur
  - Filtrage par statut
  - Tri par date
  - Pagination

- **Détails d'une commande** : Informations complètes d'une commande
  - Articles commandés avec détails
  - Adresse de livraison
  - Informations de paiement
  - Timeline de suivi
  - Statut actuel

- **Création de commande** : Création depuis le checkout
  - Validation des données
  - Enregistrement de tous les détails
  - Génération du numéro de commande unique
  - Mise à jour des stocks

- **Mise à jour du statut** : Modification du statut (admin)
  - Statuts : en attente, en cours, livrée, annulée
  - Historique des changements
  - Notifications automatiques

- **Suivi de commande** : Timeline de suivi
  - Événements de suivi (créée, confirmée, expédiée, livrée)
  - Dates et statuts

### Profil utilisateur

Gestion du profil et des adresses :

- **Profil utilisateur** : Informations personnelles
  - Récupération du profil
  - Mise à jour des informations (nom, email, téléphone)
  - Validation des modifications

- **Gestion des adresses** : Adresses de livraison
  - Liste des adresses
  - Ajout d'une nouvelle adresse
  - Modification d'une adresse
  - Suppression d'une adresse
  - Sélection d'adresse par défaut
  - Validation des données d'adresse

### Catégories

Gestion des catégories de produits :

- **Liste des catégories** : Toutes les catégories disponibles
  - Nom, description, image
  - Compteur de produits par catégorie

- **Création de catégorie** : Ajout de nouvelles catégories (admin)
  - Validation des données
  - Gestion des images

- **Modification de catégorie** : Mise à jour (admin)
- **Suppression de catégorie** : Suppression (admin)
  - Vérification des produits associés

- **Seeding** : Script de peuplement initial des catégories

### Notifications

Système de notifications utilisateur :

- **Liste des notifications** : Notifications de l'utilisateur
  - Filtrage par type (commande, stock, promotion, etc.)
  - Tri par date (plus récentes en premier)
  - Statut lu/non lu

- **Marquer comme lue** : Mise à jour du statut de lecture
  - Marquer une notification comme lue
  - Marquer toutes comme lues

- **Création de notification** : Génération automatique
  - Notifications pour nouvelles commandes
  - Notifications de changement de statut
  - Notifications de stock faible
  - Notifications promotionnelles

## Stack technologique

### Framework et bibliothèques principales

- **NestJS** : Framework Node.js progressif
  - Architecture modulaire
  - Injection de dépendances
  - Support TypeScript natif
  - Décorateurs et métadonnées
  - Architecture basée sur Express (par défaut)

- **MongoDB avec Mongoose** : Base de données NoSQL
  - Schémas Mongoose pour la validation
  - Relations entre documents
  - Indexation pour les performances
  - Agrégations pour les requêtes complexes

- **JWT avec Passport** : Authentification sécurisée
  - Génération et validation de tokens JWT
  - Stratégie Passport JWT
  - Protection des routes avec guards
  - Expiration configurable des tokens

- **Validation** : class-validator et class-transformer
  - DTOs (Data Transfer Objects) pour la validation
  - Validation automatique des requêtes
  - Transformation des données
  - Messages d'erreur personnalisés

- **Configuration** : @nestjs/config
  - Gestion des variables d'environnement
  - Configuration centralisée
  - Validation de la configuration

### Sécurité

- **Bcrypt** : Hashage sécurisé des mots de passe
  - Salt rounds configurable
  - Protection contre les attaques par force brute

- **Guards** : Protection des routes
  - JWT Auth Guard pour les routes protégées
  - Vérification automatique des tokens
  - Extraction de l'utilisateur depuis le token

- **Validation** : Validation stricte des entrées
  - Validation des DTOs
  - Sanitization des données
  - Protection contre l'injection

## Structure du projet

```
src/
├── auth/                       # Module d'authentification
│   ├── auth.controller.ts     # Contrôleur des endpoints d'authentification
│   ├── auth.service.ts        # Logique métier de l'authentification
│   ├── auth.module.ts         # Module d'authentification
│   ├── dto/                    # Data Transfer Objects
│   │   ├── signup.dto.ts      # DTO pour l'inscription
│   │   ├── login.dto.ts       # DTO pour la connexion
│   │   ├── forgot-password.dto.ts # DTO pour la réinitialisation
│   │   ├── reset-password.dto.ts  # DTO pour le reset
│   │   └── create-admin.dto.ts    # DTO pour créer un admin
│   ├── schemas/                # Schémas Mongoose
│   │   └── user.schema.ts      # Schéma utilisateur
│   └── strategies/             # Stratégies Passport
│       └── jwt.strategy.ts     # Stratégie JWT
├── products/                   # Module produits
│   ├── products.controller.ts # Contrôleur des endpoints produits
│   ├── products.service.ts    # Logique métier des produits
│   ├── products.module.ts     # Module produits
│   ├── dto/
│   │   └── create-product.dto.ts # DTO pour créer un produit
│   └── schemas/
│       └── product.schema.ts   # Schéma produit
├── cart/                       # Module panier
│   ├── cart.controller.ts     # Contrôleur des endpoints panier
│   ├── cart.service.ts        # Logique métier du panier
│   ├── cart.module.ts          # Module panier
│   ├── dto/
│   │   ├── add-to-cart.dto.ts # DTO pour ajouter au panier
│   │   ├── update-cart-item.dto.ts # DTO pour modifier
│   │   └── checkout.dto.ts    # DTO pour le checkout
│   └── schemas/
│       └── cart.schema.ts      # Schéma panier
├── favorites/                  # Module favoris
│   ├── favorites.controller.ts # Contrôleur des endpoints favoris
│   ├── favorites.service.ts   # Logique métier des favoris
│   ├── favorites.module.ts    # Module favoris
│   ├── dto/
│   │   ├── add-favorite.dto.ts # DTO pour ajouter aux favoris
│   │   └── move-to-cart.dto.ts # DTO pour déplacer vers panier
│   └── schemas/
│       └── favorite.schema.ts # Schéma favori
├── orders/                     # Module commandes
│   ├── orders.controller.ts   # Contrôleur des endpoints commandes
│   ├── orders.service.ts      # Logique métier des commandes
│   ├── orders.module.ts       # Module commandes
│   ├── dto/
│   │   └── create-order.dto.ts # DTO pour créer une commande
│   └── schemas/
│       └── order.schema.ts     # Schéma commande
├── user/                       # Module utilisateur
│   ├── user.controller.ts     # Contrôleur des endpoints utilisateur
│   ├── user.service.ts        # Logique métier utilisateur
│   ├── user.module.ts         # Module utilisateur
│   ├── dto/
│   │   ├── update-profile.dto.ts # DTO pour mettre à jour le profil
│   │   ├── create-address.dto.ts # DTO pour créer une adresse
│   │   └── update-address.dto.ts # DTO pour modifier une adresse
│   └── schemas/
│       └── address.schema.ts  # Schéma adresse
├── categories/                 # Module catégories
│   ├── categories.controller.ts # Contrôleur des endpoints catégories
│   ├── categories.service.ts  # Logique métier catégories
│   ├── categories.module.ts   # Module catégories
│   ├── categories.seed.ts     # Script de seeding
│   ├── dto/
│   │   └── create-category.dto.ts # DTO pour créer une catégorie
│   └── schemas/
│       └── category.schema.ts # Schéma catégorie
├── notifications/              # Module notifications
│   ├── notifications.controller.ts # Contrôleur des endpoints notifications
│   ├── notifications.service.ts # Logique métier notifications
│   ├── notifications.module.ts # Module notifications
│   └── schemas/
│       └── notification.schema.ts # Schéma notification
├── common/                      # Utilitaires partagés
│   ├── decorators/             # Décorateurs personnalisés
│   │   ├── current-user.decorator.ts # Décorateur pour récupérer l'utilisateur
│   │   └── public.decorator.ts # Décorateur pour routes publiques
│   ├── filters/                # Filtres d'exception
│   │   └── http-exception.filter.ts # Filtre global d'exception
│   ├── guards/                 # Guards de sécurité
│   │   └── jwt-auth.guard.ts  # Guard JWT
│   ├── interceptors/           # Intercepteurs
│   │   └── transform.interceptor.ts # Intercepteur de transformation
│   └── validators/             # Validateurs personnalisés
│       └── is-base64-image.validator.ts # Validateur d'image base64
├── config/                      # Configuration
│   ├── database.config.ts     # Configuration MongoDB
│   └── jwt.config.ts          # Configuration JWT
├── app.module.ts               # Module racine
├── app.controller.ts           # Contrôleur racine
├── app.service.ts              # Service racine
└── main.ts                     # Point d'entrée de l'application
```

## Prérequis

- **Node.js** : Version 18 ou supérieure
- **MongoDB** : Instance locale ou cloud (MongoDB Atlas)
- **npm ou yarn** : Gestionnaire de paquets

## Installation

### Installation des dépendances

```bash
npm install
```

Cette commande installe toutes les dépendances listées dans `package.json`, incluant NestJS, Mongoose, Passport, JWT, et toutes les bibliothèques de validation.

## Configuration

### Variables d'environnement

Créer un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/beautyinblack
# Pour MongoDB Atlas : mongodb+srv://username:password@cluster.mongodb.net/beautyinblack

# Configuration JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Configuration du serveur
PORT=3000
NODE_ENV=development

# Configuration CORS (optionnel)
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### Spécifications de configuration

- **MONGODB_URI** : URI de connexion à MongoDB. Pour le développement local, utiliser `mongodb://localhost:27017/beautyinblack`. Pour la production, utiliser une instance MongoDB Atlas ou un serveur MongoDB dédié.

- **JWT_SECRET** : Clé secrète pour signer les tokens JWT. En production, utiliser une clé longue et aléatoire, stockée de manière sécurisée.

- **JWT_EXPIRES_IN** : Durée de validité des tokens JWT. Format : nombre suivi de l'unité (s, m, h, d). Exemple : `7d` pour 7 jours.

- **PORT** : Port sur lequel le serveur écoute. Par défaut : 3000.

- **NODE_ENV** : Environnement d'exécution (`development`, `production`, `test`).

- **CORS_ORIGIN** : Origines autorisées pour les requêtes CORS. Séparer plusieurs origines par des virgules.

## Exécution de l'application

### Mode développement

```bash
npm run start:dev
```

Démarre le serveur en mode watch avec rechargement automatique lors des modifications. L'API sera disponible à `http://localhost:3000/api`.

### Mode production

```bash
# Construire l'application
npm run build

# Démarrer en mode production
npm run start:prod
```

Le mode production optimise le code et désactive les fonctionnalités de développement.

### Mode debug

```bash
npm run start:debug
```

Démarre le serveur avec le débogueur Node.js activé.

## Documentation de l'API

Tous les endpoints de l'API sont documentés dans le fichier `../API_ENDPOINTS.md` (si présent).

### URL de base

```
http://localhost:3000/api
```

### Authentification

La plupart des endpoints nécessitent une authentification. Inclure le token JWT dans l'en-tête Authorization :

```
Authorization: Bearer <token>
```

Le token est obtenu lors de la connexion (`/api/auth/login`) ou de l'inscription (`/api/auth/signup`).

### Endpoints principaux

- **Authentification** : `/api/auth/*`
- **Produits** : `/api/products/*`
- **Panier** : `/api/cart/*`
- **Favoris** : `/api/favorites/*`
- **Commandes** : `/api/orders/*`
- **Utilisateur** : `/api/user/*`
- **Catégories** : `/api/categories/*`
- **Notifications** : `/api/notifications/*`

## Architecture

Ce projet suit les meilleures pratiques NestJS et les principes SOLID :

### Architecture modulaire

Chaque fonctionnalité est organisée dans son propre module :
- **Séparation des responsabilités** : Chaque module gère sa propre logique métier
- **Réutilisabilité** : Modules réutilisables dans différentes parties de l'application
- **Maintenabilité** : Code organisé et facile à maintenir

### Injection de dépendances

Les services sont injectés où nécessaire :
- **Découplage** : Réduction des dépendances directes
- **Testabilité** : Facilite les tests unitaires avec des mocks
- **Flexibilité** : Changement d'implémentation sans modifier le code client

### DTOs (Data Transfer Objects)

Objets de transfert de données pour la validation des requêtes/réponses :
- **Validation automatique** : Validation des données d'entrée
- **Transformation** : Transformation des données selon les besoins
- **Documentation** : Documentation implicite de l'API

### Schémas MongoDB

Schémas Mongoose pour la modélisation des données :
- **Validation** : Validation au niveau de la base de données
- **Relations** : Gestion des relations entre documents
- **Indexation** : Optimisation des requêtes avec des index

### Guards

Protection des routes avec des guards :
- **JWT Auth Guard** : Vérification automatique des tokens JWT
- **Extraction de l'utilisateur** : Récupération de l'utilisateur depuis le token
- **Routes publiques** : Décorateur @Public() pour les routes publiques

### Filtres d'exception

Gestion globale des exceptions :
- **Format uniforme** : Format d'erreur cohérent dans toute l'API
- **Codes HTTP appropriés** : Codes de statut HTTP corrects
- **Messages d'erreur clairs** : Messages d'erreur compréhensibles

### Intercepteurs

Transformation des réponses :
- **Format uniforme** : Format de réponse cohérent
- **Métadonnées** : Ajout de métadonnées aux réponses

### Décorateurs personnalisés

Décorateurs pour simplifier le code :
- **@CurrentUser()** : Récupération de l'utilisateur actuel
- **@Public()** : Marquer une route comme publique

## Tests

### Tests unitaires

```bash
npm run test
```

Exécute tous les tests unitaires avec Jest. Les tests sont situés dans les fichiers `*.spec.ts`.

### Tests en mode watch

```bash
npm run test:watch
```

Exécute les tests en mode watch, relançant automatiquement les tests lors des modifications.

### Couverture de code

```bash
npm run test:cov
```

Génère un rapport de couverture de code dans le dossier `coverage/`.

### Tests E2E (End-to-End)

```bash
npm run test:e2e
```

Exécute les tests d'intégration end-to-end. Les tests E2E sont situés dans le dossier `test/`.

### Mode debug des tests

```bash
npm run test:debug
```

Démarre les tests avec le débogueur Node.js activé.

## Scripts disponibles

- **`npm run build`** : Compile le code TypeScript en JavaScript
- **`npm run format`** : Formate le code avec Prettier
- **`npm run start`** : Démarre l'application en mode production
- **`npm run start:dev`** : Démarre en mode développement avec watch
- **`npm run start:debug`** : Démarre en mode debug
- **`npm run start:prod`** : Démarre en mode production
- **`npm run lint`** : Vérifie le code avec ESLint et corrige automatiquement
- **`npm run test`** : Exécute les tests unitaires
- **`npm run test:watch`** : Exécute les tests en mode watch
- **`npm run test:cov`** : Génère le rapport de couverture
- **`npm run test:debug`** : Exécute les tests en mode debug
- **`npm run test:e2e`** : Exécute les tests E2E

## Déploiement

### Préparation pour la production

1. **Variables d'environnement** : Configurer toutes les variables d'environnement pour la production
2. **Base de données** : Utiliser une instance MongoDB de production (MongoDB Atlas recommandé)
3. **JWT Secret** : Utiliser une clé secrète forte et unique
4. **CORS** : Configurer les origines autorisées
5. **Build** : Construire l'application avec `npm run build`

### Options de déploiement

- **Heroku** : Déploiement simplifié avec buildpacks
- **AWS Elastic Beanstalk** : Déploiement sur AWS
- **DigitalOcean App Platform** : Déploiement géré
- **Docker** : Containerisation pour déploiement flexible
- **VPS traditionnel** : Serveur dédié avec PM2 ou systemd

### Variables d'environnement de production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-secret-key>
JWT_EXPIRES_IN=7d
PORT=3000
CORS_ORIGIN=https://yourdomain.com
```

## Sécurité

### Bonnes pratiques implémentées

- **Hashage des mots de passe** : Utilisation de bcrypt avec salt rounds
- **Tokens JWT sécurisés** : Expiration et validation des tokens
- **Validation des entrées** : Validation stricte avec class-validator
- **Protection des routes** : Guards pour les routes protégées
- **Gestion des erreurs** : Pas d'exposition d'informations sensibles dans les erreurs
- **CORS configuré** : Restriction des origines autorisées

### Recommandations supplémentaires

- Utiliser HTTPS en production
- Implémenter un rate limiting
- Ajouter une validation de la taille des uploads
- Implémenter un système de logs
- Configurer des alertes de sécurité
- Effectuer des audits de sécurité réguliers

## Licence

MIT License - Voir le fichier LICENSE pour plus de détails
