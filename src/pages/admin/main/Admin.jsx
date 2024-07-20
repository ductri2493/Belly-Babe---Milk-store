import { useSelector } from 'react-redux';
import AdminContents from '../content/AdminContents';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // console.log('currentUser', userInfo);

  if (userInfo.roleId === 3) {
    return navigate('/login-admin');
  } else if (!userInfo) {
    navigate('/login-admin');
  }
  return <AdminContents user={userInfo} />;
};

export default Admin;
