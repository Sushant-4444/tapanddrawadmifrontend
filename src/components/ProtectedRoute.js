import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component }) => {
  const isAdmin = localStorage.getItem("adminToken"); // Check if admin is logged in

  return isAdmin ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
