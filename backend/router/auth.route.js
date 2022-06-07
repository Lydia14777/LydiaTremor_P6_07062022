//Importer express
const express = require('express');
//Importer la fonction Router d'express
const router = express.Router();

//Le controller pour associées les fonctions aux différentes routes
const authCtrl = require('../controllers/auth.controller');

//Les routes
router.post('/signup', authCtrl.signup);
router.post('/login', authCtrl.login);

//Exporter le router de auth
module.exports = router;