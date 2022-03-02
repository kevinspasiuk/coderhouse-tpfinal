const { MongoClient, ServerApiVersion } = require('mongodb');


class MongoAdapter {

    constructor () {
        const uri = "mongodb+srv://admin:admin@clusterkevin.uq0gf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

        this.db = "segundaEntrega"
        this.collection = "productos"
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
            console.error(e)
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
            console.error(e)
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
            console.error(e)
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
            console.error(e)
            return e
        }
    }
}

module.exports = MongoAdapter
