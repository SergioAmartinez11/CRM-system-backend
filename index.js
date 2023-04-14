const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');

const app = express();
const port = 3003;
let arrayUser = [];

const client = new Client({
  user: 'sergio-martinez',
  host: 'localhost',
  database: 'crm',
  password: '',
  port: 5432,
});

client.connect();

const generateToken = (payload, secret) => {
  const options = {
    expiresIn: '1h',
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: '*/*' }));

app.use(cors());

app.get('/userauth', (req, res) => {
  res.send(arrayUser);
});

app.post('/userauth', (req, res) => {
  let payload = req.body;
  const token = generateToken(payload, payload.key);
  console.log(payload);
  client.query(
    'INSERT INTO public.user (key, username, password, name, lastname) VALUES ($1, $2, $3, $4, $5)',
    [
      payload.key,
      payload.username,
      payload.password,
      payload.name,
      payload.lastname,
    ],
    (err, res) => {
      if (err) throw err;


      client.end();
    },
  );
  res.send(JSON.stringify('TOKEN => ' + token));
 // res.send(JSON.stringify(token));
});

app.listen(port, () => {
  console.log(`Ejecutando en http://localhost:${port}`);
});
