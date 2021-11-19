const router = require('express').Router();
const pedidoValidation = require("../Schemas_joi/pedidos/pedidosCrear.Schema");
const pedidoEditValidation = require('../Schemas_joi/pedidos/pedidoEdit.Schemas');
const pedidoDelValidacion = require('../Schemas_joi/pedidos/pedidoDeleProdc.Schema');
const modificarCantidadProducto = require("../helpers/modificarCantidad");
const actualizarPrecioTotal = require("../helpers/precioTotal");
const eliminarProductoDeOrden = require("../helpers/elimiProdtoOrden");
const existeProductoEnLaOrden = require("../helpers/existeElProductoEnLaOrden");
const hallarDireccionUser = require('../helpers/hallarDireccion');
const metoPagoModelo = require('../models/metodospago.models');
const pedidoModelo = require('../models/pedidos.model');
const usuarioModelo = require('../models/usuario.model');
const productoModelo = require('../models/producto.model');
//const middlewaresLogin = require("../middlewares/autenticacion.middleware");
//const { esAdmin } = require("../middlewares/esAdmin.middleware");

/**
 * @swagger
 * /pedidos/realizarpedido:
 *  post:
 *      summary: Realizar un pedido
 *      description: Realice un pedido indicando id, cantidad de producto y elija su tipo de pago. 
 *      tags: [PEDIDOS]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/makeorder'
 *      responses:
 *          201:
 *              description: Pedido (#pedido) creado exitosamente
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Pedido creado exitosamente
 *          200:
 *              description: Ya tiene un pedido en estado "Pendiente", por ende no puede realizar un nuevo pedido.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Ya tiene un pedido en proceso
 *          400:
 *              description: Si se ingresa un ID de producto incorrecto
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El ID no existe en nuestros productos
 *          404:
 *              description: Si se ingresa un ID de pago inexistente
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El ID de pago no es correcto
 *
 */

router.post("/realizarpedido", async (req, res) => { //REALIZAR UN PEDIDO (USUARIO LOGUEADO)
    try{
    //const usuario = req.auth.user;
    const {id_producto, cantidad, id_direccion, id_metodo_pago} = await pedidoValidation.validateAsync(req.body);
    const datosPago = await metoPagoModelo.findById({"_id": id_metodo_pago});
    if (datosPago == null){
        res.status(400).json("No hallamos el metodo de pago");
    } 
    else {
    const datosUsuario = await usuarioModelo.findOne({"email": "11correoprueba4@gmail.com"});
    if (datosUsuario == null) {
        res.status(400).json("No hallamos el usuario");
    } 
    else {
    const direccionReal = hallarDireccionUser(datosUsuario.direccion, id_direccion);
    if (direccionReal == false){
        res.status(400).json("No hallamos la direccion");
    } 
    else {
    const datosproducto = await productoModelo.findById({"_id": id_producto});
    if (datosproducto == null) {
        res.status(400).json("No hallamos el producto");
    } 
    else {
    const precioTotal = datosproducto.precio * cantidad;
    const nuevoPedido = await new pedidoModelo ({
        "usuario": datosUsuario,
        "orden": {
            "_id": datosproducto._id,
            "nombre": datosproducto.nombre,
            "precio": datosproducto.precio,
            "cantidad": cantidad
        },
        "precio_total": precioTotal,
        "direccion_pedido": direccionReal,
        "metodo_pago": datosPago
    });
    await nuevoPedido.save()
    res.json(nuevoPedido);
}}}};
    } catch (err) {
        if (err.details == undefined){
            res.json("INTERNAL ERRRO_500")
        } else {
            res.json(err.details[0].message)
        }
    };
});
/**
 * @swagger
 * /pedidos/mipedido:
 *  get:
 *      summary: Obtener mis pedidos
 *      description: Se obtiene la lista con todos los pedidos que a realizado el usuario logueado
 *      tags: [PEDIDOS]
 *      schema:
 *      responses:
 *          200:
 *              description: Lista de mis pedidos.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/obtenermipedido'
 */
