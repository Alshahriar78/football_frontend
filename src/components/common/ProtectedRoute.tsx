import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authStorage } from '../../utils/auth';

const ProtectedRoute = () => {
  const location = useLocation();

  if (!authStorage.isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;