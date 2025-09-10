import { colors } from "@mui/material";
import { PieChart } from "@mui/x-charts";

type ChartData = {
  label: string;
  value: number;
};

type ChartProps = {
  data: ChartData[];
};

export function Chart({ data }: ChartProps) {
  const settings = {
    margin: { right: 5 },
    width: 300,
    height: 300,
    hideLegend: false,
    legend: { colors: colors.red, fontSize: 140, position: "bottom" },
  };

  return (
    <PieChart
      series={[
        {
          innerRadius: 60,
          outerRadius: 120,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -100,
          endAngle: 225,
          data,
          arcLabel: "value",
        },
      ]}
      {...settings}
    />
  );
}
