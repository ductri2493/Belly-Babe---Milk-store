import { Image } from 'antd';

import logoAdmin from '../../../assets/logo/Untitled-1-01.png';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import vouchers from '../../../assets/icons/voucher.png';
import products from '../../../assets/icons/box.png';
import blogs from '../../../assets/icons/copy-writing.png';
import orders from '../../../assets/icons/clipboard.png';

const AdminSidebarNew = () => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const handleDropdownToggle = (menu) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };
  return (
    <aside
      id='layout-menu'
      className='layout-menu menu-vertical menu bg-menu-theme'
    >
      <div className='app-brand demo !p-2'>
        {/* Logo */}
        <Link className='app-brand-link' to='/admin/dashboard'>
          <span className='app-brand-logo demo'>
            <Image src={logoAdmin} preview={false} width={30} height={30} />
          </span>
          <span className='app-brand-text demo !normal-case menu-text fw-bolder ms-2 mt-3 flex items-end text-inherit no-underline leading-none'>
            <h1 className='text-[#9c67ac] text-3xl font-bold'>Belly&</h1>
            <h1 className='text-2xl font-bold text-gray-800'>Babe</h1>
          </span>
        </Link>
        <Link className='layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none'>
          <i className='bx bx-chevron-left bx-sm align-middle' />
        </Link>
      </div>
      <div className='menu-inner-shadow' />
      <div className=''>
        <div className='menu-inner-content !w-48'>
          <ul className='menu-inner py-1'>
            {/* Dashboard */}
            <li className='menu-item active'>
              <Link
                to={'/admin/dashboard'}
                className='menu-link active:scale-95 active:transition-all'
              >
                <i className='menu-icon tf-icons bx bx-home-circle' />
                <div data-i18n='Analytics'>Dashboard</div>
              </Link>
            </li>
            {/* Manage */}
            <li className='menu-header small text-uppercase'>
              <span className='menu-header-text'>Quản Lí</span>
            </li>
            <li className={`menu-item ${openDropdowns.accounts ? 'open' : ''}`}>
              <a
                className='menu-link menu-toggle'
                onClick={() => handleDropdownToggle('accounts')}
              >
                <i className='menu-icon tf-icons bx bx-dock-top' />
                <div data-i18n='Account Settings'>Tài Khoản</div>
              </a>
              <ul className='menu-sub'>
                {/*User Account */}
                <li className='menu-item'>
                  <Link to={'manage/user'} className='menu-link'>
                    <div data-i18n='Account'>Tài khoản khách hàng</div>
                  </Link>
                </li>
                {/*Staff Account */}
                <li className='menu-item'>
                  <Link to={'manage/staff'} className='menu-link'>
                    <div data-i18n='Notifications'>Tài khoản nhân viên</div>
                  </Link>
                </li>
              </ul>
            </li>
            {/* Products */}
            <li className={`menu-item ${openDropdowns.products ? 'open' : ''}`}>
              <a
                className='menu-link menu-toggle'
                onClick={() => handleDropdownToggle('products')}
              >
                {/* <i className='menu-icon tf-icons bx bx-lock-open-alt' /> */}
                <img
                  src={products}
                  className='bx pr-[5px] mr-[5px]'
                  width={'15%'}
                />
                <div data-i18n='Products'>Sản Phẩm</div>
              </a>
              <ul className='menu-sub'>
                <li className='menu-item'>
                  <Link to={'manage/product'} className='menu-link'>
                    <div data-i18n='Create'>Quản lí sản phẩm</div>
                  </Link>
                </li>
              </ul>
            </li>
            {/* Blogs */}
            <li className={`menu-item ${openDropdowns.blogs ? 'open' : ''}`}>
              <a
                className='menu-link menu-toggle'
                onClick={() => handleDropdownToggle('blogs')}
              >
                {/* <i className='menu-icon tf-icons bx bx-cube-alt' /> */}
                <img
                  src={blogs}
                  className='bx pr-[5px] mr-[5px]'
                  width={'15%'}
                />
                <div data-i18n='Blogs'>Bài Viết</div>
              </a>
              <ul className='menu-sub'>
                <li className='menu-item'>
                  <Link to='manage/blog' className='menu-link'>
                    <div data-i18n='Blogs'>Quản lí bài viết</div>
                  </Link>
                </li>
              </ul>
            </li>
            {/* Orders */}
            <li className={`menu-item ${openDropdowns.orders ? 'open' : ''}`}>
              <a
                className='menu-link menu-toggle'
                onClick={() => handleDropdownToggle('orders')}
              >
                {/* <i className='menu-icon tf-icons bx bx-cube-alt' />
                 */}
                <img
                  src={orders}
                  className='bx pr-[5px] mr-[5px]'
                  width={'15%'}
                />
                <div data-i18n='Orders'>Đơn Hàng</div>
              </a>
              <ul className='menu-sub'>
                <li className='menu-item'>
                  <Link to='manage/order' className='menu-link'>
                    <div data-i18n='Orders'>Quản lí đơn hàng</div>
                  </Link>
                </li>
                <li className='menu-item'>
                  <Link to='manage/pre-order' className='menu-link'>
                    <div data-i18n='Orders'>Quản lí đơn đặt hàng</div>
                  </Link>
                </li>
              </ul>
            </li>
            <li className={`menu-item ${openDropdowns.vouchers ? 'open' : ''}`}>
              <a
                className='menu-link menu-toggle'
                onClick={() => handleDropdownToggle('vouchers')}
              >
                {/* <i className='menu-icon tf-icons bx bx-cube-alt' /> */}
                <img
                  src={vouchers}
                  className='bx pr-[5px] mr-[5px]'
                  width={'15%'}
                />
                <div data-i18n='Vouchers'>Mã Giảm Giá</div>
              </a>
              <ul className='menu-sub'>
                <li className='menu-item'>
                  <Link to='manage/voucher' className='menu-link'>
                    <div data-i18n='Vouchers'>Quản lí mã giảm giá</div>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebarNew;
