import { colors } from "@mui/material";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts";

type Transacao = {
  id: string;
  createdAt: string;
  descricao: string | null;
  categoria: string | null;
  valor: number;
  tipo: "entrada" | "saida";
};

type ChartData = {
  label: string;
  value: number;
};

type ChartProps = {
  transactions: Transacao[];
  period?: "mes" | "ano";
  selectedMonth?: number;
  onPeriodChange?: (p: "mes" | "ano") => void;
  onMonthChange?: (m: number) => void;
};

export function Chart({ transactions, period, selectedMonth }: ChartProps) {
  // Filtrar transações de acordo com período
  const filtered = transactions.filter((t) => {
    if (period === "ano") return true;
    if (period === "mes" && typeof selectedMonth === "number") {
      return new Date(t.createdAt).getMonth() === selectedMonth;
    }
    return true;
  });

  // Agrupar por categoria
  const totals: { [key: string]: number } = {};
  filtered.forEach((t) => {
    const category = t.categoria || "Outros";
    totals[category] = (totals[category] || 0) + t.valor;
  });

  const data: ChartData[] = Object.entries(totals).map(([label, value]) => ({
    label,
    value,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const settings = {
    margin: { right: 5 },
    width: 300,
    height: 300,
    hideLegend: false,
    legend: { colors: colors.red, fontSize: 14, position: "bottom" },
  };

  return (
    <PieChart
      series={[
        {
          innerRadius: 60,
          outerRadius: 120,
          paddingAngle: 2,
          cornerRadius: 5,
          startAngle: -70,
          data: data,
          arcLabel: (item) => {
            const percent = total === 0 ? 0 : (item.value / total) * 100;
            return `${percent.toFixed(1)}%`;
          },
        },
      ]}
      {...settings}
      sx={{
        [`& .${pieArcLabelClasses.root}.${pieArcLabelClasses.animate}`]: {
          animationDuration: "2s",
        },
      }}
    />
  );
}
