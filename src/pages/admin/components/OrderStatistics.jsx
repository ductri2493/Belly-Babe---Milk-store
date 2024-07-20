import { useEffect, useState } from 'react';
import OrderStatisticsBody from './statistics/OrderStatisticsBody';
import OrderStatisticsHeader from './statistics/OrderStatisticsHeader';
import ProductCategory from '../../../services/product/product.category';
import StatisticsAPI from '../../../services/statistics';
import { Loading } from '../../../components/loader/Loading';

const transformData = (data, timeFrame) => {
  return data.map((category) => ({
    ...category,
    total:
      timeFrame === 'day'
        ? category.dailyTotal
        : timeFrame === 'week'
        ? category.weeklyTotal
        : category.monthlyTotal,
  }));
};

function OrderStatistics() {
  const [totalSales, setTotalSales] = useState([]);
  const [timeFrame, setTimeFrame] = useState('day');
  // eslint-disable-next-line no-unused-vars
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [delayedLoading, setDelayedLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoryData, statisticsData] = await Promise.all([
        ProductCategory.fetchCategories(),
        StatisticsAPI.salesByCategory(),
      ]);

      const transformedCategories = transformData(
        categoryData.$values,
        timeFrame,
      );
      setCategories(transformedCategories);
      setTotalSales(statisticsData.$values);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeFrame]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayedLoading(false);
    }, 1250);

    return () => clearTimeout(timer); // Clear the timeout if the component unmounts
  }, []);

  return (
    <div className='col-lg-6 col-md-12 col-6 w-1/2 mt-2'>
      <div className='card'>
        <OrderStatisticsHeader
          timeFrame={timeFrame}
          onTimeFrameChange={setTimeFrame}
        />
        {loading || delayedLoading ? (
          <div className='card-body flex items-center justify-center'>
            <Loading />
          </div>
        ) : error ? (
          <div className='card-body flex items-center justify-center text-red-500'>
            <span>{error}</span>
          </div>
        ) : (
          <OrderStatisticsBody totalOrders={totalSales} />
        )}
      </div>
    </div>
  );
}

export default OrderStatistics;
