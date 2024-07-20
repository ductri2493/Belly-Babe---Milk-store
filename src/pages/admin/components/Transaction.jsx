import { Button } from "antd";
import { useState } from "react";

export default function Transaction({ title, amount, change }) {
  const [toggleDropDown, setToggleDropDown] = useState(false);

  const handleToggleDropdown = () => {
    setToggleDropDown(!toggleDropDown);
  };

  return (
    <div className='col-6 mb-4'>
      <div className='card'>
        <div className='card-body'>
          <div className='card-title d-flex align-items-start justify-content-between'>
            <div className='avatar flex-shrink-0'>
              <img
                src='/admin-kit/assets/img/icons/unicons/cc-primary.png'
                alt='Credit Card'
                className='rounded'
              />
            </div>
            <div className='dropdown'>
              <Button
                className='btn p-0'
                type='button'
                id='cardOpt1'
                aria-haspopup='true'
                aria-expanded={toggleDropDown}
                onClick={handleToggleDropdown}
              >
                <i className='bx bx-dots-vertical-rounded' />
              </Button>
              {toggleDropDown && (
                <div className='dropdown-menu show' aria-labelledby='cardOpt1'>
                  <a className='dropdown-item'>View More</a>
                  <a className='dropdown-item'>Delete</a>
                </div>
              )}
            </div>
          </div>
          <span className='fw-semibold d-block mb-1'>{title}</span>
          <h3 className='card-title mb-2'>{`$${amount}`}</h3>
          <small className='text-success fw-semibold'>
            <i className='bx bx-up-arrow-alt' /> {change}
          </small>
        </div>
      </div>
    </div>
  );
}
