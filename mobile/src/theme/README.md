# Base de Design (sem mexer nas telas)

Este diretorio contem uma base visual pronta para seu app React Native.

## Arquivos

- `colors.ts`: paleta de cores do projeto.
- `typography.ts`: tamanhos e pesos de fonte.
- `spacing.ts`: escala de espacamento e bordas.
- `components.ts`: estilos reutilizaveis de componentes.
- `index.ts`: export unico para facilitar importacoes.

## Como aplicar em uma tela (quando quiser)

1. Importar o tema:
   - `import { colors, componentStyles, spacing, typography } from '../theme';`
2. Trocar estilos hardcoded por tokens do tema.
3. Reutilizar `componentStyles` para cards, inputs e botoes.

## Exemplo rapido

```ts
container: {
  flex: 1,
  backgroundColor: colors.background,
  padding: spacing.lg,
}
```

## Beneficios

- Consistencia visual entre telas.
- Mudancas de design centralizadas.
- Menos duplicacao de estilos.

