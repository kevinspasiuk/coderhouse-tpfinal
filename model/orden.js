class Orden {

    COMPLETA = 'completa'
    GENERADA = 'generada'
    
    constructor (id, idOrden, timestamp, estado, user) {
        this.id = id
        this.idOrden = idOrden || this.generar_orden_aleatoria()
        this.carrito
        this.timestamp = timestamp
        this.estado = estado || this.GENERADA
        this.user = user        
    }

    agregar_carrito (carrito) {
        this.carrito = carrito
    }

    completar_orden() {
        if (this.estado == this.COMPLETA) {
            throw new Error('Orden ya está completa')
        }
        this.estado = this.COMPLETA
    }

    generar_orden_aleatoria(){
        return (Math.random() + 1).toString(36).substring(7)
    }
}

module.exports = Orden