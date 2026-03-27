import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { getGastosPorCategoria, type GastoCategoria } from '../services/dashboard';
import { colors, componentStyles, spacing } from '../theme';

export default function GastosCategoria({ navigation }: any) {
  const [gastos, setGastos] = useState<GastoCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getGastosPorCategoria();
      setGastos(data);
    } catch (e) {
      setError('Erro ao carregar gastos por categoria');
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
      <Text style={componentStyles.title}>Gastos por categoria</Text>
      <Text style={[componentStyles.subtitle, styles.subtitle]}>Resumo dos seus gastos no período</Text>

      <View style={componentStyles.card}>
        {loading ? (
          <Text style={styles.mutedText}>Carregando...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : gastos.length === 0 ? (
          <Text style={styles.mutedText}>Nenhum gasto encontrado.</Text>
        ) : (
          gastos.map((gasto, idx) => (
            <View key={`${gasto.categoria}-${idx}`} style={styles.row}>
              <View style={[styles.dot, { backgroundColor: gasto.cor || colors.primary }]} />
              <View style={styles.rowTextArea}>
                <Text style={styles.rowTitle}>{gasto.categoria}</Text>
                <Text style={styles.rowValue}>{String(gasto.total_gasto)}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={componentStyles.buttonPrimary} onPress={loadData}>
        <Text style={componentStyles.buttonPrimaryText}>Atualizar gastos</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: spacing.sm,
  },
  rowTextArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  rowValue: {
    color: colors.textSecondary,
  },
  mutedText: {
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.danger,
  },
});

