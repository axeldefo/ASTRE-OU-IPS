# Application de Prédiction de Spécialisation IPS OU ASTRE

Ce projet a pour objectif de prédire la spécialisation d'un étudiant en fonction de certaines hypothèses et données. 

## Structure du Projet

1. **Répertoire Python** : Cette partie contient le travail initial réalisé en Python, où l'algorithme a été développé avant de passer à une version web. Bien que cette section soit fonctionnelle, elle n'est pas essentielle pour l'application finale.
   
2. **Répertoire IOA Back** : Ce répertoire contient l'API backend réalisée avec **Express.js**. Il permet de prédire la spécialisation d'étudiants en fonction de différentes hypothèses et de leurs scores. Le backend utilise des fichiers CSV qui contiennent des informations sur les étudiants.
   
3. **Répertoire IOA Front** : Le frontend de l'application est réalisé en **React**. Il permet de visualiser les prédictions faites par l'API backend. Ce répertoire inclut un README détaillant comment installer et lancer l'application frontend.

### Installation

1. **Installer les dépendances backend** :
    - Rendez-vous dans le répertoire `ioa_ack`.
    - Suivez les explications du readme.

2. **Installer les dépendances frontend** :
    - Rendez-vous dans le répertoire `ioa_ront`.
    - Suivez les explications du readme..

### Dépendances Utilisées

- **Backend** : 
  - Express.js
  - papaparse
- **Frontend** : 
  - React (créé avec Vite)
  - Bibliothèque `shadcn.ui` 

### Remarque

- **Lancer le Backend en premier** : Pour que l'application frontend puisse communiquer correctement avec l'API backend, le backend doit être lancé avant le frontend.

