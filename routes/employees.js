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
      //console.log(results.rows);
    }

    data = JSON.stringify(results.rows);
    res.send(data);
  });
  // Cierra la conexión al pool después de realizar la consulta
  pool.end();
});

router.put('/update/:id', function (req, res, next) {
  const pool = new Pool({
    user: 'sergio-martinez',
    host: 'localhost',
    database: 'crm',
    password: '',
    port: 5432, // puerto predeterminado de PostgreSQL
  });
  const timeStamp = new Date();
  const updatedData = req.body;

  const updated_at = timeStamp.toISOString();
  const {id} = req.params 
  console.log(updatedData);
  pool.query(
    'UPDATE employees SET first_name = $1, last_name = $2, email = $3, phone_number = $4, address = $5, city = $6, state = $7, postal_code = $8, country = $9, role = $10, updated_at = $11, birthday = $12 WHERE id = $13',
    [
      updatedData.first_name,
      updatedData.last_name,
      updatedData.email,
      updatedData.phone_number,
      updatedData.address,
      updatedData.city,
      updatedData.state,
      updatedData.postal_code,
      updatedData.country,
      updatedData.role,
      updated_at,
      updatedData.birthday,
      id
    ],
    (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`Se actualizó el registro con ID ${id}`);
    },
  );
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

router.delete('/delete/:id', function (req, res, next) {
  const pool = new Pool({
    user: 'sergio-martinez',
    host: 'localhost',
    database: 'crm',
    password: '',
    port: 5432, // puerto predeterminado de PostgreSQL
  });

  const { id } = req.params;

  pool.query('DELETE FROM employees WHERE id = $1', [id], (err, res) => {
    if (err) {
      console.error('Error al eliminar empleado:', err.stack);
    } else {
      console.log(`Empleado ${id} eliminado con éxito`);
    }
    pool.end();
  });
});

module.exports = router;
