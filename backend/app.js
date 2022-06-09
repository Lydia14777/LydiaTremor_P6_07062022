//App contient l'application express

//Importer express : framework standard pour le développement de serveur
//Une infrastructure d'applications Web Node.js minimaliste et flexible qui fournit un ensemble de fonctionnalités robuste pour les applications Web et mobiles
const express = require('express');

//Importer body parser : lire les données HTTP POST
//Un morceau de middleware express qui lit l'entrée d'un formulaire et le stocke en tant qu'objet javascript accessible par l'intermédiaire de req.body
const bodyParser = require('body-parser');

//Importer mongoose (un package qui facilite les interactions avec notre base de données MongoDB)
const mongoose = require('mongoose');

//Importer le package path de node : donne accès au chemin du système de fichier
const path = require('path');
const cors = require('cors');

//Importer helmet : aide à sécuriser vos applications Express en définissant divers en-têtes HTTP
const helmet = require('helmet');

//Importer cookie-session : créer, lire et supprimer des cookies
//Les cookies permettent de conserver des informations envoyées par l’utilisateur et donc de pouvoir s’en resservir
//un petit fichier qui ne contient généralement qu’une seule donnée et qui va être stocké directement dans le navigateur d’un utilisateur
const session = require('cookie-session');

//Importer nocache : Indique de renvoyer systématiquement la requête au serveur et ne servir une éventuelle version en cache que dans le cas où le serveur le demande
const nocache = require('nocache');

//Importer le router des sauces
const sauceRoute = require('./router/sauce.route');

//Importer le router des authentification
const authRoute = require('./router/auth.route');
const authMiddleware = require('./middleware/auth.middleware');

//Importer dotenv : masquer les informations de connexion 
//Dotenv est un module sans dépendance qui charge les variables d'environnement d'un fichier .env dans process.env
const dotEnv = require('dotenv');
dotEnv.config({path:'./config/.env'});

//Connecter l'API au cluster MongoDB
mongoose.connect(`mongodb+srv://${process.env.ID}:${process.env.MDP}@${process.env.ADDRESS}.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Appeler la méthode express
const app = express();

//Ajouter des en-têtes ou Header à l'objet res (cors :système de sécurité qui, par défaut, bloque les appels HTTP entre des serveurs différents, ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles)


const cors_options = {
  'origin' : '*',
  'credentials' : true,
  'optionsSuccessStatus' : 200,
  'allowedHeaders' : ['sessionId', 'Content-Type', 'X-Requested-With', 'Content', 'Accept', 'Authorization'],
  'exposedHeaders' : ['sessionId'],
  'methods' : 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  'preflightContinue' : false
};

app.use(cors(cors_options));
/*app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//* = l'origine c'est tous les utilisateurs
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
*/

//La fonction app.use() est utilisée pour monter la fonction middleware helmet
app.use(helmet());

//Désactive la mise en cache du navigateur
app.use(nocache());

//Ce middleware intercepte toutes les requêtes qui ont un content-type json et met à disposition ce contenu sur l'objet req dans req.body
//D'autre utilise body parse qui fait la même chose
app.use(bodyParser.json());

// Middleware qui permet de parser les requêtes envoyées par le client, on peut y accéder grâce à req.body
app.use(bodyParser.urlencoded({
  extended: true
}));

// Options pour sécuriser les cookies
const expiryDate = new Date(Date.now() + 3600000); // 1 heure (60 * 60 * 1000)
app.use(session({
  name: 'session',
  secret: process.env.SEC_SES,
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000',
    expires: expiryDate
  }
}));

//Middleware qui répond aux requête envoyées par /images
//dirname : nom du dossier où on se trouve
app.use('/images', express.static(path.join(__dirname, 'images')));

//Enregister les route des authentification
app.use('/api/auth', authRoute);

//Enregister les route des sauces
app.use('/api/sauces', authMiddleware, sauceRoute);



//Exporter l'application
module.exports = app;