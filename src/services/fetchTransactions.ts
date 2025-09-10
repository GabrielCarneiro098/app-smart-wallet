import axios, { AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export async function fetchTransactions() {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("Token não encontrado. Usuário não autenticado.");
    }

    const response = await axios.get(`${apiUrl}/transacoes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.resultado; // retorna só os dados da API
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.error(error.response.data);
      return error.response.data.mensagem;
    }

    return "Erro inesperado";
  }
}
