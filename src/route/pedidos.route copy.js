const router = require('express').Router();
const { hacerPedidos, variable, obtenerMiPedido, cambiarEstado, cambiarEstadoUser, editarPedido, eliminarProductoDePedido, agregarProductosPedido, todoPedidos} = require("../models/pedidos.model");
// const middlewaresLogin = require("../middlewares/autenticacion.middleware");
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
router.post("/realizarpedido", (req, res) => { //Realizar pedido de usuario logueado.
    const usuario = req.auth.user;
    const { idDepago, direccionDePedido } = req.body;
    const idDeProducto = req.body.pedidos;
    res.json(hacerPedidos(usuario, idDeProducto, idDepago, direccionDePedido))
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
router.get("/mipedido", (req, res) => { //Obtener el pedido de usuario logueado.
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
router.get("/totalpedidos", (req, res) => { //Obtener todos los pedidos (solo admin).
    res.json(todoPedidos());
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
router.post("/estado/:id", (req, res) => {  //Para cambiar estados de pedido (solo admin).
    const { id } = req.params;
    const { estado } = req.body;
    res.json(cambiarEstado(id, estado));
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
router.get("/estado/:id", (req, res) => { //Para cambiar estado a de pedido a confirmado.
    const { id } = req.params;
    res.json(cambiarEstadoUser(id));
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

router.put("/editarpedido/:id", (req, res) => { // para editar el producto en nuestro pedido
    const { id } = req.params; //id de pedido   
    const {pedidos} = req.body;
    res.json(editarPedido(id, pedidos));
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
router.delete("/editarpedido/:idPedido", (req, res) => { //para eliminar productos del pedido.
    const { idPedido } = req.params; // Id del pedido de nuestro usuario 
    const { idproducto } = req.body; // Id del producto que se desea eliminar del pedido de nuestro usuario
    res.json(eliminarProductoDePedido(idPedido, idproducto));

})

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
router.post("/editarpedido/:idPedido", (req, res) => { //para agregar productos al pedido ya creado.
    const { idPedido } = req.params;
    const pedidoCompleto = req.body.pedido;
    res.json(agregarProductosPedido(idPedido, pedidoCompleto));
})

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