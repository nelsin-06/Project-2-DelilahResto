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
 *      summary: Ingresar un nuevo metodo de pago al sistema
 *      description: Ingresar un nuevo metodo de pago unico e irrepetible al sistema
 *      tags: [METODOS DE PAGO]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/newmethod'
 *      responses:
 *          201:
 *              description: Metodo de pago agregado
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Metodo de pago agregado
 *          200:
 *              description: Si el metodo actualmente existe.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Este metodo de pago ya existe.
 */
router.post("/agremetodopago", async (req, res) => {
    try {
    const { medio } = await metodoPagoValidacion.validateAsync(req.body);
    const verificacion = await metoPagoModelo.findOne({medio});
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
 *      description: Edita el nombre de los metodos de pago indicado por medio de su ID.
 *      tags: [METODOS DE PAGO]
 *      parameters:
 *        - in: path
 *          name: IdMetodoDePago
 *          required: true
 *          schema:
 *              type: number
 *              example: 1
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/editmethod'
 *      responses:
 *          201:
 *              description: Se hallo y se actualizao correctamente el metodo de pago
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Metodo de pago actualizado
 *          400:
 *              description: el ID indicado del metodo de pago no existe.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El ID indicado no existe en nuestros metodos de pago.
 * 
 */

router.put("/editarmetodo/:id", async (req, res) => {
    try {
    const { id: _id } = req.params;
    const { medio } = await metodoPagoValidacion.validateAsync(req.body);
    const metPago = await metoPagoModelo.findById({_id});
    if (metPago == null) {
        res.status(400).json('Id de metodo de pago invalido');
    } else {
    const resultado = await metoPagoModelo.findByIdAndUpdate({_id}, {"medio": medio});
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
 * /metodopagos/eliminarmetodo:
 *  delete:
 *      summary: eliminar un metodo de pago del sistema
 *      description: Eliminar metodo de pago de nuestro sistema
 *      tags: [METODOS DE PAGO]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/deletemethod'
 *      responses:
 *          200:
 *              description: Metodo de pago hallado y eliminado
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Metodo de pago eliminado correctamente.
 *          400:
 *              description: Si el ID indicado del metodo de pago no existe.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El ID indicado no existe en nuestros metodos de pago.
 * 
 */
router.delete("/eliminarmetodo/:id", async (req, res) => {
    try {
        const { id: _id } = req.params;
        const metPago = await metoPagoModelo.findOne({_id});
        console.log(metPago)
        if (metPago == null) {
            res.status(400).json('Id de metodo de pago invalido')
        } else {
            const resultado = await metoPagoModelo.findByIdAndDelete({_id});
            res.json(`Se elimino correctamente el metodo de pago ${metPago.medio}`)
            };
            } catch (err) {
                if (err.name == 'CastError') {
                    res.json('Id de metodo de pago invalido')
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
 *      newmethod:
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
 * 
 *      deletemethod:
 *          type: object
 *          require:
 *              - id
 *          properties:
 *              id:
 *                  type: number
 *                  description: Id unico del metodo de pago que se desea eliminar.
 *          example:
 *              id: 1
 * 
 *      editmethod:
 *          type: object
 *          require:
 *              - metodo
 *          properties:
 *              metodo:
 *                  type: string
 *                  description: Nuevo nombre que se le asignara al metodo de pago indicado
 *          example:
 *              metodo: Nequi
 *          
 * 
 */
module.exports = router;