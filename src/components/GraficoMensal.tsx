import { useTheme } from "styled-components";
import { LineChart } from "@mui/x-charts/LineChart";
import { red } from "@mui/material/colors";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Transacao } from "../types/types";

type Props = {
  transactions: Transacao[];
  period: "ano" | "mes";
  selectedMonth: number;
  onPeriodChange: Dispatch<SetStateAction<"ano" | "mes">>;
  onMonthChange: Dispatch<SetStateAction<number>>;
};

const xLabels = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export default function GraficoMensal({
  transactions,
  period,
  selectedMonth,
  onPeriodChange,
  onMonthChange,
}: Props) {
  const theme = useTheme();
  const [visibleSeries, setVisibleSeries] = useState<
    "first" | "second" | "both"
  >("both");

  const computeSeries = () => {
    if (period === "ano") {
      const entradaMensal = new Array(12).fill(0);
      const saidaMensal = new Array(12).fill(0);

      transactions.forEach((t) => {
        const month = new Date(t.createdAt).getMonth();
        if (t.tipo === "entrada") entradaMensal[month] += t.valor;
        else if (t.tipo === "saida") saidaMensal[month] += t.valor;
      });

      const series = [];
      if (visibleSeries === "first" || visibleSeries === "both")
        series.push({
          data: entradaMensal,
          showMark: false,
          color: theme.colors.chart,
          label: "Transações",
        });
      if (visibleSeries === "second" || visibleSeries === "both")
        series.push({
          data: saidaMensal,
          showMark: false,
          color: red[500],
          label: "Gastos",
        });

      return series;
    } else {
      const daysInMonth = new Date(
        new Date().getFullYear(),
        selectedMonth + 1,
        0
      ).getDate();
      const entradaDiaria = new Array(daysInMonth).fill(0);
      const saidaDiaria = new Array(daysInMonth).fill(0);

      transactions.forEach((t) => {
        const date = new Date(t.createdAt);
        if (date.getMonth() !== selectedMonth) return;
        const day = date.getDate() - 1;
        if (t.tipo === "entrada") entradaDiaria[day] += t.valor;
        else if (t.tipo === "saida") saidaDiaria[day] += t.valor;
      });

      const series = [];
      if (visibleSeries === "first" || visibleSeries === "both")
        series.push({
          data: entradaDiaria,
          showMark: false,
          color: theme.colors.chart,
          label: "Transações",
        });
      if (visibleSeries === "second" || visibleSeries === "both")
        series.push({
          data: saidaDiaria,
          showMark: false,
          color: red[500],
          label: "Gastos",
        });

      return series;
    }
  };

  const xAxisLabels =
    period === "ano"
      ? xLabels
      : Array.from(
          {
            length: new Date(
              new Date().getFullYear(),
              selectedMonth + 1,
              0
            ).getDate(),
          },
          (_, i) => (i + 1).toString()
        );

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        <Button
          variant={visibleSeries === "first" ? "contained" : "outlined"}
          onClick={() => setVisibleSeries("first")}
        >
          Apenas Transações
        </Button>
        <Button
          variant={visibleSeries === "second" ? "contained" : "outlined"}
          onClick={() => setVisibleSeries("second")}
        >
          Apenas Gastos
        </Button>
        <Button
          variant={visibleSeries === "both" ? "contained" : "outlined"}
          onClick={() => setVisibleSeries("both")}
        >
          Mostrar Ambos
        </Button>

        {/* Select para Ano/Mês */}
        <FormControl size="small" style={{ marginLeft: "1rem", minWidth: 100 }}>
          <InputLabel>Período</InputLabel>
          <Select
            value={period}
            label="Período"
            onChange={(e) => onPeriodChange(e.target.value as "ano" | "mes")}
          >
            <MenuItem value="ano">Ano</MenuItem>
            <MenuItem value="mes">Mês</MenuItem>
          </Select>
        </FormControl>

        {/* Select para Meses */}
        {period === "mes" && (
          <FormControl
            size="small"
            style={{ marginLeft: "0.5rem", minWidth: 120 }}
          >
            <InputLabel>Mês</InputLabel>
            <Select
              value={selectedMonth}
              label="Mês"
              onChange={(e) => onMonthChange(Number(e.target.value))}
            >
              {xLabels.map((label, idx) => (
                <MenuItem key={idx} value={idx}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <LineChart
        height={300}
        series={computeSeries()}
        grid={{ horizontal: true }}
        xAxis={[{ scaleType: "point", data: xAxisLabels }]}
        yAxis={[{}]}
        margin={{ right: 24 }}
      />
    </div>
  );
}
