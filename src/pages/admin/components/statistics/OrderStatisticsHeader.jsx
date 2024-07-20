import TimeFrameButtons from './TimeFrameButtons';

function OrderStatisticsHeader({ timeFrame, onTimeFrameChange }) {
  return (
    <div className='card-header flex items-center justify-between'>
      <div className='card-title mb-0'>
        <h5 className='m-0 mr-4'>Thống kê đơn hàng</h5>
        {/* <small className='text-gray-500'>Tổng doanh thu</small> */}
      </div>
      <TimeFrameButtons
        timeFrame={timeFrame}
        onTimeFrameChange={onTimeFrameChange}
      />
    </div>
  );
}

export default OrderStatisticsHeader;
