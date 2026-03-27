/**
 * Base de cores do app.
 *
 * Como usar:
 * - Fundo principal de tela: colors.background
 * - Cor principal de botoes: colors.primary
 * - Texto principal: colors.textPrimary
 * - Erros/alertas: colors.danger
 */
export const colors = {
  // Fundos
  background: '#fff2f6',
  surface: '#FFFFFF',
  surfaceMuted: '#EEF2F7',

  // Marca / acao principal
  primary: '#F287A9',
   primarySoft: '#F7B7CC',

  // Textos
  textPrimary: '#0F172A',
  textPrimaryHeader: '#7f2643',

  textSecondary: '#475569',
  textOnPrimary: '#dadada',

  // Estados
  success: '#16A34A',
  warning: '#D97706',
  danger: '#DC2626',

  // Bordas e divisores
  border: '#D0D7E2',
  divider: '#E2E8F0',
} as const;

export type AppColors = typeof colors;

