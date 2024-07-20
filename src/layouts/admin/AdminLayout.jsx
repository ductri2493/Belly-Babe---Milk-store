import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebarNew from '../../components/siderbar/admin-sidebar/AdminSidebarNew';
import AdminNavbar from '../../components/navbar/admin-navbar/AdminNavbar';
import AdminFooter from '../../components/footer/admin/AdminFooter';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const AdminLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || userInfo.roleId === 3) {
      // roleId 3 is for ROLE_CUSTOMER
      navigate('/login-admin');
    }
  }, [userInfo, navigate]);

  return (
    <>
      {/* Layout wrapper */}
      <div className='layout-wrapper layout-content-navbar'>
        <div className='layout-container'>
          {/* Menu */}
          <AdminSidebarNew />
          {/* / Menu */}
          {/* Layout container */}
          <div className='layout-page'>
            {/* Navbar */}
            <AdminNavbar />
            {/* / Navbar */}
            {/* Content wrapper */}
            <div className='content-wrapper'>
              {/* Content */}
              <Outlet />
              {/* / Content */}
              <div className='content-backdrop fade' />
            </div>
            <AdminFooter />
            {/* Content wrapper */}
          </div>
          {/* / Layout page */}
        </div>
        {/* Overlay */}
        <div className='layout-overlay layout-menu-toggle' />
      </div>
      {/* Layout wrapper */}
    </>
  );
};

export default AdminLayout;
