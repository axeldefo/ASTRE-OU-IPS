### README Back-End

# Backend - Prédiction de Spécialisation Étudiante

## Description
Ce projet est une application Express qui fournit des API pour prédire la spécialisation des étudiants de 3e année et tester les prédictions sur des étudiants de 5e année. Les prédictions sont basées sur des fichiers CSV d'étudiants.

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

3. **Structure des fichiers :**
   ```
   ├── index.js
   ├── uploads/
   │   ├── etudiants_3A.csv
   │   └── etudiants_5A.csv
   └── routes/
   ```

## Lancer le projet

1. **Démarrer le serveur :**
   ```bash
   node index.js
   ```
   
   Le serveur Express démarre sur le **port 5000** modifiable dans le fichier `index.js`.

## Routes disponibles
- Entête des requêttes: 
    ```
    Content-Type :application/json
    ```
- corps des requêttes: 
    ```
    {
        "weightsIPS": [3, 5, 4, 3],\n
        "importanceIPS": [4, 2, 3, 5],
        "weightsAstre": [4, 5, 5, 3, 3, 5],
        "importanceAstre": [3, 5, 5, 3, 4, 3],
    }
    ```
1. **/predict** (POST) : 
   - Prédit la spécialisation des étudiants de 3e année.
   - Données d'entrée : Aucune donnée d'entrée requise, utilise le fichier `etudiants_3A.csv`.
   - Visualisable sur le front via HighCharts.
   
2. **/test** (POST) :
   - Teste l'algorithme sur les étudiants de 5e année.
   - Données d'entrée : Aucune donnée d'entrée requise, utilise le fichier `etudiants_5A.csv`.
   - Disponible uniquement via appel d'API Rest (réponses au format JSON.)

## Utilisation
- Lancer le backend avant de lancer le frontend pour permettre la communication entre les deux.
