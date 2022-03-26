const Contenedor = require('../contenedor.js');
const FirebaseAdapter = require('../../adaptadores/firebaseAdapter.js');
const ProductoRepository = require('./productoRepository.js');
const CarritoFactory = require('../factories/carritoFactory.js');
const carritoFactory = new CarritoFactory

class CarritoRepository {
    constructor () {
        this.carritoContenedor = new Contenedor( new FirebaseAdapter )
        this.productosRepository = new ProductoRepository
    }

    async save (carrito) {
       return this.carritoContenedor.save(carritoFactory.serializar(carrito))
    }

    async getById(idCarrito){
       const dataCarrito = await this.carritoContenedor.getById(idCarrito)
       const carrito = carritoFactory.nuevo_carrito(dataCarrito)
       
       if (carrito){ 

        for (const item of dataCarrito.items){
         const producto = await this.productosRepository.getById(item.producto)
         for (var i = 0; i < item.cantidad; i++) {
            carrito.agregar_producto(producto)
          }
        }
       } 

       return carrito
    }

    /*
    async addProduct(idCarrito, idProducto) {
        const carrito = await this.carritoContenedor.getById(idCarrito)
        carrito.productos.push(idProducto)
        return this.carritoContenedor.updateById(idCarrito, carrito)
    }
    */

    async deleteById(idCarrito){
        return this.carritoContenedor.deleteById(idCarrito)
    }

    async update(carrito) {
        return this.carritoContenedor.updateById(carrito.id, carritoFactory.serializar(carrito))
    }


    /*
    async deleteProduct(idCarrito, idProducto) {
        const carrito = await this.carritoContenedor.getById(idCarrito)
        carrito.productos = carrito.productos.filter(x => {
            return x !== idProducto
        })
        return this.carritoContenedor.updateById(idCarrito, carrito)
    }
    */
}

module.exports = CarritoRepository