# Beauty in Black - Panneau d'Administration

Panneau d'administration moderne et complet pour la gestion de la plateforme e-commerce Beauty in Black. Développé avec React 19, Tailwind CSS v4, Framer Motion et Recharts pour les visualisations de données.

## Spécifications du projet

Cette application frontend constitue l'interface d'administration de la plateforme Beauty in Black. Elle permet aux administrateurs de gérer l'ensemble des aspects de la boutique en ligne : produits, commandes, utilisateurs, catégories, analytics et paramètres.

## Fonctionnalités principales

### Fonctionnalités de base

- **Tableau de bord (Dashboard)** : Vue d'ensemble avec métriques clés, graphiques de ventes et commandes récentes
  - Cartes de statistiques (revenus, commandes, clients, produits)
  - Graphiques de revenus et commandes sur différentes périodes
  - Tableau des commandes récentes avec statuts
  - Alertes de stock faible
  - Graphique en camembert de la distribution par catégorie

- **Gestion des produits** : Opérations CRUD complètes pour le catalogue de produits
  - Liste des produits avec vue grille ou liste
  - Recherche et filtrage avancés
  - Ajout de nouveaux produits avec images multiples
  - Modification des produits existants
  - Suppression de produits
  - Gestion des tailles et prix associés
  - Gestion du stock et disponibilité

- **Gestion des commandes** : Suivi et gestion des commandes clients
  - Liste complète des commandes avec filtres par statut
  - Détails d'une commande avec timeline
  - Informations client et adresse de livraison
  - Détails de paiement
  - Mise à jour du statut des commandes
  - Export des données de commandes

- **Gestion des catégories** : Organisation des produits par catégories
  - Liste des catégories avec compteur de produits
  - Création de nouvelles catégories
  - Modification et suppression de catégories
  - Visualisation des produits par catégorie

- **Gestion des utilisateurs** : Visualisation et gestion des comptes clients
  - Liste des utilisateurs avec recherche
  - Filtrage par type de membre
  - Historique des commandes par utilisateur
  - Suivi de l'activité utilisateur
  - Détails du profil utilisateur

- **Analytics** : Analytics complets des ventes et performances
  - Tendances de revenus sur différentes périodes
  - Performance par catégorie
  - Produits les plus vendus
  - Métriques clients (nouveaux clients, clients actifs)
  - Graphiques interactifs avec Recharts

- **Notifications** : Notifications système en temps réel
  - Liste des notifications système
  - Marquage comme lues/non lues
  - Filtrage par type de notification
  - Notifications pour les commandes, stocks, etc.

- **Bibliothèque média** : Gestion des images et fichiers produits
  - Upload d'images pour les produits
  - Organisation des médias
  - Suppression et remplacement d'images

- **Paramètres** : Configuration des préférences de la boutique
  - Paramètres généraux de la boutique
  - Configuration de la boutique
  - Préférences de notifications
  - Paramètres de taxe et livraison
  - Configuration des paiements

### Design et expérience utilisateur

- **Thème sombre/clair** : Basculement de thème fluide
  - Sauvegarde de la préférence dans localStorage
  - Transition douce entre les thèmes
  - Interface adaptée à chaque thème

- **Design responsive** : Fonctionnel sur tous les appareils
  - Adaptation automatique pour mobile, tablette et desktop
  - Navigation optimisée pour chaque taille d'écran
  - Sidebar rétractable sur mobile

- **Animations fluides** : Animations gérées par Framer Motion
  - Transitions de page douces
  - Animations d'entrée/sortie des composants
  - Feedback visuel pour les interactions

- **Interface moderne** : Design avec accents en dégradé et interface épurée
  - Palette de couleurs cohérente
  - Typographie claire et lisible
  - Espacement et hiérarchie visuelle optimisés

- **Graphiques interactifs** : Utilisation de la bibliothèque Recharts
  - Graphiques de revenus et commandes
  - Graphiques en camembert pour les catégories
  - Graphiques en barres pour les produits
  - Interactivité au survol

## Stack technologique

### Framework et bibliothèques principales

- **React 19** - Dernières fonctionnalités React
  - Hooks modernes pour la gestion d'état
  - Composants fonctionnels
  - Performance optimisée

- **React Router v7** - Routage côté client
  - Navigation entre les pages sans rechargement
  - Routes protégées avec authentification
  - Paramètres dynamiques dans les URLs

