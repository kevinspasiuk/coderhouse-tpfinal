const { MongoClient, ServerApiVersion } = require('mongodb');
const logger = require('../utils/logger.js');
require('dotenv').config();

class MongoAdapter {

    constructor (db, collection) {
        const uri = process.env.MONGO_DB_URL;
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

        this.db = db
        this.collection = collection
    } 
    
    async getAll(){
        try {
            await this.client.connect();
            const productos = this.client.db(this.db).collection(this.collection);

            const data = []

            const resultado = productos.find();
            await resultado.forEach(object => {
                data.push(object)

            });
            this.client.close()

            return(data)

        } catch (e) {
            logger.error(e)
            return e
        }

    }

    async insert(object){
        try {
            await this.client.connect();
            const productos = this.client.db(this.db).collection(this.collection);

            await productos.insertOne(object)

            this.client.close()

        } catch (e) {
            logger.error(e)
            return e
        }
    }

    async updateById(idObject, object){

        try {
            await this.client.connect();
            const productos = this.client.db(this.db).collection(this.collection);

            await productos.updateOne( {id: idObject}, {$set: object } )

            this.client.close()

        } catch (e) {
            logger.error(e)
            return e
        }
    }

    async deleteById(idObject){

        try {
            await this.client.connect();
            const productos = this.client.db(this.db).collection(this.collection);

            await productos.deleteOne({id: idObject})

            this.client.close()

        } catch (e) {
            logger.error(e)
            return e
        }
    }
}

module.exports = MongoAdapter
