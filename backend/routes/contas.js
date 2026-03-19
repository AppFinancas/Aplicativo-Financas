const express = require('express');

const auth = require('../middleware/auth');
const pool = require('../db/pool');

const router = express.Router();

// Rota para obter contas do usuário (para popular selects no front)
router.get('/minhas-contas', auth, async (req, res) => {
  try {
    const contas = await pool.query(
      `
      SELECT 
        c.id,
        c.numero_conta,
        c.tipo_conta,
        cof.instituicao_nome,
        'conta' AS tipo
      FROM contas c
      JOIN conexoes_open_finance cof ON c.conexao_id = cof.id
      WHERE cof.usuario_id = $1
      UNION ALL
      SELECT 
        cc.id,
        cc.nome AS numero_conta,
        'CARTAO_CREDITO' AS tipo_conta,
        cof.instituicao_nome,
        'cartao_credito' AS tipo
      FROM cartoes_credito cc
      JOIN conexoes_open_finance cof ON cc.conexao_id = cof.id
      WHERE cof.usuario_id = $1
    `,
      [req.usuarioId]
    );

    res.json(contas.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

module.exports = router;

