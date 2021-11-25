# SRPINT-PROJETS-2

Nos proponemos a realizar una API/REST para un restaurante en las cuales necesitamos cubrir rutas de usuarios (Registro, login y modificaciones), productos (Creación, eliminación, modificación y acción de listar), pedidos (Creación, modificación, eliminación y verificación de requisitos antes de realizar nuevas acciones en la pestaña de pedidos) y métodos de pago (creación, eliminación, modificación y acción de listar).

Cuenta con una capa de caché (Redis), una capa de seguridad (JWT), una capa de seguridad de la API (Helmet), y una rutina de test (Mocha y Chai) y es implementado con base de dato "Mongo" para el almacenamiento de datos.
Variables de entorno implementadas en "Dotenv"

# PROYECTO 🌎

Acontinuación se darán las instrucciones generales para la instalación e inicio de la API

### Pre-requisitos 🗒️

 1. Node instalado en el equipo con el cual crearemos nuestro entorno de ejecución.
 2. Base de datos mongo instalada y corriendo en el equipo de prueba.(No es necesario crear bases de datos, colecciones o documentos con informacion especifica ya que el codigo hara esto automaticamente, solo se necesita el servicio de mongo activo y corriendo cuando se ejecute el codigo)
 3. Gestor de caché "redis" instalado y corriendo en el equipo en el puerto "6379" (Esto si se desea ver el efecto del almacenamiento cache. Si por preferencia lo tiene en otro puerto modificar las variables de entorno de nuestra API en su fichero".env").
 4. Por cuestiones prácticas añadimos el fichero .env a nuestro repositorio con las configuraciones de variables de entorno, si por preferencia o si su equipo no le permite iniciar la API con las configuraciones genéricas por favor modifique nuestro .env.
 5. Editor de código de preferencia.
 6. Navegador web de preferencia(Para las pruebas desde swagger).

 ### Instalación ✔️
Después de que descargamos el código y de estar montado en el editor de código instalaremos sus dependencias/librerías de la siguiente forma. Sera un proceso exitoso si tenemos previamente instalado NODE en el equipo:
	
    npm install

Iniciamos nuestra API con **"npm start"**.Con este comando nuestra API empezara a correr y si su inicio fue exitoso en la línea de consola nos indicara el puerto en el cual se inició y un mensaje de confirmación de conexión con la base de datos.

    npm start

## Datos pre-creados para pruebas 🗂️

Para que la prueba se haga más práctica se creó una rutina de creación de un usuario con permisos de administrador, un producto general y un método de pago general con los que se pueden realizar las pruebas. Los datos de los documentos generados por default son los siguientes:

### usuarios

 "isAdmin" : true
 
 "direccion" : [{"direccion" : "direccion 1 #1-2"}]
 
 "estado" : true,
 
 "email" : "correo1@gmail.com"
 
 "username" : "correo uno dos"
 
 "password" : "passwordsecreto"
 
 "telefono" : 3991234568

El usuario anterior se crea por default cuando hay una conexion exitosa con la base de datos.
El usuario tambien es valido para iniciar sesion.
### productos

"nombre" : "carne asada"

"precio" : 10000

El producto anterior se crea por default cuando hay una conexion exitosa con la base de datos.
El producto es valido para agregar al pedido.

### metodos de pago

"medio" : "nequi"

El metodo de pago anterior crea por default cuando hay una conexion exitosa con la base de datos.
El metodo de pago es valido para agregar al pedido.

## Instrucciones 📚

Para que la experiencia sea más agradable y entender correctamente la API se debe tener en cuenta:

1. El usuario no podrá realizar un nuevo pedido mientras tenga un pedido activo(Todos los pedidos del usuario deben estar en estado "CERRADO").
2. El usuario no podrá modificar opciones de su pedido después de que este a pasado a un estado diferente de  "PENDIENTE". Si el pedido pasa a estado "CONFIRMADO" u otro no sera efectiva ninguna modificación.
3. Para que la función de caché de nuestra API sea más perceptible, en el primer llamado a nuestra lista de productos hay un tiempo de respuesta de 3 segundos si este no se ha almacenado en caché.
4. La caché de la lista de productos tiene un tiempo de expiración de 1 minuto.
5. La caché se limpia seguidamente de cada modificación en las rutas de productos(Solo se limpia, pero no se actualiza).
6. Los únicos estados de pedidos admitidos son: PENDIENTE, CONFIRMADO, EN PREPARACIÓN, ENTREGADO y CERRADO. El estado del pedido se debe ingresar en mayúscula.
7. Los usuarios tienen un "ESTADO". El cual nos indica si la cuenta esta activa(True) o se encuentra suspendida(False).
8. Todos los datos que se ingresen en cada una de las rutas tiene validaciones como de sintaxis o si el campo está vacío.
9. Algunos datos no pueden estar duplicados por lo que también existen validaciones para esto.
10. Al iniciar sesion se respondera con un "Token", el cual utilizaremos para iniciar sesion en swagger.(Se debe copiar el contenido del token sin comillas u otros string que no sea exclusivamente el del token en la casilla de autenticacion del swagger).

