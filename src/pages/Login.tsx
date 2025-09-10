import styled from "styled-components";
import { login as fazerLogin } from "../services/login";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    cursor: pointer;
    transition: color 0.3s ease;

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

export function Login() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    const [response, setResponse] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null); // Armazena a resposta da requisição

  async function handleLogin() {

    
    const loginLower = login.toLowerCase(); // Garante lowercase
    const resposta = await fazerLogin({ login: loginLower, senha });

    if (resposta.data.sucesso === true) {
      setResponse({ success: true, message: "Login bem-sucedido!" });
      navigate("/");
    }
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleLogin(); // Chama a função de login se a tecla Enter for pressionada
    }
  }

  return (
    <div>
    <FormBox>
      <Form>
        <Title>Entrar</Title>
        <Subtitle>Use seu e-mail ou nome de usuário</Subtitle>
        <FormContainer>
          <Input type="text" placeholder="Login" value={login} onChange={(e) => setLogin(e.target.value)}/>
          <Input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} onKeyDown={handleKeyPress}/>
        </FormContainer>
        <Button type="button" onClick={handleLogin}>Login</Button>
      </Form>
      
      <FormSection>
        <p>
          Não possui conta?{" "}
          <a onClick={() => navigate("/signup")}>
            Criar conta
          </a>
        </p>
      </FormSection>
    </FormBox>
    {response && !response.success && (
            <ErrorMessage>
              <i className="bi bi-exclamation-circle"></i>
              {response.message}
            </ErrorMessage>
          )}
    </div>
  );
}
