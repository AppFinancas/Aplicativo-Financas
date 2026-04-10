import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDashboard } from '../hooks/useDashboard';
import { colors, componentStyles, spacing } from '../theme';
import SimpleCategoryChart from '../components/SimpleCategoryChart';
import { formatarMoeda, formatarData, capitalizarNome, truncarTexto } from '../utils/formatters';

export default function Dashboard({ navigation }: any) {
  const [usuario, setUsuario] = useState<any>(null);
  const { saldoTotal, gastosCategoria, ultimasTransacoes, loading, error, refresh } = useDashboard();
  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('usuario');
      if (userStr) setUsuario(JSON.parse(userStr));
    };
    loadUser();
  }, []);
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    navigation.replace('Login');
  };


  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
    >
      <Text style={componentStyles.title}>Dashboard</Text>
      <Text style={[componentStyles.subtitle, styles.subtitle]}>
        {usuario ? `Olá, ${capitalizarNome(usuario.nome)}!` : 'Resumo da sua vida financeira'}
      </Text>
      <Text style={[componentStyles.subtitle, styles.subtitle]}>Vamos ver o resumo das suas finanças</Text>


      <View style={componentStyles.card}>
        <Text style={styles.cardLabel}>Saldo total</Text>
        <Text style={styles.cardValue}>
          {loading ? 'Carregando...' : formatarMoeda(saldoTotal)}</Text>
      </View>

      <View style={[componentStyles.card, styles.sectionCard]}>
        <Text style={styles.sectionTitle}>Gastos por categoria</Text>
        {loading ? (
          <Text style={styles.mutedText}>Carregando...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : gastosCategoria.length === 0 ? (
          <Text style={styles.mutedText}>Sem gastos no período.</Text>
        ) : (
          <SimpleCategoryChart data={gastosCategoria} maxItems={5} />
        )}
      </View>

      <View style={[componentStyles.card, styles.sectionCard]}>
        <Text style={styles.sectionTitle}>Últimas transações</Text>
        {loading ? (
          <Text style={styles.mutedText}>Carregando...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : ultimasTransacoes.length === 0 ? (
          <Text style={styles.mutedText}>Sem transações.</Text>
        ) : (
          ultimasTransacoes.slice(0, 4).map((t) => (
        <View key={t.id} style={componentStyles.transacaoItem}>
          <Text style={componentStyles.transacaoDescricao}>
            {formatarData(t.data_transacao)} - {truncarTexto(t.descricao || t.tipo_transacao || 'Transação', 20)}
          </Text>
          <Text style={t.direcao === 'saida' ? componentStyles.saidaText : componentStyles.entradaText}>
            {t.direcao === 'saida' ? '➖' : '➕'} {formatarMoeda((t.valor))}
          </Text>
        </View>
      ))
        )}
      </View>

      <TouchableOpacity style={componentStyles.buttonPrimary} onPress={() => navigation.navigate('Transacoes')}>
        <Text style={componentStyles.buttonPrimaryText}>Ver todas as transações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={componentStyles.buttonPrimary} onPress={() => navigation.navigate('GastosCategoria')}>
        <Text style={componentStyles.buttonPrimaryText}>Ver gastos por categoria</Text>
      </TouchableOpacity>

      <TouchableOpacity style={componentStyles.buttonPrimary} onPress={refresh}>
        <Text style={componentStyles.buttonPrimaryText}>Atualizar dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={componentStyles.buttonOff} onPress={handleLogout}>
        <Text style={[componentStyles.buttonOffText, styles.logoutText]}>Sair</Text>
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
  cardLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 6,
  },
  cardValue: {
    color: colors.textPrimaryHeader,
    fontSize: 28,
    fontWeight: '700',
  },
  sectionCard: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  listItem: {
    color: colors.textPrimary,
    marginBottom: 6,
  },
  mutedText: {
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.danger,
  },
  logoutText: {
    color: colors.danger,
  },
});