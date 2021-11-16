const hallarUsuario = require("../helpers/findUser")
const usuarioModelo = require("../models/usuario.model")
const express = require('express');
const router = express.Router();
const middlewareLogin = require("../middlewares/autenticacion.middleware");
const { esAdmin } = require("../middlewares/esAdmin.middleware");

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
router.get('/obtenerusuarios', async (req, res) => {
    try {
        res.json( await usuarioModelo.find());
}   catch (err) {
        res.json("A OCURRIDO UN ERROR - 500 INTERNAL ERROR")
        console.log(err)
}
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
    const { email, password } = req.body;
    const verificacion = await hallarUsuario(email, password);
    if(verificacion){
        res.status(200).json("Inicio de sesion exitoso");
    } else {
        res.status(401).json("Inicio de sesion NO EXITOSO");
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
 *              description: El correo diligenciado ua existe en nuestro sistema
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Este correo ya existe en nuestro sistema.
 *                      
 */                     
router.post("/registrar", async (req, res) => {
    const {email, username, password, telefono, direccion} = req.body;
if (email && username && password && telefono && direccion) {
    try {
        const userNew = await new usuarioModelo ({
            email, username, password, telefono, direccion
        });
        userNew.password = await userNew.encryptPassword(password);
        await userNew.save();
        res.status(201).json(userNew)
    } catch (err) {
        console.log(err);
        res.status(404).json("El email ya se encuentra en nuestro sistema");
    };
} else {res.status(404).json("Faltan datos obligatorios")};
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