import axios, { AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

type CreateTransactionDTO = {
    tipo: string
   descricao: string;
  categoria: string;
  valor: number;
  origem?: string;        
  metodoPagamento?: string
};

export async function createTransaction(data: CreateTransactionDTO) {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("Token não encontrado. Usuário não autenticado.");
    }

    const response = await axios.post(
      `${apiUrl}/transacoes`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.resultado; // retorna só os dados de criação
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(error.response.data);
      return error.response.data.mensagem;
    }

    return "Erro inesperado";
  }
}
