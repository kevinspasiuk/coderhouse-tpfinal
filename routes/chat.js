const express = require('express');
const router = express.Router();

const MensajeRepository = require('../model/repositories/mensajeRepository.js')
const mensajeRepository = new MensajeRepository

router.get('/', function(req, res, next) {
    res.render('index.hbs')
});

router.get('/:user', async function(req, res, next) {
    const user = req.params.user
    const mensajes = await mensajeRepository.getByUsername(user)
    res.send(
        {
            user: user,
            mensajes: mensajes
        }
     )
});
  
module.exports = router;