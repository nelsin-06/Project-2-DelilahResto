const router = require('express').Router();
const productoModelo = require('../models/producto.model');
const validationProduct = require('../Schemas_joi/Productos/producto.Schema');
const esAdmin = require('../middlewares/esAdmin');
const cache = require('../middlewares/cache.productos');
const redis = require('redis');
const clienteRedis = redis.createClient(6379);

/**
 * @swagger
 * /productos/listaproductos:
 *  get:
 *      summary: Obtener todos los productos disponibles.
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

router.get("/listaproductos", cache, async (req, res) => {
    const productos = await productoModelo.find();
    clienteRedis.setex('PRODUCTOS', 20, JSON.stringify(productos));
    setTimeout(() => { res.json(productos); }, 4000);
});

/**
 * @swagger
 * /productos/edicionproductos/{IdDeProducto}:
 *  put:
 *      summary: Edita el nombre y/o el precio de un producto ya creado.
 *      description: Edita el nombre y/o el precio de un producto ya creado por medio de su Id.
 *      tags: [PRODUCTOS]
 *      parameters:
 *        - in: path
 *          name: IdDeProducto
 *          required: true
 *          schema:
 *              type: number
 *              example: asd123
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/editproduct'
 *      responses:
 *          201:
 *              description: Actualizacion de producto exitosa.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: "Producto actualizado Nombre: Pollo, Precio: 5200"          
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Id de producto invalido - Precio invalido - Nombre de producto invalido
 */
router.put("/edicionproductos/:id", esAdmin, async (req, res) => { //Actualizar un producto ya creado
    try {
        const { id: _id } = req.params;
        const { nombre, precio } = await validationProduct.validateAsync(req.body);
        const prodActualizado = await productoModelo.findByIdAndUpdate(_id, { nombre, precio });
        if (prodActualizado == null) {
            res.status(400).json("Id de producto invalido");
        } else {
            clienteRedis.del('PRODUCTOS');
            res.json(`Producto actualizado: Nombre: ${nombre}, Precio: ${precio}`);
        };
    } catch (err) {
        if (err.name == "CastError") {
            res.status(400).json("Id de producto invalido");
        } else if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500")
        } else { res.status(400).json(err.details[0].message) };
    };
});

/**
 * @swagger
 * /productos/eliminarproductos/{IdDeProducto}:
 *  delete:
 *      summary: Eliminar un producto del sistema.
 *      description: eliminar un producto por medio de su id.
 *      tags: [PRODUCTOS]
 *      parameters:
 *        - in: path
 *          name: IdDeProducto
 *          required: true
 *          schema:
 *              type: string
 *              example: asd123
 *      responses:
 *          201:
 *              description: Eliminacion de producto exitosa.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Se elimino satisfactoriamente el producto CocaCola con el precio de 3200
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Id de producto invalido - El id invalido del producto a eliminar es invalido.
 */
router.delete("/eliminarproductos/:id", esAdmin, async (req, res) => { //Eliminar un producto de la lista
    try {
        const { id: _id } = req.params;
        const { nombre, precio } = await productoModelo.findByIdAndDelete({ _id });
        if (nombre == undefined) {
            res.json("Id de producto invalido");
        } else {
            clienteRedis.del('PRODUCTOS');
            res.status(201).json(`Se elimino satisfactoriamente el producto ${nombre} con el precio de ${precio}`)
        };
    } catch (err) {
        res.status(400).json("El id es invalido del producto a eliminar es invalido")
    };
});

/**
 * @swagger
 * /productos/agregarproductos:
 *  post:
 *      summary: Ingresar un nuevo producto al sistema
 *      description: Ingresar un producto nuevo al sistema indicando su nombre y su precio.
 *      tags: [PRODUCTOS]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/agregarproductos'
 *      responses:
 *          201:
 *              description: El producto Sandwitch de pollo apanado fue creado exitosamente
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Producto creado exitosamente
 *          400:
 *              description: Posibles errores lanzados por la API por incidencias en la sintaxis y/o requisitos necesarios para realizar la solicitud. 
 *              content:
 *                  json:
 *                      schema:
 *                          type: string
 *                          example: El producto ya se encuentra registrado - Nombre de produco invalido - precio de producto invalido.
 *          
 */
router.post("/agregarproductos", async (req, res) => { //Creando un producto nuevo
    try {
        const { nombre, precio } = await validationProduct.validateAsync(req.body);
        const productDB = await productoModelo.findOne({ nombre });
        if (productDB == null) {
            const productNew = await new productoModelo({
                nombre,
                precio,
            });
            await productNew.save();
            clienteRedis.del('PRODUCTOS');
            res.status(200).json("El producto " + nombre + " Fue creado exitosamente");
        } else { res.status(400).json("El producto ya se encuentra registrado") };
    } catch (err) {
        if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500");
        } else {
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
 *                  description: Nombre del producto.
 *              id:
 *                  type: string
 *                  description: Id unico del productos.
 *              precio:
 *                  type: number
 *                  description: Precio del producto.
 *          example:
 *              nombre: CocaCola
 *              id: "asd123"
 *              precio: 2200
 * 
 *      agregarproductos:
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
 *                  description: Precio del producto a crear.
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
 *                  description: Nombre del producto a actualizar.
 *              precio:
 *                  type: number
 *                  description: Precio en pesos del producto actualizar.
 *          example:
 *              nombre: Pollo
 *              precio: 5300
 */
module.exports = router;