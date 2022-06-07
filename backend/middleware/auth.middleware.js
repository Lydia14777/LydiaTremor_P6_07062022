//Importer le package jsonwebtoken
const jwt = require('jsonwebtoken');

//Exporter un middleware
module.exports = (req, res, next) => {
  try {
    //Récupérer le token authorization dans le header
    //[1] : pour récupérer le 2ème élément du tableau
    const token = req.headers.authorization.split(' ')[1];
    //Décoder le token avec le package jsonwebtoken et la fonction verify
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //Récupérer le userId
    const userId = decodedToken.userId;
    //Vérifier que le userId correspond au token
    if (req.body.userId && req.body.userId !== userId) {
        //throw : pour renvoyer une erreur
        throw 'Invalid user ID';
    } 
    else {
        //Passer à la suite
        next();
    }
  } 
  catch {
    //Renvoit une erreur d'authentification 401
    res.status(401).json({
        error: new Error('Invalid request!')
    });
  }
};