//Dependencias, son bibliotecas que se instalan para que el servidor pueda levantarse correctamente
const express = require('express'); //Facilita la creación de servidores y manejo de rutas
const mongoose = require('mongoose'); //Permite conectarse a la BD de mongoDB y crear las colecciones y realizar consultas
const cors = require('cors'); //Permite la comunicación entre dominios diferentes
const bodyParser = require('body-parser'); //Permite interpretar los datos que vienen en la petición en formto json
require('dotenv').config(); //Se importa el archivo .env para poder utilizar sus variables dentro del código

const app = express(); //Crear una instancia de express
const PORT = process.env.PORT || 3000; //Usar el puerto indicado en .env o si no se indica usar el puerto 3000

// Importación de rutas-----------------------------------------------

const  administradorRoute = require("./routes/administrador.route");
const actividadRoute = require ("./routes/actividad.route");
const standRoute = require("./routes/stand.route");
const agendaRoute = require("./routes/agenda.route");
const inscripcionRoute = require("./routes/inscripcion.route");
const contactoRoute = require("./routes/contacto.route");

//--------------------------------------------------------------------

app.use(express.json());//Habilita el manejo de JSON en las peticiones
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());//Habilita el análisis de JSON en las peticiones 
app.use(cors());

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]); // Para el error querySrv ECONNREFUSED  https://alexbevi.com/blog/2023/11/13/querysrv-errors-when-connecting-to-mongodb-atlas/
mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log('MongoDB Atlas conectado'))
.catch(error => console.log('Ocurrió un error al conectarse con MongoDB: ', error));

// Rutas-------------------------------------------

app.use("/administrador", administradorRoute);
app.use("/actividad", actividadRoute);
app.use("/stand", standRoute);
app.use("/agenda", agendaRoute);
app.use("/inscripcion", inscripcionRoute);
app.use("/contacto", contactoRoute);


//-------------------------------------------------

app.get('/', (req,res)=> {
    res.send('Servidor en funcionamiento');
});

app.listen(PORT, ()=>{
    console.log('Servidor corriendo en http://localhost:' + PORT);

 
});

