import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SalesChart = ({ data }) => (
  <div className='mt-4'>
    <ResponsiveContainer width='100%' height={200}>
      <BarChart data={data}>
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='sales' fill='#8884d8' />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default SalesChart;
