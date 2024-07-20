import { useMemo } from 'react';
import SalesHeader from './SalesHeader';
import SalesChart from './SalesChart';

export default function SalesComponent({ amount, change, salesData }) {
  const data = useMemo(() => salesData, [salesData]);

  return (
    <div className='col-lg-6 col-md-12 col-6 w-full'>
      <div className='card'>
        <SalesHeader amount={amount} change={change} />
        <SalesChart data={data} />
      </div>
    </div>
  );
}
