const express = require('express');
const router = express.Router();

const UnauthorizedError = require('../model/errors.js');

const CarritoRepository = require('../model/carritoRepository.js')
const carritosRepository = new CarritoRepository('./db/carritos.txt')

router.get('/:id', function(req, res, next) {
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
          console.log('Error getting carrito: ', err)
          res.send("Error" + err)
        })
});

router.post('/', function(req, res, next) {
  
  const carrito = {
    timestamp : Date.now(),
    productos : []
  }  
  
  carritosRepository.save(carrito)
  .then(id => carritosRepository.getById(id))
  .then(carrito_actualizado => res.send(carrito_actualizado))
    .catch(err => { 
      console.log('Error post carrito: ', err)
      res.send("Error" + err)
    
    })
});


router.get('/:id/productos', function(req, res, next) {
    const id = parseInt(req.params.id)
    carritosRepository.getById(id)
    .then(carrito => { 
      if (carrito){
        res.send(carrito.productos) 
      }
      else {
        res.status(404).send({error: 404, descripcion: `Carrito ${id} no encontrado`})
      }
    
    })
      .catch(err => 
        { 
          console.log('Error getting carrito: ', err)
          res.send("Error" + err)
        })

});

router.post('/:id/productos', function(req, res, next) {
    const id = parseInt(req.params.id)
    const id_producto = parseInt(req.body.id_producto)
    carritosRepository.addProduct(id, id_producto)
      .then( id=>  carritosRepository.getById(id))
      .then( carrito_actualizado => res.send(carrito_actualizado))
      .catch(err => 
        { 
          console.log('Error agregando producto carrito: ', err)
          res.send("Error" + err)
        })
});


router.delete('/:id', function(req, res, next) {
  const id = parseInt(req.params.id)
  carritosRepository.deleteById(id)
    .then( res.send(`Se borró exitosamente el carrito ${id}`))
    .catch(err => 
      { 
        console.log('Error agregando producto carrito: ', err)
        res.send("Error" + err)
      })
});


router.delete('/:id/productos/:id_producto', function(req, res, next) {
    const id = parseInt(req.params.id)
    const id_producto = parseInt(req.params.id_producto)
    carritosRepository.deleteProduct(id, id_producto)
      .then( res.send(`Se borró exitosamente el Producto ${id_producto} del carrito ${id}`))
      .catch(err => 
        { 
          console.log('Error agregando producto carrito: ', err)
          res.send("Error" + err)
        })
});

module.exports = router;