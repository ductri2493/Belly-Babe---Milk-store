import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Revenue() {
  const lineChartData = [
    { name: 'Jan', 2021: 10, 2020: -10 },
    { name: 'Feb', 2021: 15, 2020: -5 },
    { name: 'Mar', 2021: 5, 2020: -15 },
    { name: 'Apr', 2021: 20, 2020: -20 },
    { name: 'May', 2021: 10, 2020: -10 },
    { name: 'Jun', 2021: 25, 2020: -5 },
    { name: 'Jul', 2021: 30, 2020: -10 },
  ];

  return (
    <div className='col-4 col-lg-5 order-2 order-md-2 order-lg-2 mb-4 w-full'>
      <div className='card'>
        <div className='row row-bordered g-0'>
          <div className='col-lg-11'>
            <h5 className='card-header pb-3'>Tổng doanh thu</h5>
            <div className='items-center justify-center flex pb-4 mx-2'>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='name' />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Legend />
                  <Line type='monotone' dataKey='2021' stroke='#7265E6' />
                  <Line type='monotone' dataKey='2020' stroke='#5CE4D8' />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
