const express = require('express');
const router = express.Router();
const logger = require('../utils/logger.js');
const Mailer = require('../utils/mailer.js');
const mailer = new Mailer;
const auth = require('../utils/authenticate.js')

const OrdenFactory = require('../model/factories/ordenFactory.js');
const ordenFactory = new OrdenFactory

const CarritoRepository = require('../model/repositories/carritoRepository.js')
const carritosRepository = new CarritoRepository()

const OrdenRepository = require('../model/repositories/ordenRepository.js')
const ordenRepository = new OrdenRepository()

const UserRepository = require('../model/repositories/userRepository.js')
const userRepository = new UserRepository()


router.post('/', auth, async function(req, res, next) {
  
    const data = {
      user: req.session.userId
    }

    const id_carrito = parseInt(req.body.id_carrito)
    const orden = ordenFactory.nueva_orden(data)

    try {
      const carrito = await carritosRepository.getById(id_carrito)
      orden.agregar_carrito(carrito)

      const id = await ordenRepository.save(orden)
      const ordenActualizada = await ordenRepository.getById(id)

      res.send(ordenFactory.to_json(ordenActualizada))
    } catch(err) { 
      logger.error('Error creando orden: ', err)
      res.status(400)
      res.send({mensaje: 'Error creando orden: ' + err })
    }
 
});

router.get('/:id', auth, async function(req, res, next) {

  const id = parseInt(req.params.id)

  try {
    const orden = await ordenRepository.getById(id)
    res.send( ordenFactory.to_json(orden))
  } catch(err) { 
    logger.error('Error borrando orden: ', err)
    res.status(400)
    res.send({mensaje: 'Error borrando orden: ' + err })
  }
});


router.delete('/:id', auth, async function(req, res, next) {

  const id = parseInt(req.params.id)

  try {
    await ordenRepository.deleteById(id)
    res.send({ mensaje: `Se borró exitosamente la orden ${id}`})
  } catch(err) { 
    logger.error('Error borrando orden: ', err)
    res.status(400)
    res.send({mensaje: 'Error borrando orden: ' + err })
  }
});

router.patch('/:id', auth, async function(req, res, next) {

  const id = parseInt(req.params.id)
  const estado = req.body.estado

  try {

    //podría ser una clase estado
    if (estado != 'completa') { throw new Error('Estado inválido o vacío')}

    const orden = await ordenRepository.getById(id)
    orden.completar_orden()

    const userData = await userRepository.getById(orden.user)
    const email = userData.user

    await ordenRepository.update(orden)
    
    await mailer.enviar_orden(email, orden)
    await mailer.notificar_admin_orden(orden)
    
    res.send(ordenFactory.to_json(orden))

  } catch(err) { 
    logger.error('Error actualizando orden: ', err)
    res.status(400)
    res.send({mensaje: 'Error actualizando orden: ' + err })
  }
});

module.exports = router;
