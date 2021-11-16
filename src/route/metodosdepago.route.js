const express = require('express');
const router = express.Router();
const metoPagoModelo = require("../models/metodospago.models");
const {obtenerMediosPago, aggMetodo, editarmetodo, eliminarMetodo } = require("../models/metodospago.models");
const middlewaresLogin = require("../middlewares/autenticacion.middleware");
const { esAdmin } = require("../middlewares/esAdmin.middleware");

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
  });


/*process.on('unhandledRejection', (error, p) => {
    console.log('=== UNHANDLED REJECTION ===');
    console.dir(error.stack);
  });
*/

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
    const { medio } = req.body;
    if (medio){
        try {
            const metNew = await new metoPagoModelo({
                medio
            });
        await metNew.save()
        res.json(metNew)
        } catch (err) {
            console.log(`ERROR AL AGREGAR METODO DE PAGO >>>>>>>>>>>>>>>>>>>> ${err}`);
            res.json("El metodo de pago ya existe, los metodos de pago deben ser unicos")
        }
    } else (res.json("Debe ingresar un metodo de pago"));
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
    const { id } = req.params;
    const { medio } = req.body;
    if (medio) {
        try {
            await metoPagoModelo.findById(id, medio);
            res.json(`Se actualizo correctamente el medio de pago a ${medio}`)
        } catch(err) {
        if(err.name == "MongoError"){
            res.json("Los nombres de los medios de pago no pueden estar duplicados");
            console.error(`ERROR AL ACTUALIZAR >>>>>>>>>>>>>>>>>>>>>>>> ${err}`);
        } else if (err.name == "CastError") {
            res.json("No se encontro el producto indicado por id");
            console.error(`ERROR AL ACTUALIZAR >>>>>>>>>>>>>>>>>>>>>>>> ${err}`);
        } else {
            res.json("EROR INTERNO DEL SERVIDOR")
            console.error(`ERROR AL ACTUALIZAR >>>>>>>>>>>>>>>>>>>>>>>> ${err}`);}
        }
    } else {res.json("Se debe ingresar el medio de pago actualizado")};
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
    const { id } = req.params;
    try {
        const metDelete = await metoPagoModelo.findByIdAndDelete({"_id": id});
        if (metDelete == undefined) {
            res.json("No se encontro el metodo de pago indicado por id");
        } res.json(`Se elimino satisfactoriamente el metodo de pago ${metDelete.medio}`);
    } catch (err) {
        console.error(`ERROR AL ELIMINAR METODO DE PAGO >>>>>>>>>>>>>> ${err}`);
        res.json("No se encontro el metodo de pago indicado por id");
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