import axios, { AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export async function deleteTransaction(id: string): Promise<string | void> {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token não encontrado");

    await axios.delete(`${apiUrl}/transacoes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return "Transação excluída com sucesso";
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response.data.mensagem;
    }
    return "Erro inesperado";
  }
}
