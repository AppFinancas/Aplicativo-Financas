const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const pool = require('../db/pool');

const router = express.Router();

// Cadastro
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;

  if (!nome || !email || !senha || !telefone) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ erro: 'Email já cadastrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);

    const newUser = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash, telefone) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, telefone',
      [nome, email, hash, telefone]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ usuario: newUser.rows[0], token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  try {
    const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ erro: 'Email ou senha inválidos.' });
    }

    const validSenha = await bcrypt.compare(senha, user.rows[0].senha_hash);
    if (!validSenha) {
      return res.status(400).json({ erro: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      usuario: { id: user.rows[0].id, nome: user.rows[0].nome, email: user.rows[0].email },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

// Perfil
router.get('/perfil', auth, async (req, res) => {
  try {
    const user = await pool.query('SELECT id, nome, email, telefone FROM usuarios WHERE id = $1', [req.usuarioId]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

module.exports = router;

