import { Button } from "antd";
import { useState } from "react";

export default function Profit({ data }) {
  const [toggleDropDown, setToggleDropDown] = useState(false);
  const handleToggleDropdown = () => {
    setToggleDropDown(!toggleDropDown);
  };
  return (
    <>
      <div className='col-lg-6 col-md-12 col-6 mb-4'>
        <div className='card'>
          <div className='card-body'>
            <div className='card-title d-flex align-items-start justify-content-between'>
              <div className='avatar flex-shrink-0'>
                <img
                  src={"/admin-kit/assets/img/icons/unicons/chart-success.png"}
                  alt='chart success'
                  className='rounded'
                />
              </div>
              <div className='dropdown'>
                <Button
                  className='btn p-0'
                  type='button'
                  id='cardOpt3'
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
                    aria-labelledby='cardOpt3'
                  >
                    <a className='dropdown-item'>View More</a>
                    <a className='dropdown-item'>Delete</a>
                  </div>
                )}
              </div>
            </div>
            <span className='fw-semibold d-block mb-1'>Profit</span>
            <h3 className='card-title mb-2'>
              {data?.amount.toLocaleString()}VND
            </h3>
            <small
              className={`text-${
                data?.percentageChange >= 0 ? "success" : "danger"
              } fw-semibold`}
            >
              <i
                className={`bx bx-${
                  data?.percentageChange >= 0 ? "up" : "down"
                }-arrow-alt`}
              />{" "}
              {Math.abs(data?.percentageChange)}%
            </small>
          </div>
        </div>
      </div>
    </>
  );
}
