import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, componentStyles, spacing } from '../theme';

export default function Onboarding({ navigation }: any) {
  const concluir = async () => {
    await AsyncStorage.setItem('onboardingSeen', 'true');
    navigation.replace('Inicial');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={componentStyles.title}>Open Finance no App</Text>
      <Text style={[componentStyles.subtitle, styles.subtitle]}>
        Entenda de forma simples como seus dados financeiros são usados.
      </Text>

      <View style={componentStyles.card}>
        <Text style={styles.stepTitle}>1) Você autoriza</Text>
        <Text style={styles.stepText}>A conexão dos bancos só acontece com seu consentimento.</Text>
      </View>

      <View style={[componentStyles.card, styles.cardSpacing]}>
        <Text style={styles.stepTitle}>2) Nós consolidamos</Text>
        <Text style={styles.stepText}>Unimos saldos e transações para facilitar sua visão financeira.</Text>
      </View>

      <View style={[componentStyles.card, styles.cardSpacing]}>
        <Text style={styles.stepTitle}>3) Você controla</Text>
        <Text style={styles.stepText}>Você pode acompanhar gastos por categoria e revisar suas movimentações.</Text>
      </View>

      <TouchableOpacity style={componentStyles.buttonPrimary} onPress={concluir}>
        <Text style={componentStyles.buttonPrimaryText}>Continuar</Text>
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
  cardSpacing: {
    marginTop: spacing.md,
  },
  stepTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  stepText: {
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

