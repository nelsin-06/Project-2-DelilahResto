# ACAMICA SRPINT-PROJETS-2

El sprint-projects-2 de acamica nos proponen realizar una API/REST para un restaurante en las cuales necesitamos cubrir rutas de usuarios(Registro, login y modificacion), productos(Creacion, eliminacion, modificacion y accion de listar), pedidos(Creacion, modificacion, eliminacion y verificion de requisitos antes de realizar nuevas acciones en la pestaña de pedidos) y metodos de pago(Creacion, eliminacion, modificacion y accion de listar).

# PROYECTO 🌎

Acontinuacion se daran las instrucciones generales para la instalacion e inicio de la API.

### Pre-requisitos 🗒️

 1. Node instalado en el equipo con el cual crearemos nuestro entorno de ejecucion.
 2. Base de datos mongo instalada y corriendo en el equipo de prueba.
 3. Gestor de cache "redis" instalado y corriendo en el equipo en el puerto "6379" (Esto si se desea ver el efecto del almacenamiento cache. Si por preferencia lo tiene en otro puerto modificar las variables de entorno de nuestra API en su fichero ".env").
 4. Por cuestiones practicas añadimos el fichero .env a nuestro repositorio con las configuraciones genericas, si por preferencia o si su equipo no le permite iniciar la API con las configuraciones genericas por favor modifique nuestro .env.
 5. Editor de codigo de preferencia.
 6. Navegador web de preferencia(Para las pruebas desde swagger).

 ### Instalación ✔️
Despues de que descargamos el codigo y de estar montado en el editor de codigo instalaremos sus dependencias/librerias de la siguiente forma:
	
    npm init

Iniciamos nuestra API con **"npm start"**. Con este comando nuestra API empezara a correr y si su inicio fue exitoso en la linea de consola nos indicara el puerto en el cual se inicio y un mensaje de confimacion de conexion con la base de datos.

    npm start

## Datos pre-creados para pruebas 🗂️

Para que la prueba se haga mas practica se creo una rutina de creacion de un usuario con permisos de administrador, un producto general y un metodo de pago general con los que se pueden realizar test.

### usuarios

### productos

### metodos de pago

## Instrucciones 📚

Para que la experiencia y entendimiento correcto de la API se debe tener en cuenta:

1. El usuario no podra realizar un nuevo pedido mientras tenga un pedido activo(Todos los pedidos del usuario deben estar en estado "CERRADO").
2. El usuario no podra modificar opciones de su pedido despues de que este a pasado a estado "CONFIRMADO".
3. Para que la funcion de cache de nuestra API sea más perseptible, en el primer llamado a nuestra lista de productos hay un tiempo de respuesta de 3 segundos si este no se a almacenado en cache.
4. La cache de la lista de productos tiene un tiempo de expiracion de 1 minuto.
5. La cache se limpia despues de cada modificacion en las rutas de productos(Solo se limpia pero no se actualiza).
6. Los unicos estado de pedidos admitidos son: PENDIENTE, CONFIRMADO, EN PREPARACION, ENTREGADO y CERRADO. El estado del pedido se debe ingresar en mayuscula.
7. Los usuarios tiene un "ESTADO". El cual nos indica si la cuenta esta activa(True) o se encuentra suspendida(False).
8. Todos los datos que se ingresen en cada una de las rutas tiene validaciones como de sintaxis o si el campo esta vacio.
9. Algunos datos no pueden estar duplicados por lo que tambien existen validaciones para esto.

## Funcionamiento 📈

Acontinuacion se explicara de manera general el funcionamiento de las rutas de nuestra API, si necesita autentifición y/o permisos de administrador.

### usuarios

/registrar = Ruta en donde podremos registrar un usuario nuevo con su respectivo email, username, password, telefono y podremos agregar una direccion a nuestra libreta de direcciones.(auth: NO, Admin: NO)

