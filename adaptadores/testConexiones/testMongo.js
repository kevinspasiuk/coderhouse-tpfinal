await this.client.connect();
const productos = client.db("segundaEntrega").collection("productos")
// Insertar
//await productos.insertMany([{  cod_producto: 1,  nombre: "Escuadra",  precio: 100,  foto: "./escuadra.png"}]
/*Obtener datos:        
const resultado = productos.find()
await resultado.forEach(console.dir);
*
/*borrar datos 
await productos.deleteOne({cod_producto: 1})
*
/*update datos
await productos.updateOne( {cod_producto: 1}, {$set: {precio: 90} } )
*/
client.close()