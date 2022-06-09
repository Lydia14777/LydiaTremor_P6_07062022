//Importer le package multer
const multer = require('multer');

//Création d'un dictionnaire de mime types
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

//Objet de configuration pour multer
//diskStorage : fonction de multer pour l'enregistrer sur le disque
const storage = multer.diskStorage({
    //Dans quel dossier enregistrer le fichier
    destination: (req, file, callback) => {
        //images : nom du dossier
        callback(null, 'images');
    },
    //Quel nom de fichier
    filename: (req, file, callback) => {
        //Nouveau nom du fichier (espace, underscore...)
        const name = file.originalname.split(' ').join('_');
        //minetype pour générer l'extension du fichier
        const extension = MIME_TYPES[file.mimetype];
        //Appel du callback avec comme arguments : null=pas d'erreur, filename entier=name créer au-dessus + une date et heure de création + . + extension du fichier
        callback(null, Date.now() + name /* + '.' + extension */);
    }
});

//Exporter le middleware multer-config
//single = signifie que l'on appelle un fichier unique
module.exports = multer({storage: storage}).single('image');