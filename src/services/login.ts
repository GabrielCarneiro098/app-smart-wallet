import axios, { AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

type LoginData = {
  login: string;
  senha: string;
};

export async function login({ login, senha }: LoginData) {
  try {
    const response = await axios.post(`${apiUrl}/login`, {
      login,
      senha,
    });

    console.log(response.data.dados.usuarioLogado);
    localStorage.setItem(
      "authToken",
      response.data.dados.usuarioLogado.authToken
    );
    localStorage.setItem("userId", response.data.dados.usuarioLogado.id);

    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      console.log(error.response.data);
      return error.response.data.mensagem;
    }

    return "Erro inesperado";
  }
}
