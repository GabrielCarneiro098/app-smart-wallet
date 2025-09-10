import { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchTransactions } from "../services/fetchTransactions";
import { Chart } from "../components/Chart";

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

const Painel = styled.div`
  display: flex;
  align-items: center;
  gap: 4rem;
  color: ${(props) => props.theme.colors.text};
  align-items: flex-start;
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

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  function calculateTotalsByCategory() {
    const totals: { [key: string]: number } = {};
    transactions.forEach((t) => {
      const category = t.categoria || "Outros";
      if (!totals[category]) totals[category] = 0;
      totals[category] += t.valor;
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

  useEffect(() => {
    async function loadTransactions() {
      const data = await fetchTransactions();
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.error("Erro ao carregar transações:", data);
      }
      setLoading(false);
    }
    loadTransactions();
  }, []);

  if (loading) return <p>Carregando transações...</p>;

  const chartData = getChartData();

  return (
    <div>
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
