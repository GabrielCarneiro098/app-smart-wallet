// Para criar transação
export type CreateTransactionDTO = {
  descricao: string;
  categoria: string;
  valor: number;
  tipo: "entrada" | "saida";
  origem?: string;
  metodoPagamento?: string;
};

// Para editar transação via PATCH
export type EditTransactionDTO = {
  descricao?: string;
  categoria?: string;
  valor?: number;
  tipo?: "entrada" | "saida";
};
