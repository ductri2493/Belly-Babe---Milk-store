import { Button } from "antd";
import { useState } from "react";

export default function Transactions({ transactions }) {
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const handleToggleDropdown = () => {
    setToggleDropDown(!toggleDropDown);
  };
  return (
    <div className='col-md-6 col-lg-4 order-2 mb-4'>
      <div className='card h-100'>
        <div className='card-header d-flex align-items-center justify-content-between'>
          <h5 className='card-title m-0 me-2'>Transactions</h5>
          <div className='dropdown'>
            <Button
              className='btn p-0'
              type='button'
              id='transactionID'
              data-bs-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'
              onClick={handleToggleDropdown}
            >
              <i className='bx bx-dots-vertical-rounded' />
            </Button>
            {toggleDropDown && (
              <div
                className='dropdown-menu dropdown-menu-end show'
                aria-labelledby='transactionID'
              >
                <a className='dropdown-item'>Last 28 Days</a>
                <a className='dropdown-item'>Last Month</a>
                <a className='dropdown-item'>Last Year</a>
              </div>
            )}
          </div>
        </div>
        <div className='card-body'>
          <ul className='p-0 m-0'>
            {transactions?.map((transaction, index) => (
              <li key={index} className='d-flex mb-4 pb-1'>
                <div className='avatar flex-shrink-0 me-3'>
                  <img
                    src={transaction.icon}
                    alt='Transaction Icon'
                    className='rounded'
                  />
                </div>
                <div className='d-flex w-100 flex-wrap align-items-center justify-content-between gap-2'>
                  <div className='me-2'>
                    <small className='text-muted d-block mb-1'>
                      {transaction.category}
                    </small>
                    <h6 className='mb-0'>{transaction.description}</h6>
                  </div>
                  <div className='user-progress d-flex align-items-center gap-1'>
                    <h6
                      className={`mb-0 ${
                        transaction.amount >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {transaction.amount >= 0
                        ? `+${transaction.amount}`
                        : transaction.amount}
                    </h6>
                    <span className='text-muted'>USD</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
