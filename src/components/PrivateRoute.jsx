import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access-token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
