const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configuración Base de Datos
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'prestamos_db'
});

// Conexión a la Base de Datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});

// Configuración de middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
  res.render('index');
});

// --Validaciones--

// Validar que el RFC tenga 13 caracteres
function validarRFC(rfc) {
  if (rfc.length !== 13) {
    throw new Error('El RFC debe tener 13 caracteres.');
  }
  // Validar que el RFC tenga 4 letras, 6 números y 3 letras
  const regex = /^[A-Z]{4}[0-9]{9}$/;
  if (!regex.test(rfc)) {
    throw new Error('El RFC debe tener 4 letras, 6 números y 3 letras.');
  }
}

// Validar que el cliente sea mayor de edad
function verificarEdad(nacimiento) {
  const fechaNacimiento = new Date(nacimiento);
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();

  if (edad < 18) {
    // No es mayor de edad, retornar un error o mostrar un mensaje de no elegibilidad
    throw new Error('No eres mayor de edad para solicitar un crédito.');
  }
}

// // Validar Ingresos Mensuales e Historial crediticio
// function validarIngresos(ingMensual, fecha_solicitud) {
//   const fechaSolicitud = new Date(fecha_solicitud);
//   const hoy = new Date();
//   const historial = hoy.getFullYear() - fechaSolicitud.getFullYear();

// if(historial < 2){

//   if (ingMensual < 10000) {
//     throw new Error('No tienes ingresos suficientes para solicitar un crédito.');
//   }
//   if (historial === 'no') {
//     throw new Error('No tienes historial crediticio.');
//   }
// }

// Ruta para enviar el formulario
app.post('/submit', (req, res) => {
  const { nombre, rfc, nacimiento, impSoli, ingMensual } = req.body;

  // 1.- Cliente menor de Edad
  try {
    verificarEdad(nacimiento);
  } catch (error) {
    return res.status(400).send(error.message);
  }
  // 2.- RFC con menos de 13 caracteres
  try {
    validarRFC(rfc);
  } catch (error) {
    return res.status(400).send(error.message);
  }

  // Insertar los datos en la base de datos
  const query = `INSERT INTO usuarios (nombre, rfc, nacimiento, impSoli, ingMensual) VALUES (?, ?, ?, ?, ?)`;
  connection.query(
    query,
    [nombre, rfc, nacimiento, impSoli, ingMensual],
    (err, result) => {
      if (err) {
        console.error('Error al insertar los datos en la base de datos:', err);
        return res.sendStatus(500);
      }

      console.log('Los datos se han insertado correctamente en la base de datos.');
      res.sendStatus(200);
    }
  );
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
