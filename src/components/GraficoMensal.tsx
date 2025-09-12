import { useTheme } from "styled-components";
import { LineChart } from "@mui/x-charts/LineChart";

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

  // Inicializa todos os meses com zero
  const monthlyData = new Array(12).fill(0);

  transactions?.forEach((t) => {
    const month = new Date(t.createdAt).getMonth(); // 0 a 11
    monthlyData[month] += t.valor;
  });

  return (
    <LineChart
      height={300}
      series={[
        {
          data: monthlyData,
          showMark: false,
          color: theme.colors.chart,
        },
      ]}
      grid={{ horizontal: true }}
      xAxis={[{ scaleType: "point", data: xLabels }]}
      yAxis={[{ position: "none" }]}
      margin={margin}
    />
  );
}
