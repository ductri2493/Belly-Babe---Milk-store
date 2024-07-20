// src/components/AuthWrapper.js
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo.token) {
    return <Navigate to='/login-admin' replace />;
  }

  return children;
};

export default ProtectedRoute;
