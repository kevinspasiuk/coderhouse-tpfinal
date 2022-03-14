const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger.js')
var passport = require('passport');
var session = require('express-session');
const MongoStore = require('connect-mongo');
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true};

// import routers
const productosRouter = require('./routes/productos');
const carritosRouter = require('./routes/carritos');
const authRouter = require('./routes/auth');

const app = express();
const port = process.env.port || 8080

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// TODO: pasar a secrets
app.use(session({
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://admin:admin@clusterkevin.uq0gf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    mongoOptions: advancedOptions    
  }),
  secret: 'shhhhhhhhhhhhhhhhhhhhh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000
  }
}));

// routes
app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritosRouter);
app.use('/auth', authRouter);


app.use(passport.initialize());
app.use(passport.session());

// start server
const server = app.listen(port, () => {
  logger.info(`Servidor express escuchando en localhost:${port}`)
})

server.on('error', error => logger.error('Error en server: ', error))

// error handler
app.use((error, req, res, next) => {
  logger.error('Path: ', req.path, ' Error: ', error)

  if (error.name == "UnauthorizedError") {
    const mensaje = `Ruta ${req.path} con metodo ${req.method} no autorizado`
    res.status(401).send({ 
      error : 401, 
      descripcion: mensaje
    })
  }
  
  res.status(500).send({ error : 500, descripcion: `Internal Server Error`})
})

//404 error
app.use(function(req,res){
  const mensaje = `Ruta ${req.path} con metodo ${req.method} no implementado`
  
  logger.warn(mensaje)

  res.status(404).send({
    error : 404, 
    descripcion: mensaje 
  });
});