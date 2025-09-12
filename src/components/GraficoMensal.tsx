import { useTheme } from "styled-components";
import { LineChart } from "@mui/x-charts/LineChart";
import { red } from "@mui/material/colors";
import { Button } from "@mui/material";
import { useState } from "react";

type Transacao = {
  id: string;
  createdAt: string;
  descricao: string | null;
  categoria: string | null;
  valor: number;
};

type Props = {
  transactions: Transacao[];
};

const margin = { right: 24 };

const teste = [100, 200, 500, 900, 60, 600, 7, 300, 90, 300, 1100, 120]; // Dados de exemplo para a segunda série
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

export default function GraficoMensal({ transactions }: Props) {
  const theme = useTheme();

  const [visibleSeries, setVisibleSeries] = useState<"first" | "second" | "both">("both");

  // Inicializa todos os meses com zero
  const monthlyData = new Array(12).fill(0);

  transactions?.forEach((t) => {
    const month = new Date(t.createdAt).getMonth(); // 0 a 11
    monthlyData[month] += t.valor;
  });

  const series = [];
  if (visibleSeries === "first" || visibleSeries === "both") {
    series.push({
      data: monthlyData,
      showMark: false,
      color: theme.colors.chart,
      label: "Transações",
    });
  }
  if (visibleSeries === "second" || visibleSeries === "both") {
    series.push({
      data: teste,
      showMark: false,
      color: red[500],
      label: "Gastos",
    });
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
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
      </div>

      <LineChart
        height={300}
        series={series}
        grid={{ horizontal: true }}
        xAxis={[{ scaleType: "point", data: xLabels }]}
        yAxis={[{ position: "none" }]}
        margin={margin}
      />
    </div>
  );
}
