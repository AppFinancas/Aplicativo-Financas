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

// Atualizar perfil do usuario logado
router.put('/usuarios/me', auth, async (req, res) => {
  const { nome, email, telefone, senha } = req.body;

  if (!nome && !email && !telefone && !senha) {
    return res.status(400).json({ erro: 'Informe ao menos um campo para atualizar.' });
  }

  try {
    let senhaHash = null;
    if (senha) {
      const salt = await bcrypt.genSalt(10);
      senhaHash = await bcrypt.hash(senha, salt);
    }

    const atualizado = await pool.query(
      `
      UPDATE usuarios
      SET
        nome = COALESCE($1, nome),
        telefone = COALESCE($2, telefone),
        senha_hash = COALESCE($3, senha_hash),
        updated_at = NOW()
      WHERE id = $4
      RETURNING id, nome, email, telefone
    `,
      [nome || null, telefone || null, senhaHash, req.usuarioId]
    );

    res.json(atualizado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

// Remover usuario logado e dados associados (fluxo simples)
router.delete('/usuarios/me', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Remove dados relacionados para evitar violação de FK.
    await client.query('DELETE FROM alocacoes_objetivo WHERE transacao_origem_id IN (SELECT id FROM transacoes WHERE usuario_id = $1)', [
      req.usuarioId,
    ]);
    await client.query('DELETE FROM alocacoes_objetivo WHERE objetivo_id IN (SELECT id FROM objetivos WHERE usuario_id = $1)', [
      req.usuarioId,
    ]);
    await client.query('DELETE FROM objetivos WHERE usuario_id = $1', [req.usuarioId]);
    await client.query('DELETE FROM transacoes WHERE usuario_id = $1', [req.usuarioId]);
    await client.query('DELETE FROM categorias WHERE usuario_id = $1', [req.usuarioId]);

    const conexoes = await client.query('SELECT id FROM conexoes_open_finance WHERE usuario_id = $1', [req.usuarioId]);
    const conexaoIds = conexoes.rows.map((r) => r.id);

    if (conexaoIds.length > 0) {
      await client.query(
        'DELETE FROM saldos_conta WHERE conta_id IN (SELECT id FROM contas WHERE conexao_id = ANY($1::int[]))',
        [conexaoIds]
      );
      await client.query(
        'DELETE FROM limites_credito WHERE cartao_credito_id IN (SELECT id FROM cartoes_credito WHERE conexao_id = ANY($1::int[]))',
        [conexaoIds]
      );
      await client.query(
        'DELETE FROM faturas_credito WHERE cartao_credito_id IN (SELECT id FROM cartoes_credito WHERE conexao_id = ANY($1::int[]))',
        [conexaoIds]
      );
      await client.query('DELETE FROM contas WHERE conexao_id = ANY($1::int[])', [conexaoIds]);
      await client.query('DELETE FROM cartoes_credito WHERE conexao_id = ANY($1::int[])', [conexaoIds]);
      await client.query('DELETE FROM conexoes_open_finance WHERE id = ANY($1::int[])', [conexaoIds]);
    }

    await client.query('DELETE FROM usuarios WHERE id = $1', [req.usuarioId]);

    await client.query('COMMIT');
    res.json({ mensagem: 'Usuário removido com sucesso.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  } finally {
    client.release();
  }
});

module.exports = router;

