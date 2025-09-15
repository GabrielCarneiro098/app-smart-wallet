import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTransactions } from "../services/fetchTransactions";
import { Chart } from "../components/Chart";
import GraficoMensal from "../components/GraficoMensal";
import styled from "styled-components";
import { TransactionTable } from "../components/TransactionTable";
import { TransactionModal } from "../components/TransacionModal";
import { Button } from "@mui/material";
import type { Transacao } from "../types/types";

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

export function Home() {
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transacao | null>(null);
  const [filter, setFilter] = useState<"todas" | "entrada" | "saida">("todas");
  const [period, setPeriod] = useState<"ano" | "mes">("ano");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
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
        if (Array.isArray(data)) setTransactions(data);
        else console.error("Erro ao carregar transações:", data);
      } catch (err) {
        console.error("Erro ao buscar transações:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTransactions();
  }, [navigate]);

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "todas") return true;
    return t.tipo === filter;
  });

  const totalBalance = filteredTransactions.reduce((sum, t) => {
    const date = new Date(t.createdAt);
    if (period === "mes" && date.getMonth() !== selectedMonth) return sum;
    return sum + t.valor;
  }, 0);

  if (loading) return <p>Carregando transações...</p>;

  return (
    <div>
      <Balance>
        <h5>Total Balance</h5>
        <h2>R$ {totalBalance.toFixed(2)}</h2>
        <GraficoMensal
          transactions={filteredTransactions}
          period={period}
          selectedMonth={selectedMonth}
          onPeriodChange={setPeriod}
          onMonthChange={setSelectedMonth}
        />
      </Balance>

      <div
        style={{
          marginBottom: "1rem",
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
        }}
      >
        <Button
          variant={filter === "todas" ? "contained" : "outlined"}
          onClick={() => setFilter("todas")}
        >
          Todas
        </Button>
        <Button
          variant={filter === "entrada" ? "contained" : "outlined"}
          onClick={() => setFilter("entrada")}
        >
          Entradas
        </Button>
        <Button
          variant={filter === "saida" ? "contained" : "outlined"}
          onClick={() => setFilter("saida")}
        >
          Saídas
        </Button>
      </div>

      <Painel>
        <div>
          <h1>Gráfico</h1>
          <Chart
            transactions={filteredTransactions}
            period={period}
            selectedMonth={selectedMonth}
          />
        </div>

        <div>
          <h1>Transações</h1>
          <Button variant="contained" onClick={() => setShowModal(true)}>
            Adicionar Item
          </Button>

          <TransactionTable
            transactions={filteredTransactions}
            onEditTransaction={(t) => {
              setEditingTransaction(t);
              setShowModal(true);
            }}
            onTransactionDeleted={(id) =>
              setTransactions((prev) => prev.filter((t) => t.id !== id))
            }
          />

          <TransactionModal
            visible={showModal}
            transaction={editingTransaction}
            onClose={() => {
              setShowModal(false);
              setEditingTransaction(null);
            }}
            onTransactionCreated={(nova) => {
              if (editingTransaction) {
                setTransactions((prev) =>
                  prev.map((t) => (t.id === nova.id ? nova : t))
                );
              } else {
                setTransactions((prev) => [...prev, nova]);
              }
              setEditingTransaction(null);
            }}
          />
        </div>
      </Painel>
    </div>
  );
}
