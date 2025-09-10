import { LineChart, } from '@mui/x-charts/LineChart';

const margin = { right: 24 };
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export default function GraficoMensal() {
  return (
    <LineChart
      height={300}
      series={[
        {
          data: pData,
          label: 'pv',
          showMark: false,
        },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ position: 'none' }]}
      margin={margin}
    />
  );
}
