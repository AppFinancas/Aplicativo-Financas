import { useCallback, useEffect, useState } from 'react';
import { getDashboard, type GastoCategoria, type TransacaoResumo } from '../services/dashboard';

type DashboardState = {
  saldoTotal: string;
  gastosCategoria: GastoCategoria[];
  ultimasTransacoes: TransacaoResumo[];
  loading: boolean;
  error: string | null;
};

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({
    saldoTotal: 'Carregando saldo...',
    gastosCategoria: [],
    ultimasTransacoes: [],
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const payload = await getDashboard({ limite: 10 });

      setState({
        saldoTotal: String(payload?.saldo_total ?? '0'),
        gastosCategoria: payload?.gastos_por_categoria ?? [],
        ultimasTransacoes: payload?.ultimas_transacoes ?? [],
        loading: false,
        error: null,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        saldoTotal: s.saldoTotal === 'Carregando saldo...' ? 'Erro ao carregar saldo' : s.saldoTotal,
        loading: false,
        error: 'Erro ao carregar dados do dashboard',
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}