/ingresar = Ruta en donde podremos ingresar nuestras credenciales para iniciar sesion en nuestra API. Despues de un inicio de sesion exitoso nos devolvera un token con el cual podremos loguearnos en las demas rutas.(auth: NO, Admin: NO)

/micuenta = Ruta en donde podremos obtener los datos de nuestra cuenta.(auth: SI, Admin: NO)

/obtenerusuarios = Ruta en donde podremos obtener la lista con todos los usuarios registrados.(auth: SI, Admin: SI)

/aggdireccion = Ruta en donde podremos agregar a la libreta del usuario una nueva direccion.(auth: SI, Admin: NO)

/deldireccion = Ruta en donde podremos eliminar una direccion de la libreta del usuario.(auth: SI, Admin: NO)

/cambiarestado = Ruta en donde podremos suspender la cuenta de un usuario.(auth: SI, Admin: SI)

### productos

/listaproductos = Ruta en donde listaremos los productos.(auth: SI, Admin: NO)

/edicionproductos = Ruta en donde actualizaremos nombre y/o precio del producto.(auth: SI, Admin: SI)

/eliminarproductos = Ruta en donde podremos eliminar un producto de la lista.(auth: SI, Admin: SI)

/agregarproductos = Ruta en donde podremos agregar un nuevo producto.(auth: SI, Admin: SI)

### metodos de pago

/metodosdepago = Ruta en donde listaremos los metodos de pago disponibles.(auth: SI, Admin: NO)

/agremetodopago = Ruta en donde podremos agregar un nuevo metodo de pago.(auth: SI, Admin: SI)

/editarmetodo = Ruta en donde podremos editar los medios de pago.(auth: SI, Admin: SI)

/eliminarmetodo = Ruta en donde podremos eliminar un medio de pago.(auth: SI, Admin: SI)

### pedidos

/realizarpedido = Ruta en donde podremos realizar un pedido, este tendra en su mayor parte referencias a otras colecciones por medio de _id.(auth: SI, Admin: NO)

/mipedido = Ruta en donde podremos listar todos los pedidos del usuario registrado.(auth: SI, Admin: NO)

/totalpedidos = Ruta en donde podremos listar todos los pedidos de todos los usuarios.(auth: SI, Admin: SI)

/estado = Ruta en donde podremos confirmar nuestro pedido.(auth: SI, Admin: NO)

/estado = Ruta en donde podremos cambiar el estado del pedido del usuario y finalizarlo.(auth: SI, Admin: SI)

/editarpedido = Ruta en donde podremos eliminar un producto de nuestra orden.(auth: SI, Admin: NO)

/editarpedido = Ruta en donde podremos editar la cantidad del producto en la orden.(auth: SI, Admin: NO)

/editarpedido = Ruta en donde podremos agregar un nuevo pedido a nuestra orden.(auth: SI, Admin: NO)

## Ejecucion de pruebas ⚙️

Para realizar las pruebas se utiliza el ambiente grafico SWAGGER, se puede acceder desde el siguiente [LINK](http://localhost:3000/swagger) o ingresando a su navegador de preferencia y llendo a la ruta "http://localhost:3000/swagger"

Si el puerto de inicio de NODE es diferente a "3000" tambien se debe modificar en la ruta al swagger.

## Ejecucion de test 🧪

Este test esta dirigido a las posibles respuesta positivas o negativas que podria recibir la ruta de "REGISTRO DE USUARIOS". 
Podemos ejecutar el test de la siguiente forma:

    npm test

 El test esta implementado con mocha y chai.

## Construido con🛠️
- dotenv
- express
- jsonwebtoken
- express-JWT
- swagger-jsdoc
- swagger-ui-express
- Mongoose
- bcrypt
- mongo
- helmet
- Mocha y chai

## Contruido por 👨‍💻👨‍🍳

**Nelson Stiven Gallego Garcia**
**nelsoncg0611@gmail.com**
**https://www.linkedin.com/in/nelson-gallego-tec-dev**
