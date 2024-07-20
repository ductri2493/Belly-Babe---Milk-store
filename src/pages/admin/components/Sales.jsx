import { useMemo } from 'react';
import SalesComponent from './sales/SalesComponent';

export default function Sales({ amount, change }) {
  const salesData = useMemo(
    () => [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: 3000 },
      { name: 'Mar', sales: 2000 },
      { name: 'Apr', sales: 2780 },
      { name: 'May', sales: 1890 },
      { name: 'Jun', sales: 2390 },
      { name: 'Jul', sales: 3490 },
    ],
    [],
  );

  return (
    <SalesComponent amount={amount} change={change} salesData={salesData} />
  );
}
