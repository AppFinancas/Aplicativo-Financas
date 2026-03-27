/**
 * Base de tipografia.
 *
 * Dica:
 * - title -> titulos principais da tela
 * - subtitle -> textos de apoio
 * - body -> texto normal
 * - caption -> texto pequeno
 */
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },

  size: {
    title: 28,
    h1: 24,
    h2: 20,
    subtitle: 16,
    body: 14,
    caption: 12,
    button: 16,
  },

  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const,

  lineHeight: {
    tight: 18,
    normal: 22,
    relaxed: 26,
  },
} as const;

