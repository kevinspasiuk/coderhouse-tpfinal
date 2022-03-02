const admin = require("firebase-admin");

const serviceAccount = require("./coderhouse-61464-firebase-adminsdk-7ti65-2dce5ecf8e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


async function test(){
    try{ 
        const db = admin.firestore();
        const collection = db.collection("carritos") 

        // Guardar dato

        //let id = 3
        //let doc = collection.doc(`${id}`)
        //await doc.create( { nombre: 'Flopi'} )

        //obtener datos 

        //const datos = await collection.get()
        //let docs = datos.docs;
        //docs.map( (doc) => {
        //    console.log(doc.id, doc.data()) 
        //})

        // update por id:

        // let doc = collection.doc('2')
        // let item = await doc.update({nombre: 'Kev'})

        // delete por id:

        let doc = collection.doc('2')
        await doc.delete()


    } catch (e) {

        console.log(e)
    }
}

test()