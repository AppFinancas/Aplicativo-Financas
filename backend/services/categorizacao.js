const regrasFixas = [
  { categoria: 'Alimentação', palavras: ['ifood', 'uber eats', 'restaurante', 'mercado', 'supermercado', 'padaria'] },
  { categoria: 'Transporte', palavras: ['uber', '99', 'combustivel', 'posto', 'estacionamento', 'onibus', 'metro'] },
  { categoria: 'Moradia', palavras: ['aluguel', 'condominio', 'energia', 'luz', 'agua', 'internet', 'gas'] },
  { categoria: 'Saúde', palavras: ['farmacia', 'hospital', 'clinica', 'medico', 'plano de saude'] },
  { categoria: 'Lazer', palavras: ['cinema', 'streaming', 'netflix', 'spotify', 'show', 'viagem'] },
];

function sugerirCategoriaPorDescricao(descricao = '') {
  const texto = String(descricao).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  for (const regra of regrasFixas) {
    const encontrou = regra.palavras.some((palavra) => texto.includes(palavra));
    if (encontrou) {
      return regra.categoria;
    }
  }

  return null;
}

module.exports = {
  sugerirCategoriaPorDescricao,
  regrasFixas,
};

