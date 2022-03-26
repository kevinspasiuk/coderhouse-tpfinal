const Contenedor = require('../contenedor.js')
const MongoAdapter = require('../../adaptadores/mongoAdapter')

const OrdenFactory = require('../factories/ordenFactory.js')
const ordenFactory = new OrdenFactory

const CarritoRepository = require('./carritoRepository.js')
const carritoRepository = new CarritoRepository

class OrdenRepository {

    constructor() {
        this.db = "segundaEntrega"
        this.collection = "ordenes"

        this.ordenContenedor = new Contenedor( new MongoAdapter(this.db, this.collection))
    }

    async save (orden) {
        return this.ordenContenedor.save(ordenFactory.serializar(orden))
    }

    async getById (idOrden) {

        const dataOrden = await this.ordenContenedor.getById(idOrden)
        const orden = ordenFactory.nueva_orden(dataOrden)
        
        if (orden){ 
            orden.carrito = await carritoRepository.getById(dataOrden.carrito)
        } 

        return orden

    }

    async deleteById(idOrden){
        return this.ordenContenedor.deleteById(idOrden)
    }

    async update(orden) {
        return this.ordenContenedor.updateById(orden.id, ordenFactory.serializar(orden))
    }

}

module.exports = OrdenRepository