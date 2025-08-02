import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js";
import Dashboard from "./pages/Dashboard.js";
import Users from "./pages/Users.js";
import Products from "./pages/Product.js";
import Orders from "./pages/Orders.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import AdminDashboard from "./pages/Product-Dashboard.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute component={Dashboard} />} />
        <Route path="/admin/users" element={<ProtectedRoute component={Users} />} />
        <Route path="/admin/products" element={<ProtectedRoute component={Products} />} />
        <Route path="/admin/orders" element={<ProtectedRoute component={Orders} />} />
      </Routes>
    </Router>
  );
}

export default App;