router.get("/mipedido", (req, res) => { //OBTENER MIS PEDIDOS (USUARIO LOGUEADO)
    const usuario = req.auth.user;
    obtenerMiPedido(usuario)
    res.json(obtenerMiPedido(usuario))
});

/**
 * @swagger
 * /pedidos/totalpedidos:
 *  get:
 *      summary: Obtener todos los pedidos de todos los usuarios
 *      description: Se obtiene una lista con todos los pedidos de todos los usuarios.
 *      tags: [PEDIDOS]
 *      schema:
 *      responses:
 *          200:
 *              description: Lista de todos los pedidos pedidos.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/totalpedidos'
 */
router.get("/totalpedidos", async (req, res) => { //ObBTENER TODOS LOS PEDIDO (ADMIN)
    res.json(await pedidoModelo.find());
});

/**
 * @swagger
 * /pedidos/estado/{IdDePedido}:
 *  post:
 *      summary: Cambiar el estado del pedido de un cliente.(ADMIN)
 *      description: Se cambiara el "Estado del pedido" al que el administrador indique
 *      tags: [PEDIDOS]
 *      parameters:
 *        - in: path
 *          name: IdDePedido
 *          required: true
 *          schema:
 *              type: number
 *              example: 999
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/edit_estageAdmin'
 *      responses:
 *          200:
 *              description:
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Estado del pedido actualizado.
 *          404:
 *              description: bad request
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El ID indicado no corresponde a ningun pedido.
 */
//pendiente, confirmado, en preparacion, entregado, cerrado
router.post("/estado/:idpedido", async (req, res) => {  //CAMBIAR EL ESTADO DEL PEDIDO (ADMIN).
    try {
        const { idpedido: _id } = req.params;
        const { estado } = req.body;
        if (estado == "PENDIENTE" || estado == "CONFIRMADO" || estado == "EN PREPARACION" || estado == "ENTREGADO" || estado == "CERRADO"){
            const pedido = await pedidoModelo.findById({_id});
            pedido.estado_pedido = estado;
            await pedido.save()
            res.json(`El estado del pedido cambio a: ${estado}`);
        } else {
            res.status(400).json("Los estados de pedido validos son: CONFIRMADO, PENDIENTE, EN PREPARACION, ENTREGADO, CERRADO");
        }
    } catch (err) {
        console.log(err)
        res.json("No se hallo el pedido");
    };
});
/**
 * @swagger
 * /pedidos/estado/{IdDePedido}:
 *  get:
 *      summary: Confirmar, enviar y cambiar de estado mi pedido.
 *      description: El estao del pedido indicado pasa a "Confirmado" y se empieza a preparar
 *      tags: [PEDIDOS]
 *      parameters:
 *        - in: path
 *          name: IdDePedido
 *          required: true
 *          schema:
 *              type: number
 *              example: 999
 *      schema:
 *      responses:
 *          201:
 *              description: El estado del pedido paso a confirmado
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El estado del pedido paso a confirmado
 *          200:
 *              description: Este pedido ya esta confirmado.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Este pedido ya esta confirmado.
 *          404:
 *              description: El ID del pedido indicado no existe.
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El ID del pedido indicado no existe.
 */
router.get("/estado/:idpedido", async (req, res) => { //CAMBIAR ESTADO DEL PEDIDO A CONFIRMADO.
    try {
    const { idpedido: _id } = req.params;
        const pedido = await pedidoModelo.findById({_id});
        pedido.estado_pedido = "CONFIRMADO";
        pedido.save();
        res.status(201).json("El estado del pedido paso a CONFIRMADO");
    } catch (err) {
        res.status(400).json("No se hallo el pedido")
    };
});

