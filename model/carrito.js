

class Carrito {
    constructor(id, user, direccionEntrega, timestamp){ 
        this.id = id
        this.items = []
        this.user = user
        this.direccionEntrega = direccionEntrega
        this.timestamp = timestamp
    }

    agregar_producto( producto ){
        let productoYaExiste = false;

        this.items.forEach(item => {
            if (item.producto.id == producto.id) {
                item.cantidad ++
                productoYaExiste = true;
            }
        });

        if (!productoYaExiste){
            this.items.push( {producto: producto, cantidad: 1 })
        }
    }

    borrar_producto( producto ){
        let borrar = false;
        let borrarIndex;
        
        this.items.forEach(function (item, index) {
            if (item.producto.id == producto.id) {
                if (item.cantidad > 1 ) {
                    item.cantidad --
                } else {
                    borrar = true
                    borrarIndex = index;
                }
            }
        });

        if (borrar){ 
            this.items.splice(borrarIndex, 1)
        }
    }

}

module.exports = Carrito;