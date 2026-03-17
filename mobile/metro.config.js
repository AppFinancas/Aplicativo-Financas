const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Força a resolução do pacote react-async-hook
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-async-hook': require.resolve('react-async-hook'),
};

// Se o problema for com sub-dependências, você pode adicionar também:
config.resolver.assetExts.push('woff2'); // se precisar de fontes

module.exports = config;