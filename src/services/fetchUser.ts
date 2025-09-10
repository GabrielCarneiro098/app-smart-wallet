import axios, { AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export async function fetchTransactions() {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return { sucesso: false, resultado: null, mensagem: "Token não encontrado. Usuário não autenticado." };
    }

    const response = await axios.get(`${apiUrl}/transacoes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      sucesso: true,
      resultado: response.data.resultado,
      mensagem: null,
    };
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return {
        sucesso: false,
        resultado: null,
        mensagem: error.response.data.mensagem || "Erro na requisição",
      };
    }

    return {
      sucesso: false,
      resultado: null,
      mensagem: "Erro inesperado",
    };
  }
}