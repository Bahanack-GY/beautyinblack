# Beauty in Black - Application E-commerce de Parfums

Application React moderne de e-commerce spécialisée dans la vente de parfums. Développée avec React 19, Vite, Tailwind CSS v4 et Framer Motion pour les animations fluides.

## Spécifications du projet

Cette application frontend constitue l'interface utilisateur principale de la plateforme Beauty in Black. Elle permet aux clients de parcourir, rechercher, filtrer et acheter des parfums en ligne avec une expérience utilisateur optimisée.

## Démarrage du projet

### Prérequis

- Node.js (version 18 ou supérieure recommandée)
- npm ou yarn comme gestionnaire de paquets
- Accès à l'API backend (beutybackend) pour le fonctionnement complet

### Installation

1. Installer les dépendances du projet :
```bash
npm install
```

Cette commande installe toutes les dépendances listées dans `package.json`, incluant React 19, React Router DOM v7, Tailwind CSS v4, Framer Motion, Axios, React Query, et React Icons.

### Développement

Lancer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:5173` (ou le port indiqué par Vite). Le serveur de développement inclut le rechargement à chaud (HMR) pour un développement efficace.

### Construction pour la production

Construire l'application pour la production :
```bash
npm run build
```

Cette commande génère une version optimisée et minifiée de l'application dans le dossier `dist/`, prête pour le déploiement.

### Prévisualisation de la build de production

Prévisualiser la build de production localement :
```bash
npm run preview
```

Permet de tester la version de production avant le déploiement.

### Linting

Vérifier la qualité du code :
```bash
npm run lint
```

Analyse le code source avec ESLint pour détecter les erreurs et problèmes de style.

## Architecture de l'application

### Structure des dossiers

```
userui/
├── src/
│   ├── api/                    # Services API pour communiquer avec le backend
│   │   ├── authApi.js          # Authentification (login, signup, logout)
│   │   ├── cartApi.js          # Gestion du panier
│   │   ├── categoriesApi.js    # Récupération des catégories
│   │   ├── favoritesApi.js     # Gestion des favoris
│   │   ├── notificationsApi.js # Notifications utilisateur
│   │   ├── ordersApi.js        # Gestion des commandes
│   │   ├── productsApi.js      # Opérations sur les produits
│   │   ├── userApi.js          # Profil utilisateur et adresses
│   │   └── index.js            # Export centralisé des APIs
│   ├── components/             # Composants réutilisables
│   │   ├── Header.jsx           # En-tête avec navigation
│   │   ├── Navbar.jsx          # Barre de navigation principale
│   │   ├── Video.jsx           # Composant vidéo de fond
│   │   ├── Product-card.jsx    # Carte produit réutilisable
│   │   ├── Body-content.jsx    # Contenu principal de la page d'accueil
│   │   ├── AddressModal.jsx    # Modal de gestion d'adresses
│   │   └── ProtectedRoute.jsx  # Route protégée pour l'authentification
│   ├── hooks/                  # Hooks React personnalisés
│   │   ├── useAuth.js          # Hook pour l'authentification
│   │   ├── useCart.js          # Hook pour la gestion du panier
│   │   ├── useCategories.js    # Hook pour les catégories
│   │   ├── useFavorites.js     # Hook pour les favoris
│   │   ├── useNotifications.js # Hook pour les notifications
│   │   ├── useOrders.js        # Hook pour les commandes
│   │   ├── useProducts.js      # Hook pour les produits
│   │   ├── useUser.js          # Hook pour le profil utilisateur
│   │   └── index.js            # Export centralisé des hooks
│   ├── lib/                    # Bibliothèques et configurations
│   │   ├── axios.js            # Configuration Axios avec intercepteurs
│   │   └── queryClient.js      # Configuration React Query
│   ├── pages/                  # Pages de l'application
│   │   ├── Home.jsx            # Page d'accueil
│   │   ├── Auth.jsx            # Page d'authentification (login/signup)
│   │   ├── Decouvrir.jsx       # Page de découverte des collections
│   │   ├── Favoris.jsx         # Page des favoris
│   │   ├── Cart.jsx            # Page du panier
│   │   ├── ProductDetails.jsx  # Page de détails produit
│   │   ├── Notifications.jsx   # Page des notifications
│   │   ├── Utilisateur.jsx     # Page du profil utilisateur
│   │   ├── Category.jsx       # Page de catégorie
│   │   ├── Checkout.jsx        # Page de finalisation de commande
│   │   ├── Orders.jsx          # Page de l'historique des commandes
│   │   ├── OrderTracking.jsx   # Page de suivi de commande
│   │   └── ThankYou.jsx        # Page de confirmation de commande
│   ├── utils/                  # Utilitaires
│   │   └── priceFormatter.js   # Formatage des prix
│   ├── assets/                 # Ressources statiques
│   │   ├── fonts/              # Polices personnalisées
│   │   ├── Logo.png           # Logo de l'application
│   │   ├── newvideo.mp4        # Vidéo de fond
│   │   └── sample-product.png  # Image produit par défaut
│   ├── App.jsx                 # Configuration des routes et layout principal
│   ├── App.css                 # Styles globaux de l'application
│   ├── main.jsx                # Point d'entrée de l'application
│   └── index.css               # Styles de base et configuration Tailwind
├── public/                     # Fichiers publics statiques
├── package.json                # Dépendances et scripts du projet
├── vite.config.js              # Configuration Vite
├── eslint.config.js            # Configuration ESLint
└── index.html                  # Template HTML principal
```

## Routes de l'application

### Routes publiques

- **`/`** - Page d'accueil
  - Affiche une vidéo de fond avec animation de texte
  - Liste des produits parfums avec fonctionnalités de recherche et filtrage par catégorie
  - Filtres disponibles : Tout, Homme, Femme, Enfant
  - Intégration avec l'API backend pour récupérer les produits
  - Affichage des meilleures ventes

- **`/decouvrir`** - Page de découverte
  - Présentation des collections et nouveautés
  - Navigation vers les différentes catégories de produits

- **`/product/:id`** - Page de détails produit
  - Affichage détaillé d'un parfum avec toutes ses informations
  - Carrousel d'images pour visualiser le produit sous différents angles
  - Sélection de taille (obligatoire pour l'ajout au panier)
  - Sections pliables pour la description et les informations de livraison
  - Ajout au panier avec validation de la taille
  - Bouton favori pour ajouter/retirer des favoris
  - Affichage du prix selon la taille sélectionnée

- **`/category/:id`** - Page de catégorie
  - Affichage des produits filtrés par catégorie
  - Recherche et filtrage au sein de la catégorie

- **`/auth`** - Page d'authentification
  - Formulaire de connexion (login)
  - Formulaire d'inscription (signup)
  - Gestion des erreurs d'authentification
  - Redirection automatique après authentification réussie

### Routes protégées (nécessitent une authentification)

- **`/favoris`** - Page des favoris (Wish List)
  - Affiche la liste des parfums ajoutés aux favoris par l'utilisateur connecté
  - Possibilité d'ajouter les favoris au panier directement
  - Suppression d'articles des favoris
  - Synchronisation avec le backend via l'API

- **`/cart`** - Page du panier
  - Gestion complète du panier d'achat
  - Modification des quantités et suppression d'articles
  - Calcul automatique des totaux (sous-total, livraison, total)
  - Persistance des données via l'API backend
  - Validation des stocks avant le checkout

- **`/checkout`** - Page de finalisation de commande
  - Récapitulatif de la commande
  - Sélection ou ajout d'adresse de livraison
  - Choix du mode de paiement
  - Validation et soumission de la commande

- **`/orders`** - Page de l'historique des commandes
  - Liste de toutes les commandes passées par l'utilisateur
  - Filtrage par statut de commande
  - Accès aux détails de chaque commande

- **`/order/:id`** - Page de suivi de commande
  - Détails complets d'une commande spécifique
  - Timeline de suivi de la commande
  - Informations de livraison et statut

- **`/notifications`** - Page des notifications
  - Affichage de toutes les notifications de l'utilisateur
  - Marquer comme lues/non lues
  - Filtrage par type de notification

- **`/utilisateur`** - Page du profil utilisateur
  - Affichage des informations personnelles
  - Coordonnées (email, téléphone)
  - Sections cliquables : Modifier mon profil, Mes commandes, Adresse, Mes favoris
  - Navigation vers les différentes sections du profil
  - Gestion des adresses de livraison

- **`/thank-you`** - Page de confirmation de commande
  - Affichage après une commande réussie
  - Numéro de commande et récapitulatif
  - Liens vers le suivi de commande

## Technologies utilisées

### Framework et bibliothèques principales

- **React 19** - Bibliothèque JavaScript pour construire des interfaces utilisateur
  - Utilisation des hooks modernes (useState, useEffect, useContext)
  - Gestion de l'état local et global
  - Composants fonctionnels avec hooks

- **Vite 7** - Outil de build et serveur de développement
  - Compilation rapide et rechargement à chaud
  - Optimisation automatique pour la production
  - Support natif des modules ES6+

- **React Router DOM v7** - Routage côté client
  - Navigation entre les pages sans rechargement
  - Routes protégées avec composant ProtectedRoute
  - Paramètres dynamiques dans les URLs

- **Tailwind CSS v4** - Framework CSS utilitaire
  - Classes utilitaires pour le styling rapide
  - Configuration personnalisée avec thème rose (#B76E79)
  - Design responsive intégré
  - Dark mode support (si configuré)

- **Framer Motion** - Bibliothèque d'animations
  - Animations fluides pour les transitions de page
  - Animations d'entrée/sortie pour les composants
  - Animations de scroll et hover

### Gestion des données

- **Axios** - Client HTTP pour les requêtes API
  - Configuration centralisée dans `lib/axios.js`
  - Intercepteurs pour l'authentification (tokens JWT)
  - Gestion des erreurs globales

- **React Query (TanStack Query)** - Gestion du cache et synchronisation serveur
  - Cache automatique des données API
  - Synchronisation en arrière-plan
  - Gestion optimiste des mises à jour
  - Refetch automatique et invalidation de cache

### Interface utilisateur

- **React Icons** - Bibliothèque d'icônes
  - Icônes cohérentes dans toute l'application
  - Support de multiples familles d'icônes

## Fonctionnalités principales

### Gestion de l'authentification

- Connexion et inscription avec validation
- Stockage sécurisé du token JWT dans le localStorage
- Protection des routes nécessitant une authentification
- Déconnexion et nettoyage de la session
- Gestion des erreurs d'authentification

### Gestion des produits

- Affichage de la liste des produits avec pagination
- Recherche de produits par nom ou description
- Filtrage par catégorie (Homme, Femme, Enfant, Tout)
- Affichage des meilleures ventes
- Détails complets d'un produit avec images multiples
- Sélection de taille avec prix dynamique

### Gestion du panier

- Ajout de produits au panier avec sélection de taille
- Modification des quantités
- Suppression d'articles
- Calcul automatique des totaux
- Persistance via l'API backend
- Validation des stocks avant checkout

### Gestion des favoris

- Ajout/retrait de produits aux favoris
- Liste des favoris avec accès rapide
- Ajout direct au panier depuis les favoris
- Synchronisation avec le backend

### Gestion des commandes

- Création de commande depuis le panier
- Historique des commandes passées
- Suivi détaillé d'une commande avec timeline
- Affichage du statut de livraison

### Gestion du profil utilisateur

- Affichage et modification des informations personnelles
- Gestion des adresses de livraison (ajout, modification, suppression)
- Sélection d'adresse par défaut
- Accès rapide aux commandes et favoris

### Notifications

- Affichage des notifications utilisateur
- Marquage comme lues/non lues
- Filtrage par type de notification

### Interface utilisateur

- Design responsive pour mobile, tablette et desktop
- Animations fluides avec Framer Motion
- Thème rose cohérent (#B76E79) dans toute l'application
- Navigation intuitive avec header et navbar
- Modals pour les actions contextuelles

## Configuration de l'API

L'application communique avec le backend via l'API configurée dans `src/lib/axios.js`. 

### Configuration Axios

- URL de base de l'API configurable
- Intercepteur de requête pour ajouter le token JWT automatiquement
- Intercepteur de réponse pour gérer les erreurs globales
- Gestion de l'expiration des tokens et refresh automatique (si implémenté)

### Endpoints utilisés

- Authentification : `/api/auth/login`, `/api/auth/signup`
- Produits : `/api/products`, `/api/products/:id`, `/api/products/best-sellers`
- Panier : `/api/cart`, `/api/cart/checkout`
- Favoris : `/api/favorites`
- Commandes : `/api/orders`, `/api/orders/:id`
- Utilisateur : `/api/user/profile`, `/api/user/addresses`
- Catégories : `/api/categories`
- Notifications : `/api/notifications`

## Développement

### Structure des composants

Les composants suivent les meilleures pratiques React :
- Composants fonctionnels avec hooks
- Séparation des logiques métier dans des hooks personnalisés
- Réutilisabilité maximale des composants
- Props typées et validation (à améliorer avec TypeScript)

### Gestion de l'état

- État local avec `useState` pour les composants simples
- État global avec React Context si nécessaire
- État serveur géré par React Query
- Persistance via localStorage pour l'authentification

### Styles

- Utilisation de Tailwind CSS pour tous les styles
- Classes utilitaires pour le responsive design
- Animations avec Framer Motion
- Thème personnalisé dans `tailwind.config.js` (si présent)

## Déploiement

### Build de production

1. Construire l'application :
```bash
npm run build
```

2. Le dossier `dist/` contient les fichiers optimisés pour la production

3. Déployer sur votre plateforme préférée :
   - Vercel (recommandé pour les applications React)
   - Netlify
   - AWS S3 + CloudFront
   - DigitalOcean App Platform
   - Serveur web traditionnel (Nginx, Apache)

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :
```
VITE_API_URL=http://localhost:3000/api
```

Pour la production, utiliser l'URL de votre API backend.

## Notes de développement

- Le panier et l'authentification utilisent le localStorage pour la persistance côté client
- Les données sont synchronisées avec le backend via l'API
- Les animations sont gérées par Framer Motion pour une expérience utilisateur fluide
- Le thème de couleur principal est le rose (#B76E79) avec des variations pour les accents
- React Query gère automatiquement le cache et la synchronisation des données
- Les routes protégées nécessitent une authentification valide

## Améliorations futures

- [ ] Migration vers TypeScript pour une meilleure sécurité de types
- [ ] Implémentation du dark mode
- [ ] Optimisation des images avec lazy loading
- [ ] PWA (Progressive Web App) pour une expérience mobile native
- [ ] Tests unitaires et d'intégration
- [ ] Internationalisation (i18n) pour le support multilingue
- [ ] Optimisation SEO avec React Helmet
- [ ] Analytics et tracking des événements utilisateur
