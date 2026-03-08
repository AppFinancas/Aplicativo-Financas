require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('API do App Finanças rodando!');
});

// Registro de usuário
app.post('/registro', async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);

    const newUser = await pool.query(
      'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
      [nome, email, hash]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ usuario: newUser.rows[0], token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ erro: 'Email ou senha inválidos' });
    }

    const validSenha = await bcrypt.compare(senha, user.rows[0].senha_hash);
    if (!validSenha) {
      return res.status(400).json({ erro: 'Email ou senha inválidos' });
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ usuario: { id: user.rows[0].id, nome: user.rows[0].nome, email: user.rows[0].email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// Listar transações do usuário logado
app.get('/transacoes', auth, async (req, res) => {
  try {
    const transacoes = await pool.query(
      'SELECT * FROM transacoes WHERE usuario_id = $1 ORDER BY data DESC',
      [req.usuarioId]
    );
    res.json(transacoes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// Criar nova transação
app.post('/transacoes', auth, async (req, res) => {
  const { descricao, valor, categoria, tipo } = req.body;
  try {
    const novaTransacao = await pool.query(
      'INSERT INTO transacoes (usuario_id, descricao, valor, categoria, tipo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.usuarioId, descricao, valor, categoria, tipo]
    );
    res.json(novaTransacao.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});