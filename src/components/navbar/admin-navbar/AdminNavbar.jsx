/* eslint-disable no-unused-vars */
import { useEffect } from 'react';

// assets
import logo from '../../../assets/logo/Untitled-1-01.png';
import { useNavigate } from 'react-router-dom';
import { Avatar, Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/features/admin/auth/authSlice';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const AdminNavbar = () => {
  const { userInfo: currentUser } = useSelector((state) => state.auth);
  // console.log(currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login-admin');
  };

  useEffect(() => {
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      const decodedJwt = jwtDecode(userToken);
      const currentTime = Date.now();
      const tokenExpiryTime = decodedJwt?.exp * 1000;
      const remainingTime = tokenExpiryTime - currentTime;

      if (remainingTime <= 0) {
        handleLogout();
        toast.warn('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        });
      }
    }
  }, [location]);

  return (
    <>
      {/* <nav className='layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme'> */}
      <nav>
        {/* <div className='layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none'>
          <a className='nav-item nav-link px-0 me-xl-4'>
            <i className='bx bx-menu bx-sm' />
          </a>
        </div> */}
        <div className='navbar-nav-right d-flex align-items-center relative z-10'>
          <Dropdown
            className='navbar-nav flex-row align-items-center ms-auto'
            menu={{
              items: [
                {
                  title: 'Hồ sơ',
                  label: 'Hồ sơ của bạn',
                  icon: <i className='bx bx-user me-2' />,
                  onClick: () => navigate('/admin/profile'),
                },
                {
                  title: 'Đăng Xuất',
                  label: 'Đăng xuất',
                  icon: <i className='bx bx-power-off me-2' />,
                  onClick: handleLogout,
                },
              ],
            }}
          >
            <div className='flex mt-2'>
              <div className='flex-grow-1'>
                <span className='fw-semibold d-block'>
                  {currentUser.fullName}
                </span>
                <small className='text-muted items-center justify-end flex'>
                  {currentUser.roleId === 1 ? (
                    <span className='badge bg-label-danger me-1'>
                      {'Quản trị viên'}
                    </span>
                  ) : (
                    <span className='badge bg-label-warning me-1'>
                      {'Nhân viên'}
                    </span>
                  )}
                </small>
              </div>
              <div className='flex-shrink-0 me-3'>
                <div className='avatar avatar-online'>
                  <Avatar
                    src={currentUser.image}
                    alt={currentUser.userName}
                    className='w-px-40 h-auto rounded-circle'
                  />
                </div>
              </div>
            </div>
          </Dropdown>
        </div>
      </nav>
      <ToastContainer />
    </>
  );
};

export default AdminNavbar;
