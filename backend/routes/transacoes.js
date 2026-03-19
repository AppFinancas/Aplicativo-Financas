const express = require('express');

const auth = require('../middleware/auth');
const pool = require('../db/pool');

const router = express.Router();

// Listar transações do usuário (com filtros opcionais)
router.get('/transacoes', auth, async (req, res) => {
  try {
    const transacoes = await pool.query(
      `
      SELECT 
        t.*,
        cat.nome AS categoria_nome,
        cat.cor AS categoria_cor
      FROM transacoes t
      LEFT JOIN categorias cat ON t.categoria_id = cat.id
      WHERE t.usuario_id = $1
      ORDER BY t.data_transacao DESC, t.id DESC
    `,
      [req.usuarioId]
    );
    res.json(transacoes.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// Criar nova transação (versão simplificada, considerando o novo modelo)
router.post('/transacoes', auth, async (req, res) => {
  const { produto_id, tipo_produto, transaction_id_externo, descricao, valor, data_transacao, tipo_transacao, direcao, categoria_id } =
    req.body;

  if (!produto_id || !tipo_produto || !descricao || !valor || !data_transacao || !direcao) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando.' });
  }

  try {
    const novaTransacao = await pool.query(
      `INSERT INTO transacoes 
        (usuario_id, produto_id, tipo_produto, transaction_id_externo, descricao, valor, data_transacao, tipo_transacao, direcao, categoria_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        req.usuarioId,
        produto_id,
        tipo_produto,
        transaction_id_externo || null,
        descricao,
        valor,
        data_transacao,
        tipo_transacao || null,
        direcao,
        categoria_id || null,
      ]
    );
    res.json(novaTransacao.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

module.exports = router;

