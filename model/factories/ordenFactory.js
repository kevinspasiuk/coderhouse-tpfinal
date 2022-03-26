const Orden = require('../orden.js');

class OrdenFactory{

    constructor() {

    }

    nueva_orden( data) {
        const ordenNueva = new Orden(data.id, data.idOrden, data.timestamp || Date.now(), data.estado, data.user)
        return ordenNueva
    }

    serializar( orden ) {

        return {
            id: orden.id,
            idOrden: orden.idOrden,
            carrito: orden.carrito.id,
            user: orden.user,
            timestamp: orden.timestamp,
            estado: orden.estado
        }
    }

    to_json( orden ) {

        return {
            id: orden.id,
            idOrden: orden.idOrden,
            carrito: orden.carrito,
            user: orden.user,
            timestamp: orden.timestamp,
            estado: orden.estado
        }
    }
}

module.exports = OrdenFactory