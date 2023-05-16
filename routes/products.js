var express = require('express');
var router = express.Router();
const { Pool } = require('pg');

/* GET home page. */
router.get('/', function (req, res, next) {
  //get all inventorys from DB
  let transaction = {};
  const pool = new Pool({
    user: 'sergio-martinez',
    host: 'localhost',
    database: 'crm',
    password: '',
    port: 5432, // puerto predeterminado de PostgreSQL
  });

  // Define la consulta SQL para obtener todos los datos de una tabla
  const query = 'SELECT * FROM inventory';
  let data;
  // Ejecuta la consulta dentro del pool de conexión
  pool.query('SELECT * FROM inventory', (error, results) => {
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

router.post('/new', function (req, res, next) {
  //get all inventorys from DB
  const { id, item_name, description, quantity, price, created_by } = req.body;
  let response;
  const timeStamp = new Date();
  const created_at = timeStamp.toISOString();
  const updated_at = null;

  const pool = new Pool({
    user: 'sergio-martinez',
    host: 'localhost',
    database: 'crm',
    password: '',
    port: 5432, // puerto predeterminado de PostgreSQL
  });

  pool.query(
    'INSERT INTO inventory(id,item_name,description,quantity,price,created_by,created_at,updated_at,) VALUES ($1, $2, $3,$4,$5,$6, $7, $8)',
    [
      id,
      item_name,
      description,
      quantity,
      price,
      created_by,
      created_at,
      updated_at,
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

  pool.query('DELETE FROM inventory WHERE name = $1', [id], (err, res) => {
    if (err) {
      console.error('Error al eliminar usuario:', err.stack);
    } else {
      console.log(`Usuario con NAME ${id} eliminado con éxito`);
    }
    pool.end();
  });
});

module.exports = router;
