const { createTransport } = require("nodemailer");
require('dotenv').config();

class Mailer {
    constructor(){
        this.transporter = createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS
            }
        });
    }

    async enviar_orden (email, orden) {
        const columnas = [ 'Producto', 'Cantidad','Precio']
        
        let html = '<html><body><h2>Gracias por tu compra!</h2>';

        html += `<h3> Detalle de tu orden: ${orden.idOrden} #${orden.id} </h3> `;

        html += '<table><thead><tr>';
        for (let item of columnas) {
          html += '<th>' + item + '</th>';
        }

        html += '</tr></thead><tbody>';

        for (let item of orden.carrito.items) {
          html += '<tr>';
          html += '<td>' + item.producto.nombre +'</td>';
          html += '<td>' + item.cantidad +'</td>';
          html += '<td>' + item.producto.precio +'</td>';
          html += '</tr>';

        }

        html += '</tbody></table></body></html>';


        const mailOptions = {
            from: 'Servidor Node.js',
            to: email,
            subject: 'Nueva Orden',
            html: html,
        }
        return this.transporter.sendMail(mailOptions)
    }

    notificar_admin_orden(orden) {
        const columnas = [ 'Producto', 'Cantidad','Precio']
        
        let html = '<html><body><h2>Nueva Compra</h2>';

        html += `<h3> Detalle de la orden: Usuario:${orden.user}, id: ${orden.idOrden} #${orden.id} </h3> `;

        html += '<table><thead><tr>';
        for (let item of columnas) {
          html += '<th>' + item + '</th>';
        }

        html += '</tr></thead><tbody>';

        for (let item of orden.carrito.items) {
          html += '<tr>';
          html += '<td>' + item.producto.nombre +'</td>';
          html += '<td>' + item.cantidad +'</td>';
          html += '<td>' + item.producto.precio +'</td>';
          html += '</tr>';

        }

        html += '</tbody></table></body></html>';


        const mailOptions = {
            from: 'Servidor Node.js',
            to: process.env.ADMIN_MAIL,
            subject: '[ADMIN] Nueva Orden',
            html: html,
        }
        return this.transporter.sendMail(mailOptions)

    }

    notificar_admin_registro(usuario) {

        let html = '<html><body><h2>Nuevo Usuario</h2>';
        html += `<p> Username: ${usuario.user} </p>`

        const mailOptions = {
            from: 'Servidor Node.js',
            to: process.env.ADMIN_MAIL,
            subject: '[ADMIN] Nuevo Usuario',
            html: html,
        }
        return this.transporter.sendMail(mailOptions)
    }


}

module.exports = Mailer