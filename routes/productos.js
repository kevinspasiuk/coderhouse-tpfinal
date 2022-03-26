const express = require('express');
const router = express.Router();
const auth = require('../utils/authenticate.js')
const authAdmin = require('../utils/authenticateAdmin.js')

const ProductoRepository = require('../model/repositories/productoRepository.js')
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

router.get('/', auth, function(req, res, next) {

  productosRepository.getAll()
    .then(productos => { res.send(productos) })
    .catch(err => 
      { 
        logger.error('Error getting productos: ', err)
        res.send("Error" + err)
      })
})

router.get('/:id', auth, function(req, res, next) {
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
        logger.error('Error getting productos: ', err)
        res.send("Error" + err)
      })
});

router.post('/', authAdmin, function(req, res, next) {
  const auth = req.headers.authorize

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
          logger.error('Error post productos: ', err)
          res.send("Error" + err)
        })
  }
  catch {
    res.status(400).send({error: 400, descripcion: "Faltan campos en producto"})
  }

});

router.put('/:id', authAdmin, async function(req, res, next) {
  const auth = req.headers.authorize

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
      logger.error('Error delete producto: ', err)
      res.send("Error" + err)
    }

  }
  catch {
    res.status(400).send({error: 400, descripcion: "Faltan campos en producto"})
  }
  
});

router.delete('/:id', authAdmin,  function(req, res, next) {
 
  const id = parseInt(req.params.id)
  productosRepository.deleteById(id)
    .then( res.send({descripcion: `Borrado ${id} exitoso`}) )
    .catch(err => { 
      logger.error('Error delete producto: ', err)
      res.send("Error" + err)
    })
});

module.exports = router;
