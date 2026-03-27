import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { radius, spacing } from './spacing';
import { typography } from './typography';

/**
 * Estilos base reutilizaveis para componentes.
 *
 * Objetivo:
 * - Evitar repetir estilos em todas as telas
 * - Criar consistencia visual (mesma cara em todo app)
 */
export const componentStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },

  title: {
    color: colors.textPrimaryHeader,
    fontSize: typography.size.h1,
    fontWeight: typography.weight.bold,
    textAlign: "center"
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.subtitle,
    fontWeight: typography.weight.regular,
    textAlign: "center"
  },

  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl
  },

  buttonPrimaryText: {
    color: colors.textOnPrimary,
    fontSize: typography.size.button,
    fontWeight: typography.weight.semibold,
  },
  buttonOff:{
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOffText: {
    color: colors.textSecondary,
    fontSize: typography.size.button,
    fontWeight: typography.weight.semibold,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.size.body,
  },
  inputText: {
    color: colors.textSecondary,
    fontSize: typography.size.subtitle,
    fontWeight: typography.weight.regular,
  }
});

