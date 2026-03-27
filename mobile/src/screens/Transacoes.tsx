import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { getUltimasTransacoes, type TransacaoResumo } from '../services/dashboard';
import { colors, componentStyles, spacing } from '../theme';
import CategoriaAutomaticaBadge from '../components/CategoriaAutomaticaBadge';

export default function Transacoes({ navigation }: any) {
  const [transacoes, setTransacoes] = useState<TransacaoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUltimasTransacoes({ limite: 50 });
      setTransacoes(data);
    } catch (e) {
      setError('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} />}
    >
      <Text style={componentStyles.title}>Transações</Text>
      <Text style={[componentStyles.subtitle, styles.subtitle]}>Últimas movimentações da sua conta</Text>

      <View style={componentStyles.card}>
        {loading ? (
          <Text style={styles.mutedText}>Carregando...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : transacoes.length === 0 ? (
          <Text style={styles.mutedText}>Nenhuma transação encontrada.</Text>
        ) : (
          transacoes.map((t) => (
            <View key={t.id} style={styles.row}>
              <Text style={styles.rowTitle}>{t.descricao ?? t.tipo_transacao ?? 'Transação'}</Text>
              <Text style={styles.rowMeta}>
                {t.data_transacao} | {t.direcao === 'saida' ? '-' : '+'}
                {String(t.valor)}
                {t.categoria_nome ? ` | ${t.categoria_nome}` : ''}
              </Text>
              <CategoriaAutomaticaBadge descricao={t.descricao} categoriaAtual={t.categoria_nome} />
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={componentStyles.buttonPrimary} onPress={loadData}>
        <Text style={componentStyles.buttonPrimaryText}>Atualizar transações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={componentStyles.buttonOff} onPress={() => navigation.goBack()}>
        <Text style={componentStyles.buttonOffText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  row: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  rowMeta: {
    color: colors.textSecondary,
    marginTop: 2,
  },
  mutedText: {
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.danger,
  },
});

