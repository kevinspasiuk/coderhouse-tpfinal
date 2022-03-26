const Carrito = require('../carrito.js');

class CarritoFactory{

    constructor() {

    }

    nuevo_carrito( data) {
        const carritoNuevo = new Carrito( data.id, data.user, data.direccionEntrega, data.timestamp || Date.now() )
        return carritoNuevo
    }

    serializar( carrito ) {
        const items = []
        carrito.items.forEach( item => {
            items.push( { producto: item.producto.id, cantidad: item.cantidad})

        })

        return {
            id: carrito.id,
            items: items,
            user: carrito.user,
            timestamp: carrito.timestamp
        }
    }

    to_json( carrito ) {

        return {
            id: carrito.id,
            items: carrito.items,
            user: carrito.user,
            fechaHora: carrito.timestamp
        }
    }
}

module.exports = CarritoFactory