// Importamos express
import express from 'express';
import router from './routes/index.js';
import db from './config/db.js';
import dotenv from 'dotenv';

dotenv.config({ path: 'variables.env' });

// Ejecutamos express y se asigna a la variable app
const app = express();

// Conectar la base de datos
db.authenticate()
  .then(() => {
    console.log('Base de datos conectada');
  })
  .catch(error => console.log(error));

// Habilitar PUG
app.set('view engine', 'pug');

// Obtener el año actual
// next indica que hay que ir al siguiente middleware cuando encontremos
// la función next()
app.use((req, res, next) => {
  const year = new Date();
  res.locals.actualYear = year.getFullYear();
  res.locals.nombreSitio = 'Agencia de Viajes';

  // Si hay algún problema para que vaya al siguiente middleware
  // escribir return next(); para forzarlo
  next();
});

// Agregr body parser para ller los datos del formulario
app.use(express.urlencoded({ extended: true }));

// Definir la carpeta pública
app.use(express.static('public'));
app.use('/viajes', express.static('public'));

// Agregar Router
app.use('/', router);

// Puerto y host para la app usando variable de entorno
// process.env.PORT lo dejamos libre para que Heroku lo asigne.
// Por eso no existe esa variable de entorno en variables.env
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 4000;

// Arrancando el servidor
app.listen(port, host, () => {
  console.log(
    `El servidor esta funcionando en el host ${host} y puerto ${port}`
  );
});
