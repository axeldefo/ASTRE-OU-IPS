
### README Front-End

# Frontend - Application de Prédiction de Spécialisation Étudiante

## Description
Ce projet est une application React utilisant **Vite** pour l'interface utilisateur, permettant de visualiser les prédictions des spécialités étudiantes. Elle communique avec le backend sur le port 5000.

## Prérequis
- **Node.js** version 16 ou supérieure
- **npm** (Node Package Manager)

## Installation

1. **Cloner le dépôt :**
   ```bash
   git clone <url_du_dépôt>
   cd <répertoire_du_projet>
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

## Lancer le projet

1. **Démarrer l'application React :**
   ```bash
   npm run dev
   ```
   
   Le serveur démarre sur le **port 5173** (modifiable dans le fichier `vite.config.js`).

## Communication avec le Backend
- L'application frontend se connecte au backend sur le **port 5000**.
- Si vous vouler modifier le port du backend, il faut modifier la configuration de l'API dans le frontend (`vite.config.js`).

## Notes importantes
- **Lancer d'abord le backend** avant de démarrer le frontend pour garantir la communication entre les deux parties de l'application.
