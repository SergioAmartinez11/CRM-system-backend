const express = require('express');
const cors = require('cors');

const jwt = require('jsonwebtoken');

const generateToken = (payload, secret) => {
  const options = {
    expiresIn: '1h',
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};

const app = express();
const port = 3001;

let arrayUser = [
  { username: 'alonso.martinez64@uabc.edu.mx', password: 'Moldearte123' },
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ type: '*/*' }));

app.use(cors());

app.get('/userauth', (req, res) => {
  res.send(arrayUser);
});

app.post('/userauth', (req, res) => {
  let transaction = req.body;
  const token = generateToken(transaction, 'My_key_134');
  let credentials = {
    user: 'alonso.martinez64@uabc.edu.mx',
    password: 'mycrm1234',
    token: token,
  };
  res.send(JSON.stringify(credentials));
});

app.listen(port, () => {
  console.log(`Ejecutando en http://localhost:${port}`);
});
