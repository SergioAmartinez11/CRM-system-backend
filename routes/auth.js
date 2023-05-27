const express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

// Definir una ruta de inicio de sesión
router.post('/login', (req, res) => {
  // Comprobar las credenciales del usuario
  const username = req.body.username;
  const password = req.body.password;
  // Validar las credenciales del usuario
  if (username !== 'usuario' || password !== 'secret123') {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  // Crear un token de acceso
  const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });

  // Enviar el token de acceso como respuesta
  res.status(200).json({ token });
});

// Definir una ruta protegida
router.get(
  '/recurso-protegido',
  (req, res) => {
    // Verificar si el usuario está autenticado
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: 'No se proporcionó un token de acceso' });
    }

    // Extraer el token de acceso de la cabecera de autorización
    const token = authHeader.split(' ')[1];

    // Verificar el token de acceso
    try {
      const decodedToken = jwt.verify(token, 'secret_key');
      req.username = decodedToken.username;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token de acceso inválido' });
    }
  },
  (req, res) => {
    // Realizar acciones para la ruta protegida
    res.send(`Bienvenido, ${req.username}!`);
  },
);
module.exports = router;
