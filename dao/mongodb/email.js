const nodemailer = require('nodemailer');

exports.PassRecovery = async (data) => {

    const configuracion = {
        from: process.env.EMAIL_APP,
        to: data.email,
        subject: "Recuperación de contraseña",
        text: `Hola ${data.email}, este es tu pin: ${data.pin}`
    };

    const transport = nodemailer.createTransport({

        host: process.env.EMAIL_SERVICE,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth:{

            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    transport.verify(async function (error, success) {

        if(error){
            console.log(error);
            return false;
        }
        else{
            await transport.sendMail(configuracion);
            return success
        }
    })
}