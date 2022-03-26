const express = require('express');
const router = express.Router();
const logger = require('../utils/logger.js');
const auth = require('../utils/authenticate.js')

const CarritoFactory = require('../model/factories/carritoFactory.js');
const carritoFactory = new CarritoFactory

const CarritoRepository = require('../model/repositories/carritoRepository.js')
const carritosRepository = new CarritoRepository()

const ProductoRepository = require('../model/repositories/productoRepository.js')
const productoRepository = new ProductoRepository()

router.get('/:id', auth, function(req, res, next) {
    const id = parseInt(req.params.id)
    carritosRepository.getById(id)
      .then(carrito => { 
        if (carrito){
          res.send(carrito) 
        }
        else {
          res.status(404).send({error: 404, descripcion: `Carrito ${id} no encontrado`})
        }
      
      })
      .catch(err => 
        { 
          logger.error('Error getting carrito: ', err)
          res.send("Error" + err)
        })
});

router.post('/', auth, function(req, res, next) {
  
  const data = {
      user: 1, 
      direccionEntrega: ''
    }
  
  const carrito = carritoFactory.nuevo_carrito(data)  
  carritosRepository.save(carrito)
  .then(id => carritosRepository.getById(id))
  .then(carrito_actualizado => res.send(carritoFactory.to_json(carrito_actualizado)))
    .catch(err => { 
      logger.error('Error post carrito: ', err)
      res.send("Error" + err)
    
    })
});


router.get('/:id/productos', auth, function(req, res, next) {
    const id = parseInt(req.params.id)
    carritosRepository.getById(id)
    .then(carrito => { 
      if (carrito){
        res.send(carrito.items) 
      }
      else {
        res.status(404).send({error: 404, descripcion: `Carrito ${id} no encontrado`})
      }
    
    })
      .catch(err => 
        { 
          logger.error('Error getting carrito: ', err)
          res.send("Error" + err)
        })

});

router.post('/:id/productos', auth,  async function(req, res, next) {
    const id = parseInt(req.params.id)
    const id_producto = parseInt(req.body.id_producto)
    try {
      const carrito = await carritosRepository.getById(id)
      const producto = await productoRepository.getById(id_producto)
      carrito.agregar_producto(producto)

      await carritosRepository.update(carrito)

      const carritoActualizado = await carritosRepository.getById(id)

      res.send(carritoFactory.to_json(carritoActualizado))
    } catch(err) { 
      logger.error('Error agregando producto carrito: ', err)
      res.send("Error" + err)
    }
});


router.delete('/:id', auth, function(req, res, next) {
  const id = parseInt(req.params.id)
  carritosRepository.deleteById(id)
    .then( res.send({ mensaje: `Se borró exitosamente el carrito ${id}`}))
    .catch(err => 
      { 
        logger.error('Error agregando producto carrito: ', err)
        res.send("Error" + err)
      })
});


router.delete('/:id/productos/:id_producto', auth, async function(req, res, next) {
    const id = parseInt(req.params.id)
    const id_producto = parseInt(req.params.id_producto)
    
    try{

      carritosRepository.deleteProduct(id, id_producto)

      const carrito = await carritosRepository.getById(id)
      const producto = await productoRepository.getById(id_producto)
      carrito.borrar_producto(producto)
      await carritosRepository.update(carrito)

      const carritoActualizado = await carritosRepository.getById(id)

      res.send(carritoFactory.to_json(carritoActualizado))
    } catch(err) { 
      logger.error('Error borrando producto en carrito: ', err)
      res.send("Error" + err)
    }
});

module.exports = router;
