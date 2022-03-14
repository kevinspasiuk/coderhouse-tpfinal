const logger = require('../utils/logger.js');

class Contenedor {

    constructor(dbAdapter) {
        this.adapter = dbAdapter
    }

    async save (object) { 
        const collection = await this.adapter.getAll()
        object.id = this.getNextId(collection)
    
        await this.adapter.insert(object)
        return object.id 
    }

    async getAll () {
        try {
            const data = await this.adapter.getAll()
            return data
        } catch (e){
            logger.error("err en get all data: " + err)
            throw new Error('Error al leer datos', err)
        }
    }

    async getById (number) { 
        const content = await this.adapter.getAll()

        let itemSearched = null
        content.forEach(element => {
          if (element.id === number) {
            itemSearched = element
          }
        })
        return itemSearched
    }

    async deleteById (number) { 
        try {
            this.adapter.deleteById(number)
        } catch (e) {
            logger.error(e)
            return e
        }
    }

    async updateById(number, object) { 
        try {
            await this.adapter.updateById(number, object)
        } catch (e) {
            logger.error(e)
            return e
        }

    }

    getNextId (objects) {
        const array = objects.map(x => x.id)
        if (array.length === 0) { return 1 }
    
        return Math.max(...array) + 1
    }

}

module.exports = Contenedor