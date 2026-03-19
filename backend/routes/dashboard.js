const express = require('express');

const auth = require('../middleware/auth');
const pool = require('../db/pool');

const router = express.Router();

// Dashboard (agrega saldo_total, gastos_por_categoria e ultimas_transacoes)
router.get('/dashboard', auth, async (req, res) => {
  const limite = req.query.limite ? parseInt(req.query.limite) : 10;
  let { data_inicio, data_fim } = req.query;

  if (!data_inicio || !data_fim) {
    const now = new Date();
    const ano = now.getFullYear();
    const mes = String(now.getMonth() + 1).padStart(2, '0');
    data_inicio = `${ano}-${mes}-01`;
    data_fim = new Date(ano, now.getMonth() + 1, 0).toISOString().split('T')[0];
  }

  try {
    const [saldoResult, gastosResult, transacoesResult] = await Promise.all([
      pool.query(
        `
        SELECT COALESCE(SUM(ultimos_saldos.valor_disponivel), 0) AS saldo_total
        FROM (
          SELECT DISTINCT ON (c.id) c.id, s.valor_disponivel
          FROM contas c
          JOIN saldos_conta s ON c.id = s.conta_id
          WHERE c.conexao_id IN (
            SELECT id FROM conexoes_open_finance WHERE usuario_id = $1
          )
          ORDER BY c.id, s.data_saldo DESC
        ) AS ultimos_saldos
      `,
        [req.usuarioId]
      ),
      pool.query(
        `
        SELECT 
          COALESCE(cat.nome, 'Sem categoria') AS categoria,
          COALESCE(cat.cor, '#CCCCCC') AS cor,
          SUM(t.valor) AS total_gasto
        FROM transacoes t
        LEFT JOIN categorias cat ON t.categoria_id = cat.id
        WHERE t.usuario_id = $1
          AND t.direcao = 'saida'
          AND t.data_transacao BETWEEN $2 AND $3
        GROUP BY cat.id, cat.nome, cat.cor
        ORDER BY total_gasto DESC
      `,
        [req.usuarioId, data_inicio, data_fim]
      ),
      pool.query(
        `
        SELECT 
          t.id,
          t.data_transacao,
          t.descricao,
          t.valor,
          t.direcao,
          t.tipo_transacao,
          CASE 
            WHEN t.tipo_produto = 'conta' THEN (
              SELECT numero_conta FROM contas WHERE id = t.produto_id
            )
            WHEN t.tipo_produto = 'cartao_credito' THEN (
              SELECT nome FROM cartoes_credito WHERE id = t.produto_id
            )
          END AS produto_nome,
          CASE 
            WHEN t.tipo_produto = 'conta' THEN 'conta'
            WHEN t.tipo_produto = 'cartao_credito' THEN 'cartao'
          END AS tipo_produto,
          cat.nome AS categoria_nome,
          cat.cor AS categoria_cor
        FROM transacoes t
        LEFT JOIN categorias cat ON t.categoria_id = cat.id
        WHERE t.usuario_id = $1
        ORDER BY t.data_transacao DESC, t.id DESC
        LIMIT $2
      `,
        [req.usuarioId, limite]
      ),
    ]);

    res.json({
      saldo_total: parseFloat(saldoResult.rows[0].saldo_total),
      gastos_por_categoria: gastosResult.rows,
      ultimas_transacoes: transacoesResult.rows,
      filtros: { data_inicio, data_fim, limite },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

// Mantém as rotas separadas (caso o app use individualmente)
router.get('/saldo-total', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT COALESCE(SUM(ultimos_saldos.valor_disponivel), 0) AS saldo_total
      FROM (
        SELECT DISTINCT ON (c.id) c.id, s.valor_disponivel
        FROM contas c
        JOIN saldos_conta s ON c.id = s.conta_id
        WHERE c.conexao_id IN (
          SELECT id FROM conexoes_open_finance WHERE usuario_id = $1
        )
        ORDER BY c.id, s.data_saldo DESC
      ) AS ultimos_saldos
    `,
      [req.usuarioId]
    );

    res.json({ saldo_total: parseFloat(result.rows[0].saldo_total) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

router.get('/ultimas-transacoes', auth, async (req, res) => {
  const limite = req.query.limite ? parseInt(req.query.limite) : 10;
  try {
    const result = await pool.query(
      `
      SELECT 
        t.id,
        t.data_transacao,
        t.descricao,
        t.valor,
        t.direcao,
        t.tipo_transacao,
        CASE 
          WHEN t.tipo_produto = 'conta' THEN (
            SELECT numero_conta FROM contas WHERE id = t.produto_id
          )
          WHEN t.tipo_produto = 'cartao_credito' THEN (
            SELECT nome FROM cartoes_credito WHERE id = t.produto_id
          )
        END AS produto_nome,
        CASE 
          WHEN t.tipo_produto = 'conta' THEN 'conta'
          WHEN t.tipo_produto = 'cartao_credito' THEN 'cartao'
        END AS tipo_produto,
        cat.nome AS categoria_nome,
        cat.cor AS categoria_cor
      FROM transacoes t
      LEFT JOIN categorias cat ON t.categoria_id = cat.id
      WHERE t.usuario_id = $1
      ORDER BY t.data_transacao DESC, t.id DESC
      LIMIT $2
    `,
      [req.usuarioId, limite]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

router.get('/gastos-por-categoria', auth, async (req, res) => {
  let { data_inicio, data_fim } = req.query;

  if (!data_inicio || !data_fim) {
    const now = new Date();
    const ano = now.getFullYear();
    const mes = String(now.getMonth() + 1).padStart(2, '0');
    data_inicio = `${ano}-${mes}-01`;
    data_fim = new Date(ano, now.getMonth() + 1, 0).toISOString().split('T')[0];
  }

  try {
    const result = await pool.query(
      `
      SELECT 
        COALESCE(cat.nome, 'Sem categoria') AS categoria,
        COALESCE(cat.cor, '#CCCCCC') AS cor,
        SUM(t.valor) AS total_gasto
      FROM transacoes t
      LEFT JOIN categorias cat ON t.categoria_id = cat.id
      WHERE t.usuario_id = $1
        AND t.direcao = 'saida'
        AND t.data_transacao BETWEEN $2 AND $3
      GROUP BY cat.id, cat.nome, cat.cor
      ORDER BY total_gasto DESC
    `,
      [req.usuarioId, data_inicio, data_fim]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no servidor.' });
  }
});

module.exports = router;

