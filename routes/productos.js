const express = require('express');
const router = express.Router();

const UnauthorizedError = require('../model/errors.js');

const ProductoRepository = require('../model/productoRepository.js')
const productosRepository = new ProductoRepository


// Validación Producto

function validarProducto(producto) {
  if (
    !('nombre' in producto) ||
    !('descripcion' in producto) ||
    !('codigo' in producto) ||
    !('foto' in producto) ||
    !('precio' in producto) ||
    !('stock' in producto) 
  ) {
    throw new Error("Campos Faltantes")
  }
}

//Rutas

router.get('/', function(req, res, next) {

  productosRepository.getAll()
    .then(productos => { res.send(productos) })
    .catch(err => 
      { 
        console.log('Error getting productos: ', err)
        res.send("Error" + err)
      })
})

router.get('/:id', function(req, res, next) {
  const id = parseInt(req.params.id)
  productosRepository.getById(id)
    .then(producto => { 
      if (producto){  
        res.send(producto)
      }
      else {
        res.status(404).send({error: 404, descripcion: `Producto ${id} no encontrado`})
      }
    })
    .catch(err => 
      { 
        console.log('Error getting productos: ', err)
        res.send("Error" + err)
      })
});

router.post('/', function(req, res, next) {
  const auth = req.headers.authorize

  if ( auth != "admin") {
    throw new UnauthorizedError
  }

  try {
    validarProducto(req.body)
    const producto = req.body 
    producto.timestamp = Date.now()
    productosRepository.save(producto)
      .then( id => {

        productosRepository.getById(id).then( producto => res.send(producto))

      })
      .catch(err => 
        { 
          console.log('Error post productos: ', err)
          res.send("Error" + err)
        })
  }
  catch {
    res.status(400).send({error: 400, descripcion: "Faltan campos en producto"})
  }

});

router.put('/:id', async function(req, res, next) {
  const auth = req.headers.authorize

  if ( auth != "admin") {
    throw new UnauthorizedError
  }

  try {
    validarProducto(req.body)
    const id = parseInt(req.params.id)
    const producto = req.body 
    producto.timestamp = Date.now()

    try{
      await productosRepository.updateById(id, producto)
      const productoAct = await productosRepository.getById(id)
      res.send(productoAct)
    } catch (err) {
      console.log('Error delete producto: ', err)
      res.send("Error" + err)
    }

  }
  catch {
    res.status(400).send({error: 400, descripcion: "Faltan campos en producto"})
  }
  
});

router.delete('/:id', function(req, res, next) {
  const auth = req.headers.authorize

  if ( auth != "admin") {
    throw new UnauthorizedError
  }

  const id = parseInt(req.params.id)
  productosRepository.deleteById(id)
    .then( res.send({descripcion: `Borrado ${id} exitoso`}) )
    .catch(err => { 
      console.log('Error delete producto: ', err)
      res.send("Error" + err)
    })
});

module.exports = router;
