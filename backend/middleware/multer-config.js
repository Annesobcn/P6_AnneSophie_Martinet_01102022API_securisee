const multer = require("multer");

//Utilisation de MULTER pour télécharger et manipuler les images
//Formats acceptés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

//Récupération du fichier image, y enlever tout éventuel espace
// et lui donner un URL avec le nom de fichier original et la date
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split("").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");
