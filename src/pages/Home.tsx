import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchTransactions } from "../services/fetchTransactions";
import { Chart } from "../components/Chart";
import { useNavigate } from "react-router-dom";
import GraficoMensal from "../components/GraficoMensal";

const TransactionTable = styled.table`
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1rem;
  font-family: Arial, sans-serif;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: ${(props) => props.theme.colors.card};
  color: ${(props) => props.theme.colors.text};
  border-radius: 8px;
  overflow: hidden;
  text-align: left;

  th,
  td {
    padding: 12px 15px;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }

  thead {
    background: ${(props) => props.theme.colors.background};
  }
`;

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

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Calcula total por categoria
  function calculateTotalsByCategory() {
    const totals: { [key: string]: number } = {};
    transactions.forEach((t) => {
      const category = t.categoria || "Outros";
      totals[category] = (totals[category] || 0) + t.valor;
    });
    return totals;
  }

  // Calcula total geral
  function calculateTotal() {
    return transactions.reduce((sum, t) => sum + t.valor, 0);
  }

  // Prepara dados para o gráfico
  function getChartData() {
    const totals = calculateTotalsByCategory();
    return Object.entries(totals).map(([categoria, valor]) => ({
      label: categoria,
      value: valor,
    }));
  }

  if (loading) return <p>Carregando transações...</p>;

  const chartData = getChartData();

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
          <Chart data={chartData} />
        </div>
        <div>
          <h1>Transações</h1>
          <TransactionTable>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td>{formatDate(t.createdAt)}</td>
                  <td>{t.descricao || "-"}</td>
                  <td>{t.categoria || "-"}</td>
                  <td>R$ {t.valor.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </TransactionTable>
        </div>
      </Painel>
    </div>
  );
}
