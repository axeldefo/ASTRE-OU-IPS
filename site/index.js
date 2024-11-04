const express = require('express');
const cors = require('cors');
const apiRoutes = require('./route/api');
const path = require('path');
var helmet = require('helmet');

const app = express();
app.use(helmet());

// Middleware
app.use(cors( { origin: 'http://localhost:5173'} ));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Servir les fichiers statiques (React)
app.use(express.static(path.join(__dirname, 'client/build')));

// Route pour servir React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Le serveur tourne sur le port ${port}`);
});
