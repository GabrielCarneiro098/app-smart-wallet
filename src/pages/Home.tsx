import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTransactions } from "../services/fetchTransactions";
import { Chart } from "../components/Chart";
import GraficoMensal from "../components/GraficoMensal";
import styled from "styled-components";
import { TransactionTable } from "../components/TransactionTable";
import { TransactionModal } from "../components/TransacionModal";
import { Button } from "@mui/material";

const Balance = styled.div`
  margin: 20px 0;
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: ${(props) => props.theme.colors.card};
  border-radius: 8px;
  padding: 1rem 2rem;
`;

const Painel = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4rem;
  color: ${(props) => props.theme.colors.text};
`;

type Transacao = {
  id: string;
  createdAt: string;
  descricao: string | null;
  categoria: string | null;
  valor: number;
};

export function Home() {
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadTransactions() {
      try {
        const data = await fetchTransactions();
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          console.error("Erro ao carregar transações:", data);
        }
      } catch (err) {
        console.error("Erro ao buscar transações:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [navigate]);

  function calculateTotal() {
    return transactions.reduce((sum, t) => sum + t.valor, 0);
  }

  function calculateTotalsByCategory() {
    const totals: { [key: string]: number } = {};
    transactions.forEach((t) => {
      const category = t.categoria || "Outros";
      totals[category] = (totals[category] || 0) + t.valor;
    });
    return totals;
  }

  function getChartData() {
    const totals = calculateTotalsByCategory();
    return Object.entries(totals).map(([categoria, valor]) => ({
      label: categoria,
      value: valor,
    }));
  }

  if (loading) return <p>Carregando transações...</p>;

  return (
    <div>
      <Balance>
        <h5>Total Balance</h5>
        <h2>R$ {calculateTotal().toFixed(2)}</h2>
        <GraficoMensal transactions={transactions} />
      </Balance>

      <Painel>
        <div>
          <h1>Despesas</h1>
          <Chart data={getChartData()} />
        </div>

        <div>
          <h1>Transações</h1>
          <Button variant="contained" onClick={() => setShowModal(true)}>Adicionar Item</Button>

          <TransactionTable transactions={transactions} />

          <TransactionModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            onTransactionCreated={(nova) =>
              setTransactions((prev) => [...prev, nova])
            }
          />
        </div>
      </Painel>
    </div>
  );
}
