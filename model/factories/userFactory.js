
class UserFactory {
    constructor(){
    }

    validar( usuario ) {
        if (
            !(usuario.direccion) ||
            !(usuario.telefono) ||
            !( usuario.user) ||
            !(usuario.password) ||
            !(usuario.nombre) 
          ) {
            throw new Error("Campos Faltantes")
          }
        
        if (!usuario.user.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )) {
            throw new Error("Username debe ser un email válido")
        }
        

    }




}

module.exports = UserFactory