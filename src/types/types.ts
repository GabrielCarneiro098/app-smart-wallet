export type Transacao = {
  id: string;
  createdAt: string; // sempre string para compatibilidade
  descricao: string | null;
  categoria: string | null;
  valor: number;
  tipo: "entrada" | "saida";
  origem?: string | null;
  metodoPagamento?: string | null;
};

// DTOs centralizados
export type CreateTransactionDTO = Omit<Transacao, "id" | "createdAt">;
export type EditTransactionDTO = Partial<CreateTransactionDTO>;
