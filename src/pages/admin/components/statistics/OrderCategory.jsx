import CustomNumberFormat from '../../../../utils/CustomNumberFormat';

function OrderCategory({ categoryName, totalOrders, totalSales }) {
  return (
    <li className='flex mb-4 pb-1'>
      <div className='flex w-full flex-wrap items-center justify-between gap-2'>
        <div className='mr-2'>
          <h4 className='mb-0'>
            {categoryName} ({totalOrders})
          </h4>
        </div>
        <div className=''>
          <h5 className='font-semibold '>
            <CustomNumberFormat numStr={totalSales} />
          </h5>
        </div>
      </div>
    </li>
  );
}

export default OrderCategory;
