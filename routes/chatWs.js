const { Server } = require("socket.io");
const MensajeRepository = require('../model/repositories/mensajeRepository.js');
const logger = require('../utils/logger.js');

function getCurrentDateTime() {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time
}


module.exports = function (serverSocket) {

    const io = new Server(serverSocket);

    io.on('connection', (socket) => {

        logger.info('[WC] Nueva conexión')

        const mensajesRepository = new MensajeRepository;
        mensajesRepository.getAll()
            .then(mensajes => socket.emit('mensajes', mensajes))

        socket.on('nuevo-mensaje', mensaje => {

            mensaje.dateTime = getCurrentDateTime()
            const mensajesRepository = new MensajeRepository;

            mensajesRepository.save(mensaje)
                .then(id => {
                    mensajesRepository.getAll().then(mensajes => io.sockets.emit('mensajes', mensajes))
                }
                )
        })
    });
}