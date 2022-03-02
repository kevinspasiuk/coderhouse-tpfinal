const Contenedor = require('../model/contenedor.js')
const MongoAdapter = require('../adaptadores/mongoAdapter')
const { response } = require('express')

class ProductoRepository {

    constructor() {
        //acá podría ir la config de coleccion de mongo

        this.contenedor = new Contenedor( new MongoAdapter)
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

module.exports = ProductoRepository