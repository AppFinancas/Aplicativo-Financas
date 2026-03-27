import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

type Props = {
  descricao?: string | null;
  categoriaAtual?: string | null;
};

const regrasLocais = [
  { categoria: 'Alimentação', palavras: ['ifood', 'mercado', 'restaurante', 'padaria'] },
  { categoria: 'Transporte', palavras: ['uber', '99', 'combustivel', 'posto'] },
  { categoria: 'Moradia', palavras: ['aluguel', 'condominio', 'energia', 'luz', 'agua', 'internet'] },
];

function sugerir(descricao?: string | null) {
  const texto = String(descricao || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const regra of regrasLocais) {
    if (regra.palavras.some((p) => texto.includes(p))) return regra.categoria;
  }
  return null;
}

export default function CategoriaAutomaticaBadge({ descricao, categoriaAtual }: Props) {
  const categoriaSugerida = sugerir(descricao);

  if (!categoriaSugerida || categoriaAtual) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>Sugestão automática: {categoriaSugerida}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.textPrimaryHeader,
    fontSize: 12,
    fontWeight: '600',
  },
});

