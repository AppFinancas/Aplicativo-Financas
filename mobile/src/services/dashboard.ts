import api from './api';

export type GastoCategoria = { categoria: string; cor: string; total_gasto: number | string };

export type TransacaoResumo = {
  id: number;
  data_transacao: string;
  descricao: string | null;
  valor: number | string;
  direcao: string;
  tipo_transacao: string | null;
  produto_nome: string | null;
  tipo_produto: string | null;
  categoria_nome: string | null;
  categoria_cor: string | null;
};

export type DashboardPayload = {
  saldo_total: number | string;
  gastos_por_categoria: GastoCategoria[];
  ultimas_transacoes: TransacaoResumo[];
  filtros?: { data_inicio?: string; data_fim?: string; limite?: number };
};

export async function getDashboard(params?: { data_inicio?: string; data_fim?: string; limite?: number }) {
  const response = await api.get('/dashboard', { params });
  return response.data as DashboardPayload;
}

export async function getSaldoTotal() {
  const response = await api.get('/saldo-total');
  return response.data as { saldo_total: number | string };
}

export async function getGastosPorCategoria(params?: { data_inicio?: string; data_fim?: string }) {
  const response = await api.get('/gastos-por-categoria', { params });
  return (response.data ?? []) as GastoCategoria[];
}

export async function getUltimasTransacoes(params?: { limite?: number }) {
  const response = await api.get('/ultimas-transacoes', { params });
  return (response.data ?? []) as TransacaoResumo[];
}

