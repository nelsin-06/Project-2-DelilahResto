# README DESACTUALIZADO <IGNORAR>
# ACAMICA SRPINT-PROJETS-1

El sprint-projects-1 de acamica nos proponen realizar los end-points para nuestra tienda denominada "Delilah Restó", donde sus primordialidades son **Registro de usuarios, Productos, Pedidos** tambien se agregan end-points de **Metodos de pago** que a lo largo del desarrollo se ven necesarios.

# Proyecto 🌎

Estas instrucciones nos daran acceso a una copia del proyecto en la maquina local la cual funcionara para hacer pruebas.

### Pre-requisitos 🗒️

 1. Express en el equipo.
 2. Editor de codigo de preferencia.

### Instalación ✔️
Despues de que descargamos el codigo y de estar montado en el editor de codigo instalaremos sus dependencias/librerias de la siguiente forma.
	
	npm intall
	
Instalaremos "Nodemon" el cual nos creara un servidor local que nos 
ayudara a hacer el test desde nuestro equipo. Se instala asi:

	npm install -g nodemon

y ejecutamos en nuestro index asi:

	nodemon index.js


## Datos para pruebas 🗂️

#### usuarios
ADMIN:
correo: soyadmin@gmail.com
contraseña: 12345
id: fijo

USUARIO NORMAL:
correo: correo1@gmail.com
contraseña: 12345
id: azar
#### pedido
Existe un pedido predefinido para pruebas, sus caracteristicas son:

 1. Su id_pedido es 999
 2. Su estado es "Cerrado"
 3. En su orden tiene 2 productos
 4. El pedido le pertenece al usuario con correo "correo1@gmail.com"

Si se desea saber más informacion sobre este pedido se hace login con el correo mensionado anteriormente y se dirigira al end-point "mipedido".(Se explica más a detalle en el siguiente titulo).

#### productos

Existen 2 productos cuyo Id es fijo por cuestion de pruebas a la API y documentacion, estos productos son:

>"nombre":  "Botella CocaCola ZERO"
"id":  96
"nombre":  "Hamburguesa con pollo y mayonesa",
"id":  200

Sus Id nunca cambiaran, caso contrario con los otros dos productos predefinidos y productos nuevos cuyo id siempre sera al azar.

#### metodos de pago
Existe un metodo de pago con Id fijo por cuestion de pruebas a la API y su documentacion:

>"medio":  "Efectivo",
"id":  1

Su Id nunca cambiara, caso contrario a los demas metodos de pago predefinidos o metodos de pago nuevo cuyo Id siempre sera al azar.


## Instrucciones especificas de pedidos

Para el correcto funcionamiento se debe tener en cuenta que:
 
 - El usuario puede modificar su pedido mientras el "Estado_pedido" se encuentre en pendiente, en el momento donde el estado del pedido cambie no se podra realizar ninguna modificación.
 - Si el pedido en proceso, su "Estado_pedido" se encuentra en algun valor diferente a "Cerrado" no se le permitira realizar un pedido nuevo hasta que este "Estado_pedido" no sea cambiado a "Cerrado"

## Ejecución de pruebas⚙️
A continuacion se explicada de manera general la funcionalidad y que tener en cuenta para la correcta funcionalidad de cada End-point de nuestra API.
Para la ejecución de pruebas en la API realizamos toda la documentacion en swagger.
Si tienes el servidor "Nodemon" ejecutando nuestro "index.js" puedes acceder a la documentacion desde el siguiente [LINK](http://localhost:3000/swagger)

En el apartado de /PEDIDO/ESTADO/{IdDePedido} el cual solo puede ejecutar un usuario administrador, los estados disponibles y que acepta la API son los siguientes:

 - Pendiente (Pretederminado cuando el pedido esta recien creado).
 - Confirmado (El usuario pasa su pedido a confirmado y con esto pierde la posibilidad de modificar su pedido).
 - En preparacion (El usuario administrador asigna este estado para cuando el pedido este en preparacion).
 - Entregado (El usuario administrador asigna este estado para cuando el pedido se haya entregado)
 - Cerrado (Cuando el pedido se entrego correctamente su estado pasa a cerrado y con esto el usuario puede volver a realizar pedidos).


**Los estados se deben declarar tal cual estan listados arriba para el correcto funcionamiento** 

Las solicitudes que necesitan de permisos de administrador son:
Usuarios:
	- Obtener lista de usuarios

Productos:
	- Agregar producto
	- Eliminar producto
	- Modificar nombre y precio de producto

Pedidos:
	- Obtener el total de los pedidos
	- Cambio de estado del estado del cliente

Metodos de pago:
	- agregar metodo de pago nuevo
	- Modificar metodo de pago
	- eliminar metodo de pago


## Construido con🛠️
- dotenv
- express
- express-basic-auth
- swagger-jsdoc
- swagger-ui-express

## Contruido por 👨‍💻👨‍🍳

**Nelson Stiven Gallego Garcia**
**nelsoncg0611@gmail.com**
