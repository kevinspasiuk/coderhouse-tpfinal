const Contenedor = require('../model/contenedor.js')


class CarritoRepository {
    constructor (filePath) {
        this.carritoContenedor = new Contenedor('./db/carritos.txt')
        this.productosRepository = new Contenedor('./db/productos.txt')
    }

    async save (object) {
       return this.carritoContenedor.save(object)
    }

    async getById(idCarrito){
       const carrito = await this.carritoContenedor.getById(idCarrito)
       let productos = []

       for (const id_producto of carrito.productos){
        const producto = await this.productosRepository.getById(id_producto)
        console.log("Id producto", id_producto, producto)
        productos.push(producto)
       }

       carrito.productos = productos
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
        console.log("Carrito actualzado " + carrito)
        return this.carritoContenedor.updateById(idCarrito, carrito)
    }
}

module.exports = CarritoRepository