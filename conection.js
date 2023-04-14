const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'tu_base_de_datos'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL!');
});
