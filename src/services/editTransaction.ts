import axios, { AxiosError } from "axios";
import type { EditTransactionDTO, Transacao } from "../types/types";

const apiUrl = import.meta.env.VITE_API_URL;

export async function editTransaction(
  id: string,
  data: EditTransactionDTO
): Promise<Transacao | string> {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token não encontrado");

    const response = await axios.patch(`${apiUrl}/transacoes/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.resultado;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data.mensagem;
    }
    return "Erro inesperado";
  }
}
