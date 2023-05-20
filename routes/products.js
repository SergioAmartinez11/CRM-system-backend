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
  console.log(updatedData);
  const updated_at = timeStamp.toISOString();

  pool.query(
    'UPDATE inventory SET item_name = $1, description = $2, price = $3, quantity = $4, provider = $5, updated_at = $6 WHERE id = $7',
    [
      updatedData.item_name,
      updatedData.description,
      updatedData.price,
      updatedData.quantity,
      updatedData.provider,
      updated_at,
      updatedData.id,
    ],
    (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`Se actualizó el registro con ID ${updatedData.id}`);
    },
  );
  pool.end();
});

router.post('/new', function (req, res, next) {
  //get all inventorys from DB
  const { id, item_name, description, quantity, price, provider } = req.body;
  let response;
  const timeStamp = new Date();
  const created_at = timeStamp.toISOString();
  const updated_at = null;
  const created_by = 1;

  const pool = new Pool({
    user: 'sergio-martinez',
    host: 'localhost',
    database: 'crm',
    password: '',
    port: 5432, // puerto predeterminado de PostgreSQL
  });
  pool.query(
    'INSERT INTO inventory(id,item_name,description,quantity,price,created_by,created_at,updated_at, provider) VALUES ($1, $2, $3,$4,$5,$6, $7, $8, $9)',
    [
      id,
      item_name,
      description,
      quantity,
      price,
      created_by,
      created_at,
      updated_at,
      provider,
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
  

  pool.query('DELETE FROM inventory WHERE id = $1', [id], (err, res) => {
    if (err) {
      console.error('Error al eliminar producto:', err.stack);
    } else {
      console.log(`Producto ${id} eliminado con éxito`);
    }
    pool.end();
  });
});

module.exports = router;
