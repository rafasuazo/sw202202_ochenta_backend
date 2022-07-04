const { body, check, validationResult } = require('express-validator');
const UsuarioDao = require('../../../../dao/mongodb/models/UsuarioDao');

exports.Validation = [

    body('nombre').matches(/^[a-zA-Z\s]+$/)
    .withMessage("No se aceptan números o caracteres especiales")
    .isLength({min: 3})
    .withMessage("La longitud mínima para el nombre es de 3 caracteres"),

    body('apellido').matches(/^[a-zA-Z\s]+$/)
    .withMessage("No se aceptan números o caracteres especiales")
    .isLength({min: 3})
    .withMessage("La longitud mínima para el apellido es de 3 caracteres"),

    body('telefono').isMobilePhone()
    .withMessage("Telefono no debe contener caracteres especiales")
    .isLength({min: 8})
    .withMessage("Longitud incorrecta para el telefono"),

    body('fechaNacimiento').isDate()
    .withMessage("Formato incorrecto de fecha"),
    (req, res, next) => {

        const errors = validationResult(req);

        // errores no está vacío, ossa que si hay errores
        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }
        else{
            next();
        }
    }
];

// este es para crear el usuario
exports.ValidateUser = [

    body('email').isEmail()
    .withMessage("Formato incorrecto para el email"),
    
    body('password').isLength({min: 6})
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/\d/)
    .withMessage("La contraseña debe contener números"),
    (req, res, next) => {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }
        else{
            next();
        }
    }
];

// para validar el envío de email
exports.ValidateMail = [

    body('email').isEmail()
    .withMessage("Formato incorrecto para el email"),

    check('email').custom(value => {

        return UsuarioDao.findOne({
            where:{
                email: value
            }
        })
        .then((result) => {
            if(!result){
                throw new Error("El email no existe");
            }
        })
    }),
    (req, res, next) => {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }
        else{
            next();
        }
    }
]

exports.ValidatePin = [

    body('pin')
    .matches(/\d/)
    .withMessage("El pin ingresado no es válido"),

    check('pin').custom(value => {

        return UsuarioDao.findOne({
            where:{
                pin: value
            }
        })
        .then((result) => {
            if(!result){
                throw new Error("El pin ingresado no es el proporcionado o ya no es válido")
            }
        })
    }),
    (req, res, next) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }
        else{
            next();
        }
    }
]