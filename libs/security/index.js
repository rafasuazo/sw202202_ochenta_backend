const jwt = require('jsonwebtoken');
const expiresIn = parseInt(process.env.JWT_AGE_SECONDS) * 1000;
//Se llaman el usuario y el email
const email = require('../../dao/mongodb/email');
const UsuarioDao = require('../../dao/mongodb/models/UsuarioDao');
module.exports = { 
  jwtSign : async (payload)=>jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {expiresIn}
  ),
  jwtVerify: async (token)=>jwt.verify(token, process.env.JWT_SECRET)
}

// funcion para el envío de email
exports.RecoverPass = async (req, res) => {

  const { email: email } = req.body;
  const pin = Math.floor(Math.random() * (9999-1000) + 1000);

  // estos datos se mandan al archivo email
  const data = {
      email: email,
      pin: pin
  }

  if(email.PassRecovery(data)){

      let buscaUsuario = await UsuarioDao.findOne({
          where:{
            email: email
          }
      })

      buscaUsuario.pin = pin;
      await buscaUsuario.save()
      .then((result) => {
          respuesta("Email enviado", 200, buscaUsuario.id, res);
      })
      .catch((err) => {
          respuesta("Problema al enviar el email", 400, [], res);
      });    
  }
}

exports.CheckPin = async (req, res) => {

  const { id } = req.query;
  const { pin, password, confirmar } = req.body;

  let buscaUsuario = await UsuarioDao.findOne({
      where:{
          id: id
      }
  })

  if(!buscaUsuario){
      respuesta("El usuario no existe", 404, [], res);
  }
  else{

      if(confirmar !== password){
          respuesta("Las contraseñas no son iguales", 200, [], res);
      }
      else{

          buscaUsuario.password = password;
          buscaUsuario.pin = null;
          await buscaUsuario.save()
          .then((result) => {
              respuesta("Operacion realizada correctamente", 201, [], res);
          })
          .catch((err) => {
              console.log(err);
              respuesta("Algo salio mal", 304, [], res);
          })
      }   
  }
}
