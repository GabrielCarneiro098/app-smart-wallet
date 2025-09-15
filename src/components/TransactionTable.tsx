import { useState, useEffect } from "react";
import styled from "styled-components";
import { deleteTransaction } from "../services/deleteTransaction";
import type { Transacao } from "../types/types";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const TableWrapper = styled.div`
  max-height: 200px;
  overflow-y: overlay;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  thead th {
    position: sticky;
    top: 0;
    background: ${(props) => props.theme.colors.background};
    z-index: 1;
  }

  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
    transition: background 0.3s ease;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.border};
  }
  &:hover::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.text};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1rem;
  font-family: Arial, sans-serif;
  background: ${(props) => props.theme.colors.card};
  color: ${(props) => props.theme.colors.text};
  text-align: left;

  th,
  td {
    padding: 12px 15px;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }

  th {
    cursor: pointer;
    user-select: none;
  }
`;

const SortIcon = styled.span`
  margin-left: 6px;
  font-size: 0.9rem;
`;

type SortConfig = {
  key: keyof Transacao;
  direction: "asc" | "desc";
};

type Props = {
  transactions: Transacao[];
  onTransactionDeleted?: (id: string) => void;
  onEditTransaction?: (transaction: Transacao) => void;
};

export function TransactionTable({
  transactions,
  onTransactionDeleted,
  onEditTransaction,
}: Props) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [sortedData, setSortedData] = useState<Transacao[]>(transactions);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setSortedData(transactions);
  }, [transactions]);

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  function handleSort(key: keyof Transacao) {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc")
      direction = "desc";

    setSortConfig({ key, direction });

    const sorted = [...sortedData].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];

      if (valueA === null) valueA = "";
      if (valueB === null) valueB = "";

      if (typeof valueA === "string" && typeof valueB === "string") {
        return direction === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return direction === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (key === "createdAt") {
        return direction === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      return 0;
    });

    setSortedData(sorted);
  }

  function renderSortIcon(column: keyof Transacao) {
    if (sortConfig?.key !== column) return null;
    return <SortIcon>{sortConfig.direction === "asc" ? "↑" : "↓"}</SortIcon>;
  }

  async function handleDelete(id: string) {
    const result = await deleteTransaction(id);
    console.log(result);
    setSortedData((prev) => prev.filter((t) => t.id !== id));
    onTransactionDeleted?.(id);
    setDeleteId(null);
  }

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th onClick={() => handleSort("createdAt")}>
              Data {renderSortIcon("createdAt")}
            </th>
            <th onClick={() => handleSort("descricao")}>
              Descrição {renderSortIcon("descricao")}
            </th>
            <th onClick={() => handleSort("categoria")}>
              Categoria {renderSortIcon("categoria")}
            </th>
            <th onClick={() => handleSort("valor")}>
              Valor {renderSortIcon("valor")}
            </th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((t) => (
            <tr key={t.id}>
              <td>{formatDate(t.createdAt)}</td>
              <td>{t.descricao || "-"}</td>
              <td>{t.categoria || "-"}</td>
              <td>R$ {t.valor.toFixed(2)}</td>
              <td style={{ display: "flex", gap: "0.3rem" }}>
                {onEditTransaction && (
                  <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    onClick={() => onEditTransaction(t)}
                  >
                    Editar
                  </Button>
                )}
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => setDeleteId(t.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogContent>
          Tem certeza que deseja excluir esta transação?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => deleteId && handleDelete(deleteId)}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </TableWrapper>
  );
}