/**
 * @swagger
 * /pedidos/editarpedido/{IdDePedido}:
 *  put:
 *      summary: Editar la cantidad de un producto en nuestra orden.
 *      description: Editar la cantidad de un producto indicado por ID de nuestro pedido indicado por IdDePedido.
 *      tags: [PEDIDOS]
 *      parameters:
 *        - in: path
 *          name: IdDePedido
 *          required: true
 *          schema:
 *              type: number
 *              example: 999
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/editarProductoOrden'
 *      responses:
 *          400:
 *              description: bad request - ID invalido en alguno de los campos 
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example:
 *                              No hallamos el ID de pedido indicado.
 * 
 *                              No hallamos el ID del producto a modificar.
 * 
 *          201:
 *              description: La cantidad del producto fue actualizada 
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example:
 *                               Cantidad modificada exitosamente.
 *          200:
 *              description: Si el pedido en se encuentra en un estado diferente a "Pendiente" 
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example:
 *                               Su pedido esta en estado confirmado por ende no se puede modificar
 *  
 *          
 */         

router.put("/editarpedido/:idpedido", async (req, res) => { // MODIFICAR LA CANTIDAD DE UN PRODUCTO EN NUESTRO PEDIDO
    try {
    const { idpedido: _id } = req.params;
    const { idproducto, cantidadproducto } = await pedidoEditValidation.validateAsync(req.body);
    const pedido = await pedidoModelo.findById({_id});
    if (pedido == null) {
        res.status(400).json("Ingrese un id de pedido valido")
    } else {
    const validacion = modificarCantidadProducto(pedido, idproducto, cantidadproducto);
    if (validacion == false){
        res.status(400).json("No se hallo el producto en nuestro pedido");
    } else {
        pedido.save()
        res.status(201).json("Cantidad de producto modificada");
    };
}
    } catch (err) {
        if (err.name == "CastError") {
            res.status(400).json("Ingrese un id de pedido valido");
        } else if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500");
        } else{ 
            res.status(400).json(err.details[0].message);
        };
    };
});

/**
 * @swagger
 * /pedidos/editarpedido/{IdDepedido}:
 *  delete:
 *      summary: Eliminar un producto de nuestra orden en el pedido
 *      description: eliminar un producto ya agregado de nuestra orden de un pedido indicado por IdDePedido.
 *      tags: [PEDIDOS]
 *      parameters:
 *        - in: path
 *          name: IdDepedido
 *          required: true
 *          schema:
 *              type: number
 *              example: 999
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/eliminarProductoDeOrden'
 *      responses:
 *          201:
 *              description: Se hallo y se elimino correctamente el producto 
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Producto (Nombre del producto) fue eliminado correctamente del pedido
 *          400:
 *              description: ID invalido
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El ID de pedido indicado no es correcto o no existe
 * 
 *                                  El ID del producto a eliminar es invalido o no existe
 *          200:
 *              description: Si el pedido en se encuentra en un estado diferente a "Pendiente" 
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example:
 *                               Su pedido esta en estado confirmado por ende no se puede modificar
 *  
 *          
 */
 router.delete("/editarpedido/:idpedido", async (req, res) => { //ELIMINAR PRODUCTOS DE UN PEDIDO.
    try {
        const { idpedido } = req.params;
        const { idproducto } = pedidoDelValidacion.validateAsync(req.body);
        const pedido = await pedidoModelo.findById({"_id": idpedido});
        const resultado = eliminarProductoDeOrden(pedido.orden, idproducto);
        if (resultado == false ){
                res.json('No hallamos el producto en el pedido');
        } else {
            actualizarPrecioTotal(pedido);
            await pedido.save();
            res.json("Producto eliminado correctamente");
        };
    } catch (err) { 
        if (err.name == "CastError") {
            res.status(400).json("Ingrese un id de pedido valido");
        } else if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500");
        } else{ 
            res.status(400).json(err.details[0].message);
        };
}});

