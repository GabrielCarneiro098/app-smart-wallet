import { useState } from "react";
import styled from "styled-components";
import { createTransaction } from "../services/createTransaction";

type Transacao = {
  id: string;
  createdAt: string;
  descricao: string | null;
  categoria: string | null;
  valor: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onTransactionCreated: (nova: Transacao) => void;
};

const ModalOverlay = styled.div<{ visible: boolean }>`
  display: ${(props) => (props.visible ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${(props) => props.theme.colors.card};
  color: ${(props) => props.theme.colors.text};
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.95);
  animation: fadeIn 0.3s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
  }

  input {
    padding: 0.6rem;
    border: 1px solid ${(props) => props.theme.colors.border};
    border-radius: 4px;
    background: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
  }

  button {
    padding: 0.6rem 1.2rem;
    background: ${(props) => props.theme.colors.chart};
    color: ${(props) => props.theme.colors.card};
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      opacity: 0.85;
    }
  }
`;

export function TransactionModal({ visible, onClose, onTransactionCreated }: Props) {
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!descricao || !categoria || !valor) {
      alert("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const nova = await createTransaction({
        tipo,
        descricao,
        categoria,
        valor: Number(valor),
      });

      if (nova && typeof nova === "object") {
        onTransactionCreated(nova); // atualiza lista no Home
        onClose();
        setDescricao("");
        setCategoria("");
        setValor("");
      } else {
        alert("Erro ao criar transação: " + nova);
      }
    } catch (err) {
      console.error(err);
      alert("Erro inesperado ao criar transação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ModalOverlay visible={visible} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>Cadastro de Transação</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Tipo:
            <input
              type="text"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
          </label>
          <label>
            Descrição:
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </label>
          <label>
            Categoria:
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
          </label>
          <label>
            Valor:
            <input
              type="number"
              value={valor}
              onChange={(e) =>
                setValor(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}
