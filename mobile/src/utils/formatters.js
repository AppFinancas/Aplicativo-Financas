/**
 * Formata um número para moeda brasileira (R$)
 * @param {number|string} valor - Valor a ser formatado
 * @returns {string} Ex: "R$ 1.250,50"
 */
export const formatarMoeda = (valor) => {
  if (valor === null || valor === undefined || isNaN(Number(valor))) {
    return 'R$ 0,00';
  }
  const numero = Number(valor);
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

/**
 * Formata uma data ISO ou timestamp para o formato brasileiro (dd/mm/aaaa)
 * @param {string|Date} dataISO - Data em formato ISO (ex: "2025-04-09T10:00:00Z") ou objeto Date
 * @param {boolean} incluirHora - Se true, exibe também hora:minuto
 * @returns {string} Ex: "09/04/2025" ou "09/04/2025 10:00"
 */
export const formatarData = (dataISO, incluirHora = false) => {
  if (!dataISO) return '';
  try {
    const data = new Date(dataISO);
    if (isNaN(data.getTime())) return '';
    if (incluirHora) {
      return data.toLocaleString('pt-BR');
    }
    return data.toLocaleDateString('pt-BR');
  } catch (e) {
    return '';
  }
};

/**
 * Capitaliza a primeira letra de cada palavra (ex: "joão silva" -> "João Silva")
 * @param {string} nome
 * @returns {string}
 */
export const capitalizarNome = (nome) => {
  if (!nome) return '';
  return nome
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
};

/**
 * Trunca um texto para um tamanho máximo, adicionando "…" no final
 * @param {string} texto
 * @param {number} maxLength
 * @returns {string}
 */
export const truncarTexto = (texto, maxLength = 25) => {
  if (!texto) return '';
  if (texto.length <= maxLength) return texto;
  return texto.slice(0, maxLength) + '…';
};