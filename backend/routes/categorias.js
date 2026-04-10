const express = require('express');

const auth = require('../middleware/auth');
const pool = require('../db/pool');

const router = express.Router();

// Rota para listar categorias do usuário
router.get('/categorias', auth, async (req, res) => {
  try {
    const categorias = await pool.query('SELECT * FROM categorias WHERE usuario_id = $1 ORDER BY nome', [req.usuarioId]);
    res.json(categorias.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

//Criar nova categoria
router.post('/categorias', auth, async (req, res) => {
  const { nome, cor } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: 'Nome é obrigatório.' });
  }
  if (!cor) {
    return res.status(400).json({erro: 'Cor é obrigatorio'})
  }
  try {
    const nova = await pool.query('INSERT INTO categorias (usuario_id, nome, cor) VALUES ($1, $2, $3) RETURNING *', [
      req.usuarioId,
      nome,
      cor
    ]);
    res.json(nova.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

module.exports = router;

