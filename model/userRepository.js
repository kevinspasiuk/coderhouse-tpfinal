const Contenedor = require('./contenedor.js')
const MongoAdapter = require('../adaptadores/mongoAdapter')

class UserRepository {

    constructor() {
        //acá podría ir la config de coleccion de mongo
        this.db = "segundaEntrega"
        this.collection = "usuarios"

        this.contenedor = new Contenedor( new MongoAdapter(this.db, this.collection))
    }

    async save (object) {
        try {
            const id = await this.contenedor.save(object)
            return id
        } catch (e) {
            return (e)
        }
    }

    async getAll () {
        try {
            const content = await this.contenedor.getAll()
            return content 
        } catch (e) {
            return (e)
        }

    }

    async getById (number) {
        try {
            const content = await this.contenedor.getById(number)
            return content 
        } catch (e) {
            return (e)
        }
    }

    async getByUsername (username) {

        //esto debería ir en el adaptador, get by Field ( campo, valor )

        try {
            const usuarios = await this.contenedor.getAll()

            let usuarioEncontrado;

            usuarios.forEach(usuario => {

                if (usuario.user == username) {
                    usuarioEncontrado =  usuario
                }
                
            });

            return usuarioEncontrado

        } catch (e) {
            return (e)
        }

    }

    async deleteById (number) {
        try {
            await this.contenedor.deleteById(number)  
        } catch (e) {
            return (e)
        }
    }

    async updateById(number, object) {
        try {
            await this.contenedor.updateById(number, object)
            return number 
        } catch (e) {
            return (e)
        }
    }
}

module.exports = UserRepository