/**
 * @swagger
 * /pedidos/editarpedido/{IdDepedido}:
 *  post:
 *      summary: Agregar un producto a nuestro pedido ya creado.
 *      description: Agregar un producto indicado por ID y su cantidad a un pedido ya creado indicado por IdDePedido  
 *      tags: [PEDIDOS]
 *      parameters:
 *        - in: path
 *          name: IdDepedido
 *          required: true
 *          schema:
 *              type: number
 *              example: 999
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/agregarProductoEnOrden'
 *      responses:
 *          201:
 *              description: Se hallo y se agrego correctamente el producto y su cantidad
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Se añadio correctamente el producto a tu pedido.
 *          200:
 *              description: Si el producto a ingresar ya esta en nuestra orden, lo unico que se modifica es su cantidad en la orden principal
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: Se agrego la cantidad deseada a tu producto ya que ya existe en tu pedido.
 *          
 *          400:
 *              description: ID invalido
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example: El ID de pedido indicado no es correcto.
 * 
 *                                   El producto indicado por ID no existe.
 * 
 *          200-1:
 *              description: Si el pedido en se encuentra en un estado diferente a "Pendiente" 
 *              content:
 *                  text/plain:
 *                      schema:
 *                          type: string
 *                          example:
 *                               Su pedido esta en estado confirmado por ende no se puede modificar
 *  
 *
 */
