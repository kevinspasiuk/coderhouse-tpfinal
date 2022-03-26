## Entrega Final

### Estructura de carpetas

    /adaptadores: tiene el adaptador para la conexión de Mongo y Firebase
    /model: tiene las clases del dominio
        /model/factories: tiene las clases factories
        /model/repositories: tiene las clases repositories
    /postman: tiene la colección para probar el backend
    /public: tiene la pantilla para el chat
    /routes: tiene los router de express
    /utils: clases de utilidad diversas (mailer, logger)
    /views: tiene las views de ejs.

### Run

    $ npm install

    $ npm start

Requerimientos
--------------

### Sesión configurable

En el archivo .env se encuentra la variable de ambiente **COOKIE_MAX_AGE** que representa la duración de la sesión. Actualmente está en 10 minutos.

### Chat 

Si se ingresa a la ruta /chat se dispondrá de una UI para comunicarse en una sala de chat mediante web socket. 

En la ruta /chat/:email devuelve en formato JSON todos los mensajes que ese email mandó en el chat.

No se implmentó ningún tipo de autenticación para estos endpoints.

### Configuración del server

Se puede configurar el server con el archivo .env 
La configuración puede ser:
 
- MONGO_DB_URL = la url del cluster de Mongo DB
- SESSION_SECRET = secret usado para la sesión
- PORT = puerto de escucha del server
- COOKIE_MAX_AGE = tiempo máximo de la sesión 
- MAILER_USER = mail de gmail para notificar
- MAILER_PASS = contraseña de gmail para notificar
- ADMIN_MAIL =  mail del administrador para notificar altas y compras


### Registro

En la ruta /auth/registro se permite a los usuarios registrarse indicando:

- username: email a registrar
- password: constraseña para el login
- passwordRepetida: se vuelve ingresar la contraseña
- direccion: domicilio del usuario
- telefono: teléfono del usuario
- nombre: nombre completo del usuario

Este endpoint devuelve error si:

- El usuario ya existe
- La contraseña está vacía
- Las contraseñas no coinciden
- El campo username no es tiene formato email
- Faltan campos

Se cuenta con un usuario admin para usar todos los endpoints disponibles
- username: admin@admin.com
- password: admin

En caso de registro exitoso se notifica al administrador

### Login 

En la ruta /auth/login permite a los usuarios loguearse y establecer una sesión de 10 minutos. 

En caso de que se ingresen credenciales incorrectas, devuelve error. 

Al sólo desarrollar el backend, no se hizo una redirección al endpoint GET /api/productos ya que considero que no corresponde al backend tener una redirección en el login a dicho endpoint.

De todos modos en el caso de hacerlo con tener un res.redirect(/api/productos)


### Configuración mailer

Se creó la siguiente cuenta para mandar notificaciones y recibir los avisas al administrador:

    user: kevincoderhouse@gmail.com
    pass: kevincoderhouse2022

Se notifica al administrador (mail configurable desde el .env) cuando se crea una nueva cuenta.

En el momento de confirmar una orden, se notifica al amdinistrador y también al email registrado del usuario que creó la orden.

