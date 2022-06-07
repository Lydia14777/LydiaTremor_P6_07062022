//Importer bcrypt
const bcrypt = require('bcrypt');

//Importer jsonwebtoken
const jwt = require('jsonwebtoken');

////Importer le model auth
const auth = require('../models/auth');

//La fonction ou la méthode signup pour l'enregistrement des utilisateurs
exports.signup = (req, res, next) => {
    //Hasher le MDP avec la fonction asynchrone : bcrypt crée un hash
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new auth({
        email: req.body.email,
        password: hash
      });
      //Enregistrer l'utilisateur dans la BDD
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

//La fonction ou la méthode signup pour connecter des utilisateurs existant
exports.login = (req, res, next) => {
    //Trouver l'utilisateur dans la BDD grâce à l'email unique
    auth.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      //La fonction compare pour comparer le MDP envoyé par l'utilisateur lors de la connection avec le hash
      bcrypt.compare(req.body.password, user.password)
        //On vérifie s'il y a un user
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            //Appel la fonction sign de jsonwebtoken
            token: jwt.sign(
                //Données que l'on veut encoder dans le premier argument
                { userId: user._id },
                //2ème argument : la clé secrète pour l'encodage
                'RANDOM_TOKEN_SECRET',
                //Argument de configuration : expiration au bout de 24h
                { expiresIn: '24h' }
              )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    //S'il y a un problème de connection (erreur serveur)
    .catch(error => res.status(500).json({ error }));
};