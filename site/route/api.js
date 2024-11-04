const express = require('express');
const router = express.Router();
const { uploadFile } = require('../upload/upload');
const { processCsvData } = require('../calcul/calcul');

// Route pour l'upload de fichier CSV
router.post('/upload', uploadFile);

// Route pour traiter le CSV et faire les prédictions
router.post('/predict', processCsvData);

module.exports = router;
