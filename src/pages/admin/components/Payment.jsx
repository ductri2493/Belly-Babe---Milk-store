import { Button } from "antd";
import { useState } from "react";
import CustomNumberFormat from "../../../utils/CustomNumberFormat";

export default function Payment({ paymentInfo }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (!paymentInfo) {
    return (
      <div className='col-6 mb-4'>
        <div className='card'>
          <div className='card-body'>
            <p>Loading payment information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='col-6 mb-4'>
      <div className='card'>
        <div className='card-body'>
          <div className='card-title d-flex align-items-start justify-content-between'>
            <div className='avatar flex-shrink-0'>
              <img
                src={"/admin-kit/assets/img/icons/unicons/paypal.png"}
                alt='Credit Card'
                className='rounded'
              />
            </div>
            <div className='dropdown'>
              <Button
                className='btn p-0'
                type='button'
                id='cardOpt4'
                aria-haspopup='true'
                aria-expanded={isDropdownOpen}
                onClick={handleToggleDropdown}
              >
                <i className='bx bx-dots-vertical-rounded' />
              </Button>
              {isDropdownOpen && (
                <div
                  className='dropdown-menu dropdown-menu-end show'
                  aria-labelledby='cardOpt4'
                >
                  <a className='dropdown-item' href='#'>
                    View More
                  </a>
                  <a className='dropdown-item' href='#'>
                    Delete
                  </a>
                </div>
              )}
            </div>
          </div>
          <span className='d-block mb-1'>Payments</span>
          <h3 className='card-title text-nowrap mb-2 mr-auto pr-auto'>
            {<CustomNumberFormat numStr={paymentInfo.amount} /> || "Loading..."}
          </h3>
          <small
            className={`fw-semibold ${
              paymentInfo.change > 0 ? "text-success" : "text-danger"
            }`}
          >
            <i
              className={`bx ${
                paymentInfo.change > 0 ? "bx-up-arrow-alt" : "bx-down-arrow-alt"
              }`}
            />{" "}
            {paymentInfo.change || "N/A"}
          </small>
        </div>
      </div>
    </div>
  );
}
