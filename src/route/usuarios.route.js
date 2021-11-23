const usuarioValidation = require("../Schemas_joi/Usuarios/usuarioRegistro.Schema");
const loginValidation = require("../Schemas_joi/Usuarios/usuarioLogin.Schema");
const usuarioModelo = require("../models/usuario.model");
const express = require('express');
const router = express.Router();
const JWT = require("jsonwebtoken");
const esAdmin = require('../middlewares/esAdmin');
const { encryptPassword, matchPassword } = require('../helpers/bcrypt.methods');
const eliminarDireccionUsuario = require('../helpers/eliminarDireccion');

/**
 * @swagger
 * /usuarios/obtenerusuarios:
 *  get:
 *      summary: Obtener todos los usuarios registrados
 *      tags: [USUARIOS]
 *      schema:
 *      responses:
 *          200:
 *              description: Lista de todos los usuarios registrados.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/obtenerusuarios'
 */
router.get('/obtenerusuarios', esAdmin, async (req, res) => {
    try {
        res.json(await usuarioModelo.find());
    } catch (err) {
        res.status(500).json("A OCURRIDO UN ERROR - 500 INTERNAL ERROR");
    };
});

/**
 * @swagger
 * /usuarios/ingresar:
 *  post:
 *      summary: ingresar al sistema
 *      description: Ingresar al sistema
 *      tags: [USUARIOS]
 *      security: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/login'  
 *      responses:
 *          200:
 *              description: Respuesta de si su inicio de sesion fue exitoso o no.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          anyOf:
 *                              - $ref: '#/components/schemas/usuariologin'
 *                          
 */
router.post("/ingresar", async (req, res) => {
    try {
        const { email, password } = await loginValidation.validateAsync(req.body);
        const { password: pass, username } = await usuarioModelo.findOne({ email });
        const verificacion = await matchPassword(password, pass);
        if (verificacion) {
            const token = JWT.sign({ username, email }, process.env.PASS);
            res.status(200).json({ token });
        } else {
            res.status(401).json("Unauthorized");
        };
    } catch (err) {
        res.status(401).json("Unauthorized")
    }
})

router.get('/micuenta', async (req, res) => {
    try {
        const { email } = req.user;
        res.status(200).json(await usuarioModelo.find({ email }));
    } catch (err) {
        res.status(500).json("A OCURRIDO UN ERROR - 500 INTERNAL ERROR");
    };
})

/**
 * @swagger
 * /usuarios/registrar:
 *  post:
 *      summary: Ingresar un nuevo usuario al sistema
 *      description: Ingresar datos para la creacion de un usuario nuevo
 *      tags: [USUARIOS]
 *      security: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/register'
 *      responses:
 *          201:
 *              description: Usuario creado exitosamente
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Usuario creado exitosamente.
 *          200:
 *              description: El correo diligenciado ya existe en nuestro sistema
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Este correo ya existe en nuestro sistema.
 *                      
 */
router.post("/registrar", async (req, res) => {
    try {
        const { email, username, password, telefono, direccion } = await usuarioValidation.validateAsync(req.body);
        direccion[0].id = Math.floor((Math.random() * (300 - 100 + 1)) + 100);
        const verificacion = await usuarioModelo.findOne({ email });
        if (verificacion == null) {
            const userNew = await new usuarioModelo({
                email,
                username,
                password,
                telefono,
                direccion
            });
            userNew.password = await encryptPassword(password);
            await userNew.save();
            res.status(201).json(`USUARIO CREADO Username: ${userNew.username} Email: ${userNew.email}`);
        } else {
            res.status(400).json("El email ya se encuentra registrado");
        };
    } catch (err) {
        if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500")
        }
        else if (err.details[0].type == "any.only") {
            res.status(400).json("Las contrasenas no coinciden");
        } else { res.status(400).json(err.details[0].message) };
    };
});



router.post("/aggdireccion/:id", async (req, res) => {
    try {
        const { id: _id } = req.params;
        const nuevaDireccion = req.body;
        const user = await usuarioModelo.findById({ _id });
        nuevaDireccion.id = Math.floor((Math.random() * (300 - 100 + 1)) + 100);
        user.direccion.push(nuevaDireccion);
        await user.save();
        res.json(nuevaDireccion);
    } catch (err) {
        res.status(500).json("INTERNAL SERVER ERROR_500")
    }
});

router.delete("/deldireccion/:id", async (req, res) => {
    try {
        const { id: _id } = req.params;
        const { id } = req.body;
        const user = await usuarioModelo.findById({ _id });
        const verificacion = eliminarDireccionUsuario(user.direccion, id);
        if (verificacion != false) {
            await user.save();
            res.json("Direccion Eliminada");
        } else {
            res.json("No hallamos el id en la lista de direcciones");
        };
    } catch (err) {
        res.json("INTERNAL SERVER ERR0R_500");
    };
});

/**
 * @swagger
 * tags:
 *  name: USUARIOS
 *  description: Seccion dedicada a "USUARIOS"
 * 
 * components:
 *  schemas:
 *      usuariologin:
 *          type: string
 *          example:
 *              Inicio de sesion exitoso.
 * 
 * 
 *              Inicio de sesion NO exitoso.
 *      obtenerusuarios:
 *          type: object
 *          require:
 *              -email
 *              -username
 *              -password
 *              -isAdmin
 *              -telefono
 *              -direccion
 *              -id
 *          properties:
 *              email:
 *                  type: string
 *                  description: Email del usuario
 *              username:
 *                  type: string
 *                  description: Apodo del usuario
 *              password:
 *                  type: string
 *                  description: Password de acceso del usuario
 *              isAdmin:
 *                  type: boolean
 *                  description: Si es o no usuario administrador
 *              telefono:
 *                  type: integer
 *                  description: Telefono del usuario
 *              direccion:
 *                  type: string
 *                  description: Direccion del usuario
 *              id:
 *                  type: integer
 *                  description: Id unico del usuario
 *          example:
 *              email: emailDeEjemplo@ejemplo.com
 *              username: usernameDeEjemplo
 *              password: passDeEjemplo
 *              isAdmin: Ejemplo-false
 *              telefono: ejemplo-31111112
 *              direccion: direccionDeEjemplo
 *              id: IdUnicoDeEjemplo
 *      login:
 *          type: object
 *          required:
 *              - email
 *              - password
 *          properties:
 *              email:
 *                  type: string
 *                  description: Email del usuario
 *              password:
 *                  type: string
 *                  description: Password del usuario
 *          example:
 *              email: correo1@gmail.com
 *              password: "12345"
 * 
 *      register:
 *          type: object
 *          required:
 *              - email
 *              - username
 *              - password
 *              - telefono
 *              - direccion
 *          properties:
 *              email:
 *                  type: string
 *                  description: email del nuevo usuario
 *              username:
 *                  type: string
 *                  description: Username o apodo de identificacion del nuevo usuario
 *              password:
 *                  type: string
 *                  description: Clave de inicio de sesion del nuevo usuario
 *              telefono:
 *                  type: number
 *                  description: Numero de telefono del nuevo usuario
 *              direccion:
 *                  type: string
 *                  description: Direccion del usuario a nuevo crear
 *          example:
 *              email: "correo2@gmail.com"
 *              username: "usuario2"
 *              password: "soydos"
 *              telefono: 3125567282
 *              direccion: "calle 20 #15-sur"
 *                  
 */
module.exports = router;