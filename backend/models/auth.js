//Importer mongoose
const mongoose = require('mongoose');
//Importer le validateur mongoose
const uniqueValidator = require('mongoose-unique-validator');

//Créer un schéma d'authentification avec la fonction Schema
const authSchema = mongoose.Schema({
    //Information utilisateurs
    //unique: true = impossible pour l'utilisateur de se s'inscrire plusieurs fois avec la même adresse mail
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//On appelle la méthode plugin avec l'argument uniqueValidator
authSchema.plugin(uniqueValidator);

//Exporter le schéma sous forme de model
module.exports = mongoose.model('auth', authSchema);