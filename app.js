var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

var productosRouter = require('./routes/productos');
var carritosRouter = require('./routes/carritos');

var app = express();
const port = process.env.port || 8080

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/productos', productosRouter);
app.use('/api/carrito', carritosRouter);



const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

server.on('error', error => console.log('Error on server: ', error))

// error handler

app.use((error, req, res, next) => {
  console.log("Error Handling")
  console.log('Path: ', req.path)
  console.error('Error: ', error)

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
  res.status(404).send({
    error : 404, 
    descripcion: mensaje 
  });
});