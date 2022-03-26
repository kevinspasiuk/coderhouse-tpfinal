const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('./utils/logger.js')
var passport = require('passport');
var session = require('express-session');
const MongoStore = require('connect-mongo');
const http = require('http');
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
var flash = require('connect-flash');

// import routers
const productosRouter = require('./routes/productos');
const carritosRouter = require('./routes/carritos');
const authRouter = require('./routes/auth');
const ordenesRouter = require('./routes/orders');
const chatRouter = require('./routes/chat');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080
const serverHttp = http.createServer(app);


// view engine setup
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'index.hbs'
}))

app.use(express.static('public'))
app.set('views', './views')


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

// TODO: pasar a secrets
app.use(session({
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_DB_URL,
    mongoOptions: advancedOptions
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: parseInt(process.env.COOKIE_MAX_AGE)
  }
}));

// routes
const chat = require('./routes/chatWs')(serverHttp); 
app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritosRouter);
app.use('/auth', authRouter);
app.use('/api/ordenes', ordenesRouter);
app.use('/chat', chatRouter);


app.use(passport.initialize());
app.use(passport.session());

// start server
const server = serverHttp.listen(port, () => {
  logger.info(`Servidor express escuchando en localhost:${port}`)
})


// error handler
server.on('error', error => logger.error('Error en server: ', error))

app.use((error, req, res, next) => {
  logger.error('Path: ', req.path, ' Error: ', error)

  if (error.name == "UnauthorizedError") {
    const mensaje = `Ruta ${req.path} con metodo ${req.method} no autorizado`
    res.status(401).send({
      error: 401,
      descripcion: mensaje
    })
  }

  res.status(500).send({ error: 500, descripcion: `Internal Server Error` })
})

//404 error
app.use(function (req, res) {
  const mensaje = `Ruta ${req.path} con metodo ${req.method} no implementado`

  logger.warn(mensaje)

  res.status(404).send({
    error: 404,
    descripcion: mensaje
  });
});