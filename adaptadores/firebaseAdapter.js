const firebase = require("firebase-admin");
const logger = require('../utils/logger.js');

class FirebaseAdapter {
    constructor () {
        const serviceAccount = require("./coderhouse-61464-firebase-adminsdk-7ti65-2dce5ecf8e.json");

        if (!firebase.apps.length) {
            firebase.initializeApp({
                credential: firebase.credential.cert(serviceAccount)
              });
         }else {
            firebase.app(); 
         }

        this.db = firebase.firestore();
        this.collection = this.db.collection("carritos") 
    }

    async getAll(){
        try {
            const datos = await this.collection.get()
            let docs = datos.docs;
            const objetos = []

            docs.map( (doc) => {
                objetos.push(doc.data()) 
            })

        return objetos
        } catch (e) {
            logger.error(e)
            return e
        }
    }

    async insert(object){
        try {
            let doc = this.collection.doc(`${object.id}`)
            await doc.create( object )
        } catch (e) {
            logger.error(e)
            return e
        }   
    }

    async updateById(idObject, object){ 
        try {
            const doc = this.collection.doc(`${idObject}`)
            await doc.update(object)

        } catch (e) {
            logger.error(e)
            return e
        }
    }

    async deleteById(idObject){ 
        try {
            const doc = this.collection.doc(`${idObject}`)
            await doc.delete()

        } catch (e) {
            logger.error(e)
            return e
        }
    }

}

module.exports = FirebaseAdapter