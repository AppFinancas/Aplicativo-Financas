// Definição dos métodos de pagamento possíveis (use enum ou type)
export type MetodoPagamento = 'credito' | 'debito' | 'dinheiro' | 'pix' | 'outro';

// Interface principal da Transação
export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  tipo: 'receita' | 'despesa';
  metodo_pagamento: MetodoPagamento; 
  data?: string; // opcional, se vier do backend
}

// Se quiser, pode definir também o tipo para as props de componentes
export type TransacaoSemId = Omit<Transacao, 'id' | 'data'>; // usado para criar nova