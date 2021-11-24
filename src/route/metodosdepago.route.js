const router = require('express').Router();
const metoPagoModelo = require("../models/metodospago.models");
const metodoPagoValidacion = require('../Schemas_joi/metodosPago/metodoPago.Schema');
const esAdmin = require('../middlewares/esAdmin');

/**
 * @swagger
 * /metodopagos/metodosdepago:
 *  get:
 *      summary: Obtener todos los metodos de pago
 *      tags: [METODOS DE PAGO]
 *      schema:
 *      responses:
 *          200:
 *              description: Metodos de pago disponibles
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/obtenermetodospago'
 */
router.get("/metodosdepago", async (req, res) => {
    res.json(await metoPagoModelo.find());
})

/**
 * @swagger
 * /metodopagos/agremetodopago:
 *  post:
 *      summary: Ingresar un nuevo metodo de pago.
 *      description: Ingresar un nuevo metodo de pago a nuestro sistema.
 *      tags: [METODOS DE PAGO]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/agremetodopago'
 *      responses:
 *          201:
 *              description: Metodo de pago agregado exitosamente.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Se creo el metodo de pago PayPal exitosamente
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El metodo de pago ya existe - ingrese un medio de pago valido
 */
router.post("/agremetodopago", esAdmin, async (req, res) => {
    try {
        const { medio } = await metodoPagoValidacion.validateAsync(req.body);
        const verificacion = await metoPagoModelo.findOne({ medio });
        if (verificacion == null) {
            const metNew = await new metoPagoModelo({
                medio
            });
            await metNew.save()
            res.status(201).json(`Se creo el metodo de pago ${medio} exitosamente`)
        } else {
            res.status(400).json('El metodo de pago ya existe');
        };
    } catch (err) {
        if (err.details == undefined) {
            res.status(500).json('INTERNAL SEVER_ERROR=500');
        } else {
            res.status(400).json(res.json(err.details[0].message));
        }
    };
});

/**
 * @swagger
 * /metodopagos/editarmetodo/{IdMetodoDePago}:
 *  put:
 *      summary: Edita el nombre de los metodos de pago dispobibles.
 *      description: Edita el nombre de los metodos de pago indicado por medio de su Id.
 *      tags: [METODOS DE PAGO]
 *      parameters:
 *        - in: path
 *          name: IdMetodoDePago
 *          required: true
 *          schema:
 *              type: string
 *              example: asd123
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/editarMetodo'
 *      responses:
 *          201:
 *              description: Actualizacion exitosa del metodo de pago.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Se actualizo correctamente el medio de pago a Nequi
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Id de metodo de pago invalido - El metodo de pago ya existe - ingrese un medio de pago valido - medio de pago vacio
 * 
 */

router.put("/editarmetodo/:id", esAdmin, async (req, res) => {
    try {
        const { id: _id } = req.params;
        const { medio } = await metodoPagoValidacion.validateAsync(req.body);
        const metPago = await metoPagoModelo.findById({ _id });
        if (metPago == null) {
            res.status(400).json('Id de metodo de pago invalido');
        } else {
            const resultado = await metoPagoModelo.findByIdAndUpdate({ _id }, { "medio": medio });
            res.json(`Se actualizo correctamente el medio de pago a ${medio}`)
        };
    } catch (err) {
        if (err.name == 'CastError') {
            res.json('Id de metodo de pago invalido')
        } else if (err.codeName == 'DuplicateKey') {
            res.status(400).json("El metodo de pago ya existe");
        } else {
            res.status(201).json(res.json(err.details[0].message));
        }
    }
});

/**
 * @swagger
 * /metodopagos/eliminarmetodo/{IdMetodoDePago}:
 *  delete:
 *      summary: Eliminar un metodo de pago del sistema
 *      description: Eliminar metodo de pago del sistema
 *      tags: [METODOS DE PAGO]
 *      parameters:
 *        - in: path
 *          name: IdMetodoDePago
 *          required: true
 *          schema:
 *              type: string
 *              example: asd123
 *      responses:
 *          201:
 *              description: Metodo de pago eliminado exitosamente.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Se elimino correctamente el metodo de pago Nequi
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Id de metodo de pago invalido
 */
router.delete("/eliminarmetodo/:id", esAdmin, async (req, res) => {
    try {
        const { id: _id } = req.params;
        const metPago = await metoPagoModelo.findOne({ _id });
        if (metPago == null) {
            res.status(400).json('Id de metodo de pago invalido')
        } else {
            const resultado = await metoPagoModelo.findByIdAndDelete({ _id });
            res.status(201).json(`Se elimino correctamente el metodo de pago ${metPago.medio}`)
        };
    } catch (err) {
        if (err.name == 'CastError') {
            res.status(400).json('Id de metodo de pago invalido')
        } else {
            res.status(400).json('INTERNAL SERVER_ERROR=500');
        };
    };
});

/**
 * @swagger
 * tags:
 *  name: METODOS DE PAGO
 *  description: Seccion dedicada a los "METODOS DE PAGO"
 * 
 * components:
 *  schemas:
 *      obtenermetodospago:
 *          type: object
 *          properties:
 *              medio:
 *                  type: string
 *                  description: Nombre del metodo de pago
 *              id:
 *                  type: number
 *                  description: ID unico de nuestro metod de pago
 *          example:
 *              medio: Efectivo
 *              id: 1
 *      agremetodopago:
 *          type: object
 *          require:
 *              - medio
 *          properties:
 *              medio:
 *                  type: string
 *                  description: Nombre del nuevo metodo de pago a agregar.
 *          example:
 *              medio: "PayPal"
 * 
 *      editarMetodo:
 *          type: object
 *          require:
 *              - medio
 *          properties:
 *              medio:
 *                  type: string
 *                  description: Nombre del metodo de pago actualizado.
 *          example:
 *              medio: Nequi
 *          
 * 
 */
module.exports = router;