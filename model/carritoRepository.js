const Contenedor = require('../model/contenedor.js');
const FirebaseAdapter = require('../adaptadores/firebaseAdapter.js');
const ProductoRepository = require('../model/productoRepository.js');

class CarritoRepository {
    constructor () {
        this.carritoContenedor = new Contenedor( new FirebaseAdapter )
        this.productosRepository = new ProductoRepository
    }

    async save (object) {
       return this.carritoContenedor.save(object)
    }

    async getById(idCarrito){
       const carrito = await this.carritoContenedor.getById(idCarrito)
       if (carrito){ 
        let productos = []

        for (const id_producto of carrito.productos){
         const producto = await this.productosRepository.getById(id_producto)
         productos.push(producto)
        }
 
        carrito.productos = productos
       } 
       return carrito
    }

    async addProduct(idCarrito, idProducto) {
        const carrito = await this.carritoContenedor.getById(idCarrito)
        carrito.productos.push(idProducto)
        return this.carritoContenedor.updateById(idCarrito, carrito)
    }

    async deleteById(idCarrito){
        return this.carritoContenedor.deleteById(idCarrito)
    }

    async deleteProduct(idCarrito, idProducto) {
        const carrito = await this.carritoContenedor.getById(idCarrito)
        carrito.productos = carrito.productos.filter(x => {
            return x !== idProducto
        })
        return this.carritoContenedor.updateById(idCarrito, carrito)
    }
}

module.exports = CarritoRepository