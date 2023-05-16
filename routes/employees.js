const { log } = require('debug/src/browser');
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
  const query = 'SELECT * FROM employees';
  let data;
  // Ejecuta la consulta dentro del pool de conexión
  pool.query('SELECT * FROM employees', (error, results) => {
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
  const {
    id,
    first_name,
    last_name,
    email,
    phone_number,
    address,
    city,
    state,
    postal_code,
    country,
    role,
    birthday,
  } = req.body;
  let response;
  const timeStamp = new Date();
  const created_at = timeStamp.toISOString();
  const updated_at = null;
  log(req.body);

  const pool = new Pool({
    user: 'sergio-martinez',
    host: 'localhost',
    database: 'crm',
    password: '',
    port: 5432, // puerto predeterminado de PostgreSQL
  });

  pool.query(
    'INSERT INTO employees(id,first_name, last_name, email, phone_number, address, city, state, postal_code, country, role, created_at, updated_at, birthday) VALUES ($1, $2, $3,$4,$5,$6, $7,$8,$9,$10, $11, $12, $13, $14)',
    [
      id,
      first_name,
      last_name,
      email,
      phone_number,
      address,
      city,
      state,
      postal_code,
      country,
      role,
      created_at,
      updated_at,
      birthday,
    ],
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

  pool.query('DELETE FROM employees WHERE id = $1', [id], (err, res) => {
    if (err) {
      console.error('Error al eliminar usuario:', err.stack);
    } else {
      console.log(`Usuario ${id} eliminado con éxito`);
    }
    pool.end();
  });
});

module.exports = router;