## Funcionamiento 📈

Continuación se explicará de manera general el funcionamiento de las rutas de nuestra API, si necesita autenticación y/o permisos de administrador.

### usuarios

/registrar = Ruta en donde podremos registrar un usuario nuevo con su respectivo email, username, password, teléfono y podremos agregar una dirección a nuestra libreta de direcciones.(auth: NO, Admin: NO)

/ingresar = Ruta en donde podremos ingresar nuestras credenciales para iniciar sesión en nuestra API. Después de un inicio de sesión exitoso nos devolvería un token con el cual podremos registrarnos en las demás rutas.(auth: NO, Admin: NO)

/micuenta = Ruta en donde podremos obtener los datos de nuestra cuenta.(auth: SI, Admin: NO)

/obtenerusuarios = Ruta en donde podremos obtener la lista con todos los usuarios registrados.(auth: SI, Admin: SI)

/aggdireccion = Ruta en donde podremos agregar a la libreta del usuario una nueva dirección.(auth: SI, Admin: NO)

/deldireccion = Ruta en donde podremos eliminar una dirección de la libreta del usuario.(auth: SI, Admin: NO)

/cambiarestado = Ruta en donde podremos suspender la cuenta de un usuario.(auth: SI, Admin: SI)

### productos

/listaproductos = Ruta en donde listaremos los productos.(auth: SI, Admin: NO)

/edicionproductos = Ruta en donde actualizaremos nombre y/o precio del producto.(auth: SI, Admin: SI)

/eliminarproductos = Ruta en donde podremos eliminar un producto de la lista.(auth: SI, Admin: SI)

/agregarproductos = Ruta en donde podremos agregar un nuevo producto.(auth: SI, Admin: SI)

### metodos de pago

/metodosdepago = Ruta en donde listaremos los métodos de pago disponibles.(auth: SI, Admin: NO)

/agremetodopago = Ruta en donde podremos agregar un nuevo método de pago.(auth: SI, Admin: SI)

/editarmetodo = Ruta en donde podremos editar los medios de pago.(auth: SI, Admin: SI)

/eliminarmetodo = Ruta en donde podremos eliminar un medio de pago.(auth: SI, Admin: SI)

### pedidos

/realizarpedido = Ruta en donde podremos realizar un pedido, este tendrá en su mayor parte referencias a otras colecciones por medio de _id.(auth: SI, Admin: NO)

/mipedido = Ruta en donde podremos listar todos los pedidos del usuario registrado.(auth: SI, Admin: NO)

/totalpedidos = Ruta en donde podremos listar todos los pedidos de todos los usuarios.(auth: SI, Admin: SI)

/estado = Ruta en donde podremos confirmar nuestro pedido.(auth: SI, Admin: NO)

/estado = Ruta en donde podremos cambiar el estado del pedido del usuario y finalizarlo.(auth: SI, Admin: SI)

/editarpedido = Ruta en donde podremos eliminar un producto de nuestra orden.(auth: SI, Admin: NO)

/editarpedido = Ruta en donde podremos editar la cantidad del producto en la orden.(auth: SI, Admin: NO)

/editarpedido = Ruta en donde podremos agregar un nuevo pedido a nuestra orden.(auth: SI, Admin: NO)

## Ejecucion de pruebas ⚙️

Para realizar las pruebas se utiliza el ambiente gráfico SWAGGER, se puede acceder desde el siguiente [LINK](http://localhost:3000/swagger) o ingresando a su navegador de preferencia y yendo a la ruta "http://localhost:3000/swagger"

Si el puerto de inicio de NODE es diferente a "3000" también se debe modificar en la ruta al swagger.

## Ejecucion de test 🧪

Este test está dirigido a las posibles respuestas positivas o negativas que podría recibir la ruta de "REGISTRO DE USUARIOS". 
Podemos ejecutar el test de la siguiente forma:

    npm test

 El test está implementado con mocha y chai.

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
