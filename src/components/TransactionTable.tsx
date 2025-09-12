import { useState, useEffect } from "react";
import styled from "styled-components";

const TableWrapper = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  /* header fixo */
  thead th {
    position: sticky;
    top: 0;
    background: ${(props) => props.theme.colors.background};
    z-index: 1;
  }

  /* Scrollbar invisível por padrão */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
    transition: background 0.3s ease; /* animação suave */
  }

  /* Só aparece com hover */
  &:hover::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.border};
  }

  &:hover::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.text};
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Firefox */
  scrollbar-width: none; /* invisível por padrão */
  &:hover {
    scrollbar-width: thin; /* aparece ao hover */
    scrollbar-color: ${(props) => props.theme.colors.border} transparent;
    transition: scrollbar-color 0.3s ease;
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

type Transacao = {
  id: string;
  createdAt: string;
  descricao: string | null;
  categoria: string | null;
  valor: number;
};

type SortConfig = {
  key: keyof Transacao;
  direction: "asc" | "desc";
};

type Props = {
  transactions: Transacao[];
};

export function TransactionTable({ transactions }: Props) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [sortedData, setSortedData] = useState<Transacao[]>(transactions);

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

    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

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
    return (
      <SortIcon>{sortConfig.direction === "asc" ? "↑" : "↓"}</SortIcon>
    );
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
          </tr>
        </thead>
        <tbody>
          {sortedData.map((t) => (
            <tr key={t.id}>
              <td>{formatDate(t.createdAt)}</td>
              <td>{t.descricao || "-"}</td>
              <td>{t.categoria || "-"}</td>
              <td>R$ {t.valor.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
}
