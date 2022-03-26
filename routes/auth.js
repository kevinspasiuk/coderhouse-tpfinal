const express = require('express');
const router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

const Mailer = require('../utils/mailer.js');
const mailer = new Mailer;

const logger = require('../utils/logger.js')
const UserRepository = require('../model/repositories/userRepository.js')
const usuarios = new UserRepository

const UserFactory = require('../model/factories/userFactory.js')
const userFactory = new UserFactory

// CONFIG PASSPORT

passport.use('register', new LocalStrategy({
    passReqToCallback: true
  }, async (req, username, password, done) => {

    let usuario = await usuarios.getByUsername(username)

    if (usuario) {
      return done(null, false, req.flash('mensaje', 'Usuario ya registrado'))

    } else {

      if (password != req.body.passwordRepetida) { 
        return done(null, false, req.flash('mensaje','Las contraseñas no coinciden'))
      }

      if (!req.body.direccion || !req.body.telefono ) {
        return done(null, false, req.flash('mensaje','Datos faltantes'))
      }

      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHasheada = crypto.pbkdf2Sync(password, salt, 
        1000, 64, `sha512`).toString(`hex`);
      
      usuario = {
        user: username,
        password: passwordHasheada,
        salt: salt,
        role: '',
        direccion: req.body.direccion, 
        telefono: req.body.telefono,
        nombre: req.body.nombre
      }

      try {
        userFactory.validar(usuario)
      } catch (err) {
        return done(null, false, req.flash('mensaje', err.message))
      }

      usuarios.save( usuario )

    }
    
    return done(null, usuario)
}));

passport.use('login', new LocalStrategy({
  passReqToCallback: true
}, async (req, username, password, done) => {

  const user = await usuarios.getByUsername(username)

  if (!user) {
    return done(null, false)
  }

  const passwordIngresada = crypto.pbkdf2Sync(password, 
    user.salt, 1000, 64, `sha512`).toString(`hex`);
  
  if (user.password != passwordIngresada) {
    return done(null, false)
  }

  req.session.userId = user.id
  req.session.userRol = user.role

  return done(null, user);
}));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


router.post('/register', passport.authenticate('register', {
  successRedirect : '/auth/register/success', 
  failureRedirect : '/auth/register/failure' 
}));

router.get('/register/success', async function(req, res) {
  await mailer.notificar_admin_registro(req.session.passport.user)
  res.status(201)
  res.json({ message: 'Usuario registrado existosamente' });
});

router.get('/register/failure', function(req, res) {
  const mensaje = req.flash('mensaje')[0] || 'Username o password vacíos'
  res.status(403)
  res.json({ message: mensaje });
});
     
router.post('/login', passport.authenticate('login', {
  successRedirect : '/auth/login/success', 
  failureRedirect : '/auth/login/failure' 
}));

router.get('/login/success', function(req, res) {
  res.status(200)
  res.json({ message: 'Login existoso' });
});

router.get('/login/failure', function(req, res) {
  res.status(403)
  res.json({ message: 'Error login, credenciales inválidas' });
});
    
module.exports = router;