router.post("/editarpedido/:idPedido", async (req, res) => { //AGREGAR PRODUCTOS NUEVOS A PEDIDO.
    try {
    const { idPedido: _id } = req.params;
    const { idproducto, cantidadproducto: cantidad } = await pedidoEditValidation.validateAsync(req.body);
        const pedido = await pedidoModelo.findById({_id});
        const producto = await productoModelo.findById({"_id": idproducto})
        if(producto == null){
            res.status(400).json("No hallamos el producto en el pedido");
        } else {
        const validacion = existeProductoEnLaOrden(pedido, producto.nombre, cantidad);
        if (validacion !== false){
            await pedido.save()
            res.json("El producto ya se encuentra en el pedido, cantidad aumentada correctamente");
        } else { 
        pedido.precio_total += producto.precio * cantidad;
        const objProducto = ({
            "_id": producto._id,
            "nombre": producto.nombre,
            "precio": producto.precio,
            "cantidad": cantidad
        });
        pedido.orden.push(objProducto);
        actualizarPrecioTotal(pedido);
        await pedido.save();
        res.json("Producto agregado correctamente al pedido");
        };};
    } catch (err) {
        if (err.name == "CastError") {
            res.status(400).json("Ingrese un id de pedido valido");
        } else if (err.details == undefined) {
            res.status(500).json("INTERNAL SERVER_ERROR=500");
        } else{ 
            res.status(400).json(err.details[0].message);
        };
    };
});
/**
 * @swagger
 * tags:
 *  name: PEDIDOS
 *  description: Seccion dedicada a "PEDIDOS"
 * 
 * components:
 *  schemas:
 *      obtenermipedido:
 *          type: object
 *          properties:
 *              usuario:
 *                  type: string
 *                  description: Nombre del producto
 *              id_usuario:
 *                  type: number
 *                  description: ID unico de nuestros productos
 *              id_pedido:
 *                  type: number
 *                  description: Precio en pesos colombianos de nuestro producto
 *              orden:
 *                  type: array
 *                  description: Precio en pesos colombianos de nuestro producto
 *              precio_total:
 *                  type: number
 *                  description: asdf
 *              direccion_Pedido:
 *                  type: number
 *                  description: Precio en pesos colombianos de nuestro producto
 *              metodo_pago:
 *                  type: object
 *                  description: Precio en pesos colombianos de nuestro producto
 *          example:
 *              usuario: usuario1
 *              id_usuario: 1626319469087
 *              id_pedido: 999
 *              orden:
 *                  nombre: Botella de Cocacola
 *                  id: 96
 *                  precio: 2200
 *                  cantidad: 1
 *              precio_total: 2200
 *              direccion_Pedido: calle 1 #1-2
 *              estado_Pedido: Cerrado
 *              metodo_Pago:
 *                  medio: Efectivo
 *                  id: 1
 *          
 *      totalpedidos:
 *          type: object
 *          properties:
 *              usuario:
 *                  type: string
 *                  description: Nombre del producto
 *              id_usuario:
 *                  type: number
 *                  description: ID unico de nuestros productos
 *              id_pedido:
 *                  type: number
 *                  description: Precio en pesos colombianos de nuestro producto
 *              orden:
 *                  type: array
 *                  description: Precio en pesos colombianos de nuestro producto
 *              precio_total:
 *                  type: number
 *                  description: asdf
 *              direccion_Pedido:
 *                  type: number
 *                  description: Precio en pesos colombianos de nuestro producto
 *              metodo_pago:
 *                  type: object
 *                  description: Precio en pesos colombianos de nuestro producto
 *          example:
 *              usuario: usuario1
 *              id_usuario: 1626319469087
 *              id_pedido: 999
 *              orden:
 *                  nombre: Botella de Cocacola
 *                  id: 96
 *                  precio: 2200
 *                  cantidad: 1
 *              precio_total: 2200
 *              direccion_Pedido: calle 1 #1-2
 *              estado_Pedido: Cerrado
 *              metodo_Pago:
 *                  medio: Efectivo
 *                  id: 1
 *      makeorder:
 *          type: object
 *          required:
 *              - pedidos
 *              - idDepago
 *              - direccionDePedido 
 *          properties:
 *              pedidos:
 *                  type: array
 *                  description: array con ID del producto y cantidad del producto
 *                  id:
 *                      type: number
 *                      description: ID de producto a ordenar.
 *                  cantidad:
 *                      type: number
 *                      description: cantidad del producto que desea.
 *              idDepago:
 *                  type: number
 *                  description: ID del metodo de pago que se desea utilizar
 *              direccionDePedido:
 *                  type: string
 *                  description: Direccion del pedido
 *          example:
 *              pedidos: [{id: 96, cantidad: 2}, {id: 200, cantidad: 1}]
 *              idDepago: 1
 *              direccionDePedido: carrera 20 #15-12
 *      edit_estageAdmin:
 *          type: object
 *          required:
 *              - estado
 *          properties:
 *              estado:
 *                  type: string
 *                  description: Indico el estado al que quiero que pase el pedido del usuario.
 * 
 *                  estados posibles: En preparacion, enviado, cerrado.
 *          example:
 *              estado: "Enviado"
 *      
 *      editarProductoOrden:
 *          type: object
 *          require:
 *              - pedidos
 *          properties:
 *              pedidos:
 *                  type: object
 *                  description: Se ingresa el ID del producto al que se le desea modificar la cantidad en nuestra orden.
 *                  id:
 *                      type: number
 *                      description: ID del producto al cual le queremos modificar la cantidad en nuestra orden
 *                  cantidad:
 *                      type: number
 *                      description: La nueva cantidad que deseamos del producto indicado con ID
 *          example:
 *              pedidos: {"id": 96, "cantidad": 5}
 *      
 *      eliminarProductoDeOrden:
 *          type: object
 *          require:
 *              - idproducto
 *          properties:
 *              idproducto:
 *                  type: number
 *                  description: Indicamos el ID del producto que deseamos eliminar de nuestra orden
 *          example:
 *              idproducto: 96
 *      
 *      agregarProductoEnOrden:
 *          type: object
 *          require: 
 *              - pedido
 *          properties:
 *              Pedido:
 *                  type: object
 *                  description: Objeto con Id indicando que producto queremos agregar y la cantidad deseada
 *                  id:
 *                      type: number
 *                      description: Id indicando que producto deseamos agregar
 *                  cantidad:
 *                      type: number
 *                      description: Cantidad del producto que deseamos agregar
 *          example:
 *              pedido: {id: 200, cantidad: 10}
 *                      
 */         

module.exports = router;