- **Tailwind CSS v4** - Framework CSS utilitaire
  - Classes utilitaires pour un développement rapide
  - Configuration personnalisée
  - Support du dark mode
  - Design responsive intégré

- **Framer Motion** - Bibliothèque d'animations
  - Animations fluides et performantes
  - Transitions de page
  - Animations d'interaction

- **Recharts** - Bibliothèque de graphiques pour analytics
  - Graphiques de ligne pour les tendances
  - Graphiques en barres pour les comparaisons
  - Graphiques en camembert pour les distributions
  - Personnalisation avancée

- **Lucide React** - Ensemble d'icônes moderne
  - Icônes cohérentes dans toute l'application
  - Style uniforme
  - Grande variété d'icônes

- **Vite 7** - Outil de build rapide
  - Compilation ultra-rapide
  - Rechargement à chaud (HMR)
  - Optimisation pour la production

### Gestion des données

- **Axios** - Client HTTP pour les requêtes API
  - Configuration centralisée dans `lib/axios.js`
  - Intercepteurs pour l'authentification
  - Gestion des erreurs globales

- **React Query (TanStack Query)** - Gestion du cache et synchronisation
  - Cache automatique des données
  - Synchronisation en arrière-plan
  - Gestion optimiste des mises à jour
  - Refetch automatique

## Installation

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Accès à l'API backend (beutybackend)

### Étapes d'installation

1. Installer les dépendances :
```bash
npm install
```

Cette commande installe toutes les dépendances listées dans `package.json`.

