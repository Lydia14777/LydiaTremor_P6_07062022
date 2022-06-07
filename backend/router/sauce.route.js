//Importer express
const express = require('express');

//Importer la méthode Router d'express pour importer les routes
const router = express.Router();

//Importer multer
const multer = require('../middleware/multer-config');

//Importer le fichier sauce.controller.js
const sauceCtrl = require('../controllers/sauce.controller');


//POST : Envoyer des objets
router.post('/', multer, sauceCtrl.createSauce);

//POST : Définit le statut « Like » pour l'userId fourni
//Si like = 1, l'utilisateur aime (= like) la sauce
//Si like = 0, l'utilisateur annule son like ou son dislike
//Si like = -1, l'utilisateur n'aime pas (=dislike) la sauce
router.post('/:id/like', sauceCtrl.likeSauce);

//GET : Récupérer toutes les sauces 
router.get('/', sauceCtrl.getAllSauce);

//GET : Récupérer une sauce spécifique
router.get('/:id', sauceCtrl.getOneSauce);

//PUT : Modifier une sauce existante
router.put('/:id', multer, sauceCtrl.modifySauce);

//DELETE : Supprimer une sauce 
router.delete('/:id', sauceCtrl.deleteSauce);

//Exporter le model de ce fichier
module.exports = router;