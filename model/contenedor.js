const fs = require('fs')

class Contenedor {
  constructor (filePath) {
    this.path = filePath
  }

  async save (object) {
    const content = await this.getAll()
    object.id = this.getNextId(content)

    content.push(object)

    await this.persist(content)
    return object.id 
  }

  async getAll () {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8')
      console.log("get all data: " + data)
      if (data === '') {
        return []
      }
      return JSON.parse(data)
    } catch (err) {
      console.log("err en get all data: " + err)
      if (err.code === 'ENOENT') {
        return []
      } else {
        throw new Error('Error al leer datos', err)
      }
    }
  }

  async getById (number) {
    const content = await this.getAll()
    let itemSearched = null
    content.forEach(element => {
      if (element.id === number) {
        itemSearched = element
      }
    })
    return itemSearched
  }

  async deleteById (number) {
    let content = await this.getAll()
    content = content.filter(x => {
      return x.id !== number
    })

    try {
      await fs.promises.writeFile(this.path, this.serialize(content))
    } catch (err) {
      throw new Error('Error al borrar dato', err)
    }
  }

  async updateById(number, object) {
    await this.deleteById(number)
    object.id = number
    
    const content = await this.getAll()
    content.push(object)

    await this.persist(content)
    return object.id 
  }

  async deleteAll () {
    try {
      await fs.promises.writeFile(this.path, this.serialize([]))
    } catch (err) {
      throw new Error('Error al borrar dato', err)
    }
  }

  // private methods

  serialize (object) {
    return JSON.stringify(object, null, 2)
  }

  getNextId (objects) {
    const array = objects.map(x => x.id)
    if (array.length === 0) { return 1 }

    return Math.max(...array) + 1
  }

  async persist( content ) {
    try {
      await fs.promises.writeFile(this.path, this.serialize(content))
    } catch (err) {
      throw new Error('Error al guardar dato', err)
    }
  }

}

module.exports = Contenedor
