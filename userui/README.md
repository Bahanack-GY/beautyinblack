# Beauty in Black - Application E-commerce de Parfums

Application React de e-commerce spécialisée dans la vente de parfums. Développée avec React, Vite, Tailwind CSS et Framer Motion pour les animations.

## Démarrage du projet

### Prérequis

- Node.js 
- npm ou yarn

### Installation

1. Installer les dépendances du projet :
```bash
npm install
```

### Développement

Lancer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:5173` (ou le port indiqué par Vite).

### Construction pour la production

Construire l'application pour la production :
```bash
npm run build
```

### Prévisualisation de la build de production

Prévisualiser la build de production :
```bash
npm run preview
```

## Routes de l'application

### Routes implémentées

- **`/`** - Page d'accueil
  - Affiche une vidéo de fond avec animation de texte
  - Liste des produits parfums avec fonctionnalités de recherche et filtrage par catégorie
  - Filtres disponibles : Tout, Homme, Femme, Enfant

- **`/decouvrir`** - Page de découverte
  - Page simple présentant les collections et nouveautés

- **`/favoris`** - Page des favoris (Wish List)
  - Affiche la liste des parfums ajoutés aux favoris
  - Possibilité d'ajouter les favoris au panier

- **`/cart`** - Page du panier
  - Gestion complète du panier d'achat
  - Modification des quantités et suppression d'articles
  - Calcul automatique des totaux (sous-total, livraison, total)
  - Utilisation de localStorage pour la persistance des données

- **`/product/:id`** - Page de détails produit
  - Affichage détaillé d'un parfum
  - Carrousel d'images
  - Sélection de taille
  - Sections pliables pour la description et les informations de livraison
  - Ajout au panier avec sélection de taille obligatoire
  - Bouton favori

- **`/notifications`** - Page des notifications
  - Page simple pour afficher les notifications et alertes

- **`/utilisateur`** - Page du profil utilisateur
  - Affichage des informations personnelles
  - Coordonnées (email, téléphone)
  - Sections cliquables : Modifier mon profil, Mes commandes, Adresse, Mes favoris
  - Navigation vers la page des favoris

### Routes à implémenter

Les pages suivantes sont encore à développer :

- **`/signin`** - Page de connexion
- **`/signup`** - Page d'inscription
- **`/address`** - Page de gestion des adresses
- **`/mes-commandes`** - Page de l'historique des commandes
- **`/checkout`** - Page de finalisation de commande
- **`/remerciement`** - Page de confirmation de commande

## Technologies utilisées

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Framer Motion
- React Icons

## Fonctionnalités principales

- Navigation fluide entre les pages
- Recherche et filtrage de produits
- Gestion du panier avec persistance localStorage
- Ajout de produits au panier avec sélection de taille
- Interface responsive et animations fluides
- Thème rose cohérent dans toute l'application

## Structure du projet

```
userui/
├── src/
│   ├── components/     # Composants réutilisables
│   │   ├── Header.jsx
│   │   ├── Navbar.jsx
│   │   ├── Video.jsx
│   │   ├── Product-card.jsx
│   │   └── Body-content.jsx
│   ├── pages/          # Pages de l'application
│   │   ├── Home.jsx
│   │   ├── Decouvrir.jsx
│   │   ├── Favoris.jsx
│   │   ├── Cart.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Notifications.jsx
│   │   └── Utilisateur.jsx
│   ├── assets/         # Ressources statiques
│   ├── App.jsx         # Configuration des routes
│   └── main.jsx        # Point d'entrée
└── package.json
```

## Notes de développement

- Le panier utilise localStorage pour la persistance des données
- Les données produites sont actuellement codées en dur
- Les animations sont gérées par Framer Motion
- Le thème de couleur principal est le rose (#B76E79) 
