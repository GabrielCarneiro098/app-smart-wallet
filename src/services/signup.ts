import axios, { AxiosError } from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

type SignUpData = {
  nome: string;
  email: string;
  senha: string;
  username: string;
};

export async function signUp({ nome, username, email, senha }: SignUpData) {
  try {
    const response = await axios.post(`${apiUrl}/usuarios`, {
      nome,
      email,
      senha,
      username,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return {
        sucesso: false,
        mensagem: error.response.data.mensagem,
        detalhe: error.response.data.detalhe,
      };
    }

    return {
      sucesso: false,
      mensagem: "Ocorreu um erro inesperado",
    };
  }
}
