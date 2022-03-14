const express = require('express');
const router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');

const logger = require('../utils/logger.js')
const UserRepository = require('../model/userRepository.js')
const usuarios = new UserRepository

// CONFIG PASSPORT

passport.use('register', new LocalStrategy({
    passReqToCallback: true
  }, async (req, username, password, done) => {

    const usuario = await usuarios.getByUsername(username)

    if (usuario) {
      return done(null, false)

    } else {
      const salt = crypto.randomBytes(16).toString('hex');
      const passwordHasheada = crypto.pbkdf2Sync(password, salt, 
        1000, 64, `sha512`).toString(`hex`);
        usuarios.save( {user: username, password: passwordHasheada, salt: salt} )
        
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

router.get('/register/success', function(req, res) {
  res.status(201)
  res.json({ message: 'Usuario registrado existosamente' });
});

router.get('/register/failure', function(req, res) {
  res.status(403)
  res.json({ message: 'Usuario ya registrado' });
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