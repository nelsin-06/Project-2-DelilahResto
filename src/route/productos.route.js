const router = require('express').Router();
const productoModelo = require('../models/producto.model');
const validationProduct = require('../Schemas_joi/Productos/producto.Schema');
//const validationEditProduct = require('../Schemas_joi/Productos/EdicionProducto');
const esAdmin = require('../middlewares/esAdmin');

/**
 * @swagger
 * /productos/listaproductos:
 *  get:
 *      summary: Obtener todos los productos disponibles
 *      tags: [PRODUCTOS]
 *      schema:
 *      responses:
 *          200:
 *              description: Lista de productos.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/obtenerproductos'
 */

router.get("/listaproductos", async (req, res) =>{
res.json(await productoModelo.find());
});

/**
 * @swagger
 * /productos/edicionproductos/{IdDeProducto}:
 *  put:
 *      summary: Edita el nombre y/o el precio de un producto ya creado.
 *      description: Edita el nombre y/o el precio de un producto ya creado por medio de su ID.
 *      tags: [PRODUCTOS]
 *      parameters:
 *        - in: path
 *          name: IdDeProducto
 *          required: true
 *          schema:
 *              type: number
 *              example: 96
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/editproduct'
 *      responses:
 *          200:
 *              description: El id de producto indicado no corresponde a ningun producto de la lista
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El ID del producto a modificar no existe
 *          
 *          201:
 *              description: Se a modificado el producto indicado por ID exitosamente
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: producto actualizado correctamente.
 *          400:
 *              description: Se a enviado datos con tipo erroneo en el body - bad request
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El precio del producto debe ser un numero y el nombre del producto debe ser una string.
 */
router.put("/edicionproductos/:id", esAdmin,async (req, res) => { //Actualizar un producto ya creado
    try {
    const { id:_id } = req.params;
    const { nombre, precio } = await validationProduct.validateAsync(req.body);
        const prodActualizado = await productoModelo.findByIdAndUpdate(_id, {nombre, precio});
        if (prodActualizado == null){
            res.status(400).json("Id de producto invalido");
        } else {
        res.json(`Producto actualizado: Nombre: ${nombre}, Precio: ${precio}`);
    };
    } catch(err) {
        console.log(err)
        if (err.name == "CastError"){
            res.status(400).json("Id de producto invalido");
        } else if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500")
        } else { res.status(400).json(err.details[0].message)};
    };
});

/**
 * @swagger
 * /productos/eliminarproductos/{IdDeProducto}:
 *  delete:
 *      summary: Eliminar un producto del sistema.
 *      description: eliminar un producto por medio de su ID.
 *      tags: [PRODUCTOS]
 *      parameters:
 *        - in: path
 *          name: IdDeProducto
 *          required: true
 *          schema:
 *              type: number
 *              example: 96
 *      responses:
 *          200:
 *              description: El producto (nombre de producto) fue eliminado correctamente
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El producto fue eliminado correctamente
 *          403:
 *              description: ID invalido
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El ID indicado no corresponde a ningun producto.
 */
router.delete("/eliminarproductos/:id", esAdmin, async (req, res) => { //Eliminar un producto de la lista
    try {
        const { id:_id } = req.params;
        const {nombre, precio} = await productoModelo.findByIdAndDelete({ _id });
        if (nombre == undefined){
            res.json("No se encontro el producto indicado por id");
        } else {res.json(`Se elimino satisfactoriamente el producto ${nombre} con el precio de ${precio}`)};
    } catch(err) {
        res.status(400).json("El id es invalido del producto a eliminar es invalido")
//console.error(`ERROR AL ELIMINAR >>>>>>>>>>>>>>>>>>>>>>>> ${err}`);
    };
});

/**
 * @swagger
 * /productos/agregarproductos:
 *  post:
 *      summary: Ingresar un nuevo producto al sistema
 *      description: Ingresar los datos validos y necesarios para crear el producto
 *      tags: [PRODUCTOS]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/newproduct'
 *      responses:
 *          201:
 *              description: Producto creado y agregado a la lista exitosamente
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Producto creado exitosamente
 *          200:
 *              description: Este producto ya existe en nuestro sistema.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Este producto ya existe en nuestro sistema.
 *          400:
 *              description: Bad request - cuando el usuario ingresa un string en el campo de "precio" 
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El nombre del producto debe ser un string y el precio un numero.
 *          
 */
router.post("/agregarproductos", esAdmin, async (req, res) => { //Creando un producto nuevo
    try {
        const { nombre, precio } = await validationProduct.validateAsync(req.body);
        const productDB = await productoModelo.findOne({nombre});
        if (productDB == null){
            const productNew = await new productoModelo ({
                nombre, 
                precio,
            });
            await productNew.save();
            res.status(200).json("El producto " + nombre + " Fue creado exitosamente");
        } else {res.status(400).json("El producto ya se encuentra registrado")};
    } catch (err) {
//console.log("ERROR AL CREAR PRODUCTO>>>>>>>>>>>>>" + err);
        if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500");
        } else{ 
            res.status(400).json(err.details[0].message);
        }
    };
});

/**
 * @swagger
 * tags:
 *  name: PRODUCTOS
 *  description: Seccion dedicada a "PRODUCTOS"
 * 
 * components:
 *  schemas:
 *      obtenerproductos:
 *          type: object
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: Nombre del producto
 *              id:
 *                  type: number
 *                  description: ID unico de nuestros productos
 *              precio:
 *                  type: number
 *                  description: Precio en pesos colombianos de nuestro producto
 *          example:
 *              nombre: Botella de bebida gaseosa CocaCola
 *              id: 96
 *              precio: 2200
 *      newproduct:
 *          type: object
 *          required:
 *              - nombre
 *              - precio
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: Nombre del producto a crear.
 *              precio:
 *                  type: number
 *                  description: Precio en pesos del producto a crear
 *          example:
 *              nombre: Sandwitch de pollo apanado
 *              precio: 5500
 * 
 *      editproduct:
 *          type: object
 *          required:
 *              - nombre
 *              - precio
 *          properties:
 *              nombre:
 *                  type: string
 *                  description: Nombre del producto a crear.
 *              precio:
 *                  type: number
 *                  description: Precio en pesos del producto a crear
 *          example:
 *              nombre: Ensalada de frutas con helado de brownie
 *              precio: 8000
 *      deleteproduct:
 *          type: object
 *          require:
 */
module.exports = router;