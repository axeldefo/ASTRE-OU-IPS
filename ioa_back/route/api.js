const express = require('express');
const router = express.Router();
const { processCsvData } = require('../calcul/calcul');
const { processCsvDataValidateur } = require('../calcul/validateur');

// Route pour traiter le CSV et faire les prédictions
router.post('/predict', processCsvData);

router.post('/test', processCsvDataValidateur);

module.exports = router;
