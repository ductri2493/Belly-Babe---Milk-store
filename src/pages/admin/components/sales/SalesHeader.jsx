import CustomNumberFormat from "../../../../utils/CustomNumberFormat";

const SalesHeader = ({ amount, change }) => (
  <div className='card-header'>
    <h5 className='m-0 mr-2 pb-3'>Bán hàng</h5>
    <div className='card-body'>
      <h3 className='card-title text-nowrap mb-2'>
        <CustomNumberFormat numStr={amount} />
      </h3>
      <small
        className={`text-${
          change >= 0 ? 'green-500' : 'red-500'
        } font-semibold`}
      >
        <i className={`bx bx-${change >= 0 ? 'up' : 'down'}-arrow-alt`} />{' '}
        {Math.abs(change)}%
      </small>
    </div>
  </div>
);

export default SalesHeader;
