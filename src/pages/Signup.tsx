import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../services/signup";

// Container principal do formulário
const FormBox = styled.div`
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  background: ${(props) => props.theme.colors.card};
  overflow: hidden;
  border-radius: ${(props) => props.theme.borderRadius.md};
  color: ${(props) => props.theme.colors.text};
`;

// Formulário
const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 32px 24px 24px;
  gap: 16px;
  text-align: center;
`;

// Título
const Title = styled.span`
  font-weight: bold;
  font-size: 1.6rem;
`;

// Subtítulo
const Subtitle = styled.span`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.textSecondary};
`;

// Container dos inputs
const FormContainer = styled.div`
  overflow: hidden;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background-color: ${(props) => props.theme.colors.background};
  margin: 1rem 0 0.5rem;
  width: 100%;
`;

// Input
const Input = styled.input`
  background: none;
  border: 0;
  outline: 0;
  height: 40px;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  font-size: 0.9rem;
  padding: 8px 15px;
  color: ${(props) => props.theme.colors.text};
`;

// Botão de envio
const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.card};
  border: 0;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: 10px 16px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.85;
  }
`;

// Seção inferior do formulário
const FormSection = styled.div`
  padding: 16px;
  font-size: 0.85rem;
  background-color: ${(props) => props.theme.colors.border};
  box-shadow: rgb(0 0 0 / 8%) 0 -1px;

  a {
    font-weight: bold;
    color: ${(props) => props.theme.colors.primary};
    transition: color 0.3s ease;
    cursor: pointer;

    &:hover {
      opacity: 0.85;
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
  gap: 0.5rem;
  display: flex;
`;

export function SignUp() {
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [response, setResponse] = useState<{
    success?: boolean;
    message?: string;
    detalhe?: string;
  } | null>(null);

  const navigate = useNavigate();

  async function handleSignUp() {
    // limpa mensagem anterior antes de chamar a API
    setResponse(null);

    try {
      const resposta = await signUp({ nome, username, email, senha });
      // service retorna response.data diretamente => usar resposta.sucesso
      if (!resposta || resposta.sucesso !== true) {
        setResponse({
          success: false,
          message: resposta?.mensagem || "Erro inesperado",
          detalhe: resposta?.detalhe,
        });
        return;
      }

      // sucesso
      setResponse({ success: true, message: "Cadastro bem-sucedido!" });
      navigate("/login");
    } catch {
      setResponse({
        success: false,
        message: "Erro de conexão. Tente novamente.",
      });
    }
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSignUp();
    }
  }

  return (
    <div>
      <FormBox>
        <Form>
          <Title>Criar conta</Title>
          <Subtitle>Crie sua conta agora.</Subtitle>
          <FormContainer>
            <Input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </FormContainer>
          <Button type="button" onClick={handleSignUp}>
            Sign up
          </Button>
        </Form>
        <FormSection>
          <p>
            Já possui uma conta?{" "}
            <a onClick={() => navigate("/login")}>Log in</a>
          </p>
        </FormSection>
      </FormBox>

      {response && !response.success && (
        <ErrorMessage>
          <i className="bi bi-exclamation-circle"></i>
          {response.detalhe}
        </ErrorMessage>
      )}
    </div>
  );
}
