const multer = require('multer');
const path = require('path');

// Configuration pour multer (gestion des uploads de fichiers)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, 'new.csv'); // Vous pouvez renommer le fichier ici
  }
});

const upload = multer({ storage: storage });

// Middleware pour l'upload du fichier CSV
function uploadFile(req, res) {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de l\'upload.' });
    }
    res.status(200).json({ message: 'Fichier uploadé avec succès.' });
  });
}

module.exports = { uploadFile };