2. Démarrer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:5173` (ou le port indiqué par Vite).

3. Construire pour la production :
```bash
npm run build
```

Génère une version optimisée dans le dossier `dist/`.

4. Prévisualiser la build de production :
```bash
npm run preview
```

5. Vérifier la qualité du code :
```bash
npm run lint
```

## Authentification

Le panneau d'administration inclut un système d'authentification. Pour accéder au tableau de bord :

1. Naviguer vers `/login`
2. Entrer un email et un mot de passe (actuellement utilise une authentification mock)
3. Cliquer sur "Se connecter"

**Note importante** : En production, implémenter une authentification backend appropriée avec JWT et gestion des rôles.

### Spécifications d'authentification

- Route de login : `/login`
- Protection de toutes les routes sauf `/login`
- Stockage du token JWT dans localStorage
- Redirection automatique vers le login si non authentifié
- Déconnexion avec nettoyage de la session

## Structure du projet

```
admin/
├── src/
│   ├── api/                    # Services API pour communiquer avec le backend
│   │   ├── authApi.js          # Authentification admin
│   │   ├── categoriesApi.js    # Gestion des catégories
│   │   ├── dashboardApi.js     # Données du tableau de bord
│   │   ├── notificationsApi.js # Notifications système
│   │   ├── ordersApi.js        # Gestion des commandes
│   │   ├── productsApi.js      # Gestion des produits
│   │   ├── usersApi.js         # Gestion des utilisateurs
│   │   └── index.js            # Export centralisé des APIs
│   ├── components/             # Composants réutilisables
│   │   ├── Layout/             # Composants de layout
│   │   │   ├── Sidebar.jsx    # Barre latérale de navigation
│   │   │   ├── Header.jsx      # En-tête avec actions
│   │   │   └── MainLayout.jsx  # Layout principal avec sidebar et header
│   │   └── Cards/              # Composants de cartes
│   │       └── StatCard.jsx    # Carte de statistique réutilisable
│   ├── context/                # Contextes React
│   │   └── ThemeContext.jsx    # Contexte pour la gestion du thème
│   ├── hooks/                  # Hooks React personnalisés
│   │   ├── useAuth.js          # Hook pour l'authentification
│   │   ├── useCategories.js    # Hook pour les catégories
│   │   ├── useDashboard.js    # Hook pour le tableau de bord
│   │   ├── useNotifications.js # Hook pour les notifications
│   │   ├── useOrders.js        # Hook pour les commandes
│   │   ├── useProducts.js      # Hook pour les produits
│   │   ├── useUsers.js         # Hook pour les utilisateurs
│   │   └── index.js            # Export centralisé des hooks
│   ├── lib/                    # Bibliothèques et configurations
│   │   ├── axios.js            # Configuration Axios avec intercepteurs
│   │   └── queryClient.js     # Configuration React Query
│   ├── pages/                  # Pages de l'application
│   │   ├── Login.jsx           # Page de connexion
│   │   ├── Dashboard.jsx       # Tableau de bord principal
│   │   ├── ProductsList.jsx   # Liste des produits
│   │   ├── AddProduct.jsx     # Formulaire d'ajout de produit
│   │   ├── ProductDetails.jsx # Détails d'un produit
│   │   ├── OrdersList.jsx     # Liste des commandes
│   │   ├── OrderDetails.jsx   # Détails d'une commande
│   │   ├── Categories.jsx     # Gestion des catégories
│   │   ├── Users.jsx          # Gestion des utilisateurs
│   │   ├── Analytics.jsx      # Page analytics
│   │   ├── Notifications.jsx  # Page des notifications
│   │   ├── Media.jsx          # Bibliothèque média (si implémentée)
│   │   └── Settings.jsx       # Page des paramètres
│   ├── App.jsx                 # Configuration des routes et providers
│   ├── App.css                 # Styles globaux de l'application
│   ├── main.jsx                # Point d'entrée de l'application
│   └── index.css               # Styles de base et configuration Tailwind
├── public/                     # Fichiers publics statiques
├── package.json                # Dépendances et scripts du projet
├── vite.config.js              # Configuration Vite
├── eslint.config.js            # Configuration ESLint
└── index.html                  # Template HTML principal
```

## Pages principales

### Tableau de bord (`/dashboard`)

Vue d'ensemble complète de la boutique avec métriques clés :

- **Cartes de métriques** : Revenus totaux, nombre de commandes, clients actifs, produits en stock
- **Graphiques de revenus et commandes** : Visualisation des tendances sur différentes périodes (jour, semaine, mois, année)
- **Tableau des commandes récentes** : Dernières commandes avec statut, client, montant
- **Alertes de stock faible** : Produits avec stock critique
- **Graphique en camembert de distribution par catégorie** : Répartition des ventes par catégorie

### Produits (`/products`)

Gestion complète du catalogue de produits :

- **Vue grille/liste** : Basculement entre vue grille et liste
- **Recherche et filtrage** : Recherche par nom, filtrage par catégorie, statut, stock
- **Actions rapides** : Édition, suppression, visualisation des détails
- **Ajout de produits** : Formulaire complet avec :
  - Informations de base (nom, description, catégorie)
  - Images multiples avec upload
  - Gestion des tailles avec prix associés
  - Gestion du stock par taille
  - Statut de disponibilité

### Commandes (`/orders`)

Suivi et gestion des commandes clients :

- **Liste complète** : Toutes les commandes avec filtres par statut (en attente, en cours, livrée, annulée)
- **Détails d'une commande** : Vue détaillée avec :
  - Timeline de suivi de la commande
  - Informations client complètes
  - Adresse de livraison
  - Détails des articles commandés
  - Détails de paiement (méthode, statut, montant)
  - Historique des changements de statut
- **Mise à jour du statut** : Modification du statut de commande avec notifications

### Analytics (`/analytics`)

Analytics complets des performances :

- **Tendances de revenus** : Graphiques de revenus sur différentes périodes
- **Performance par catégorie** : Comparaison des ventes par catégorie
- **Produits les plus vendus** : Top des produits avec quantités vendues
- **Métriques clients** : Nouveaux clients, clients actifs, taux de rétention
- **Filtres de période** : Sélection de la période d'analyse (jour, semaine, mois, année)

### Utilisateurs (`/users`)

Gestion des comptes clients :

- **Liste des utilisateurs** : Tous les clients avec recherche par nom, email
- **Filtrage par type de membre** : Filtrage par niveau de membre (standard, premium, etc.)
- **Historique des commandes par utilisateur** : Accès à l'historique complet d'un utilisateur
- **Suivi de l'activité** : Dernière connexion, nombre de commandes, montant total dépensé
- **Détails du profil** : Informations complètes du profil utilisateur

### Catégories (`/categories`)

Organisation des produits :

- **Cartes visuelles de catégories** : Affichage visuel avec image de catégorie
- **Compteur de produits** : Nombre de produits par catégorie
- **Gestion facile** : Création, modification, suppression de catégories
- **Visualisation des produits** : Accès rapide aux produits d'une catégorie

### Paramètres (`/settings`)

Configuration de la boutique :

- **Paramètres généraux** : Nom de la boutique, description, contact
- **Configuration de la boutique** : Devise, langue, fuseau horaire
- **Préférences de notifications** : Configuration des notifications système
- **Paramètres de taxe et livraison** : Taux de taxe, frais de livraison, zones de livraison
- **Configuration des paiements** : Méthodes de paiement acceptées

## Fonctionnalités à implémenter

Les fonctionnalités suivantes nécessitent une intégration backend complète :

- [ ] Authentification réelle avec JWT et gestion des rôles
- [ ] Intégration API pour toutes les opérations CRUD
- [ ] Upload d'images vers un stockage cloud (AWS S3, Cloudinary, etc.)
- [ ] Notifications en temps réel avec WebSocket
- [ ] Fonctionnalité d'export (CSV, PDF) pour les rapports
- [ ] Filtrage et tri avancés avec pagination
- [ ] Contrôle d'accès basé sur les rôles (RBAC)
- [ ] Journalisation des activités administrateur
- [ ] Notifications par email pour les événements importants
- [ ] Gestion avancée des stocks avec alertes automatiques
- [ ] Génération de rapports personnalisés
- [ ] Gestion des promotions et codes de réduction
- [ ] Gestion des avis et commentaires produits
- [ ] Support client intégré

## Configuration

### Personnalisation du thème

Le thème peut être basculé en utilisant l'icône soleil/lune dans l'en-tête. La préférence de thème est sauvegardée dans localStorage pour persister entre les sessions.

### Routes

Toutes les routes sont protégées et nécessitent une authentification, sauf `/login`. Voir `App.jsx` pour la structure complète du routage.

### Configuration de l'API

L'application communique avec le backend via l'API configurée dans `src/lib/axios.js`. 

- URL de base de l'API configurable
- Intercepteur de requête pour ajouter le token JWT automatiquement
- Intercepteur de réponse pour gérer les erreurs globales
- Gestion de l'expiration des tokens

## Guide de développement

### Structure des composants

1. **Structure des composants** : Maintenir les composants petits et focalisés
   - Un composant = une responsabilité
   - Réutilisabilité maximale
   - Props claires et documentées

2. **Gestion de l'état** : Utiliser React Context pour l'état global
   - ThemeContext pour le thème
   - État local avec useState pour les composants simples
   - État serveur géré par React Query

3. **Styling** : Utiliser les classes utilitaires Tailwind
   - Éviter les styles inline sauf pour les valeurs dynamiques
   - Utiliser les classes Tailwind pour le responsive
   - Maintenir la cohérence du design

4. **Animations** : Utiliser Framer Motion pour les transitions fluides
   - Transitions de page
   - Animations d'entrée/sortie
   - Feedback visuel pour les interactions

5. **Icônes** : Utiliser Lucide React pour une iconographie cohérente
   - Icônes uniformes dans toute l'application
   - Taille et style cohérents

### Bonnes pratiques

- Utiliser React Query pour toutes les requêtes API
- Gérer les erreurs de manière centralisée
- Valider les données avant soumission
- Fournir un feedback visuel pour toutes les actions utilisateur
- Optimiser les performances avec React.memo et useMemo quand nécessaire

## Déploiement

### Build de production

1. Construire le projet :
```bash
npm run build
```

2. Le dossier `dist/` contient la build de production optimisée

3. Déployer sur votre plateforme préférée :
   - **Vercel** : Déploiement automatique depuis Git
   - **Netlify** : Déploiement avec drag & drop ou Git
   - **AWS S3 + CloudFront** : Hébergement statique avec CDN
   - **DigitalOcean App Platform** : Déploiement simplifié
   - **Serveur web traditionnel** : Nginx ou Apache avec configuration appropriée

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :
```
VITE_API_URL=http://localhost:3000/api
```

Pour la production, utiliser l'URL de votre API backend.

## Licence

MIT License - Voir le fichier LICENSE pour plus de détails

## Contribution

Les contributions sont les bienvenues ! Veuillez suivre le style de code existant et les patterns de composants.

## Support

Pour les problèmes et questions, veuillez vous référer au dépôt principal Beauty in Black.

---

**Note** : Ce panneau d'administration est conçu pour fonctionner avec l'API backend Beauty in Black. Assurez-vous que le backend est en cours d'exécution et correctement configuré avant utilisation.
