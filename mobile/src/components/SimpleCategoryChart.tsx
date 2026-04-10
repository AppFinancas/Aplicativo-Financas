import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';
import type { GastoCategoria } from '../services/dashboard';
import { formatarMoeda } from '../utils/formatters'; // <-- importa a função

type Props = {
  data: GastoCategoria[];
  maxItems?: number;
};

export default function SimpleCategoryChart({ data, maxItems = 5 }: Props) {
  const items = data.slice(0, maxItems).map((item) => ({
    ...item,
    total: Number(item.total_gasto) || 0,
  }));

  const maxTotal = items.reduce((acc, item) => (item.total > acc ? item.total : acc), 0);

  if (items.length === 0) {
    return <Text style={styles.emptyText}>Sem dados para gráfico.</Text>;
  }

  return (
    <View>
      {items.map((item, idx) => {
        const widthPercent = maxTotal > 0 ? Math.max(6, (item.total / maxTotal) * 100) : 6;
        return (
          <View key={`${item.categoria}-${idx}`} style={styles.row}>
            <Text style={styles.label}>{item.categoria}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${widthPercent}%`, backgroundColor: item.cor || colors.primary },
                ]}
              />
            </View>
            <Text style={styles.value}>
              {formatarMoeda(item.total)} {/* 🔁 formatação aplicada aqui */}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: 4,
    fontSize: 12,
  },
  barTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  value: {
    color: colors.textPrimary,
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    color: colors.textSecondary,
  },
});