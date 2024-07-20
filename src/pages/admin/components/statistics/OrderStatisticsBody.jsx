import OrderCategory from './OrderCategory';

function OrderStatisticsBody({ totalOrders }) {
  return (
    <div className='card-body'>
      <div className='flex justify-between items-center mb-3'>
        <div className='flex flex-col items-center gap-1'>
          <span>Tổng số đơn đặt hàng</span>
        </div>
      </div>
      <ul className='p-0 m-0'>
        {totalOrders.length > 0 ? (
          totalOrders.map((order) => <OrderCategory key={order} {...order} />)
        ) : (
          <li className='text-center text-gray-500'>Không có danh mục nào</li>
        )}
      </ul>
    </div>
  );
}

export default OrderStatisticsBody;
