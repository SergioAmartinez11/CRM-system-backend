var express = require('express');
var router = express.Router();
const { Pool } = require('pg');

/* GET home page. */
router.get('/', function (req, res, next) {
  //get all employees from DB
  let transaction = {};
  const pool = new Pool({
    user: 'sergio-martinez',
    host: 'localhost',
    database: 'crm',
    password: '',
    port: 5432, // puerto predeterminado de PostgreSQL
  });

  // Define la consulta SQL para obtener todos los datos de una tabla
  const query = 'SELECT * FROM employee';
  let data;
  // Ejecuta la consulta dentro del pool de conexión
  pool.query('SELECT * FROM employee', (error, results) => {
    if (error) {
      console.error(error);
      return;
    } else {
      console.log(`Se obtuvieron ${results.rowCount} filas de la tabla`);
      console.log(results.rows);
    }

    data = JSON.stringify(results.rows);
    res.send(data);
  });
  // Cierra la conexión al pool después de realizar la consulta
  pool.end();
});

router.post('/sign-up', function (req, res, next) {
  //get all employees from DB
  const { name, lastname, phone, email, position } = req.body;
  let response;
  const pool = new Pool({
    user: 'sergio-martinez',
    host: 'localhost',
    database: 'crm',
    password: '',
    port: 5432, // puerto predeterminado de PostgreSQL
  });

  pool.query(
    'INSERT INTO employee(name, lastname, phone, email, position, kardex) VALUES ($1, $2, $3,$4,$5,$6)',
    [name, lastname, phone, email, position, 'sd8f18248'],
    (error, results) => {
      if (error) {
        console.error(error);
        response = { message: error };
        return;
      }
      console.log(
        `Se insertaron ${results.rowCount} filas en la tabla usuarios`,
      );
      response = {
        message: `Se insertaron ${results.rowCount} filas en la tabla usuarios`,
      };
    },
  );

  // Cierra la conexión al pool después de realizar la consulta
  pool.end();
});

router.delete('/:id', function (req, res, next) {
  const pool = new Pool({
    user: 'sergio-martinez',
    host: 'localhost',
    database: 'crm',
    password: '',
    port: 5432, // puerto predeterminado de PostgreSQL
  });
  
  pool.query('DELETE FROM employee WHERE name = $1', [id], (err, res) => {
    if (err) {
      console.error('Error al eliminar usuario:', err.stack);
    } else {
      console.log(`Usuario con NAME ${id} eliminado con éxito`);
    }
    pool.end();
  });
});

module.exports = router;
