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

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/submit', (req, res) => {
  const { nombre, rfc, nacimiento, impSoli, ingMensual } = req.body;

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

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});