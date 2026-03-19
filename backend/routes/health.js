const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('API do App Finanças rodando!');
});

module.exports = router;

