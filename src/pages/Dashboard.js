// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
//       <div className="space-y-4">
//         <Link to="/admin/users" className="block bg-blue-500 text-white p-3 rounded">View Users</Link>
//         <Link to="/admin/products" className="block bg-green-500 text-white p-3 rounded">Manage Products</Link>
//         <Link to="/admin/orders" className="block bg-yellow-500 text-white p-3 rounded">Handle Orders</Link>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { Link } from "react-router-dom"
import { Card, CardContent, Typography, Grid, Avatar, IconButton } from "@mui/material"
import {
  People,
  Inventory,
  ShoppingCart,
  CardGiftcard,
  Dashboard as DashboardIcon,
  ArrowForward,
  TrendingUp,
  AttachMoney,
} from "@mui/icons-material"

import API from "../api/axiosInstance.js" // Adjust the import path as necessary
import { useEffect } from "react"
import { useState } from "react"



const AdminDashboard = () => {

  const [Revenue,setRevenue] = useState("0");
  const [Users,setUsers] = useState("0");
  const [Orders,setOrders] = useState("0");
  const [Products,setProducts] = useState("0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/admin/stats");

        const statsData = response.data;
        setRevenue(statsData.revenue || "0");
        setUsers(statsData.users || "0");
        setOrders(statsData.orders || "0");
        setProducts(statsData.products || "0");
      } catch (error) {
        console.error("Error fetching admin stats", error);
      }
    }
    fetchData();
  }, []);

  const dashboardItems = [
    {
      title: "Users",
      description: "Manage accounts",
      path: "/admin/users",
      icon: <People />,
      count: Users,
      color: "text-blue-600",
    },
    {
      title: "Products",
      description: "Manage inventory",
      path: "/admin/products",
      icon: <Inventory />,
      count: Products,
      color: "text-green-600",
    },
    {
      title: "Orders",
      description: "Track orders",
      path: "/admin/orders",
      icon: <ShoppingCart />,
      count: Orders,
      color: "text-orange-600",
    },
    {
      title: "Sales",
      description: "Manage campaigns",
      path: "/admin/sales",
      icon: <TrendingUp />,
      count: "",
      color: "text-purple-600",
    },
    {
      title: "Coupons",
      description: "Discount codes",
      path: "/admin/coupons",
      icon: <CardGiftcard />,
      count: "",
      color: "text-pink-600",
    },
  ]

  const stats = [
    { label: "Revenue", value: Revenue, icon: <AttachMoney /> },
    { label: "Users", value: Users, icon: <People /> },
    { label: "Orders", value: Orders, icon: <ShoppingCart /> },
    { label: "Products", value: Products, icon: <Inventory /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" className="font-light text-gray-900 mb-1">
                Dashboard
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Welcome back, manage your store
              </Typography>
            </div>
            <Avatar className="bg-gray-100 text-gray-600">
              <DashboardIcon />
            </Avatar>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Clean Stats */}
        <div className="mb-12">
          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="body2" className="text-gray-500 mb-2 font-medium">
                          {stat.label}
                        </Typography>
                        <Typography variant="h5" className="font-light text-gray-900">
                          {stat.value}
                        </Typography>
                      </div>
                      <div className="text-gray-400">{stat.icon}</div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>

        {/* Clean Action Cards */}
        <Grid container spacing={4}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Link to={item.path} className="block h-full no-underline">
                <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`${item.color} text-2xl`}>{item.icon}</div>
                      <IconButton
                        size="small"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400"
                      >
                        <ArrowForward fontSize="small" />
                      </IconButton>
                    </div>

                    <div className="mb-4">
                      <Typography variant="h6" className="font-medium text-gray-900 mb-1">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" className="text-gray-500">
                        {item.description}
                      </Typography>
                    </div>

                    <div className="flex items-center justify-between">
                      <Typography variant="h4" className="font-light text-gray-900">
                        {item.count}
                      </Typography>
                      <div className="w-12 h-1 bg-gray-100 rounded-full">
                        <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>

        {/* Clean Activity Section */}
        <div className="mt-12">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <Typography variant="h6" className="font-medium text-gray-900 mb-6">
                Recent Activity
              </Typography>
              <div className="space-y-4">
                {[
                  { text: "New user registered", time: "2m ago" },
                  { text: "Order completed", time: "15m ago" },
                  { text: "Product updated", time: "1h ago" },
                  { text: "Sale campaign started", time: "2h ago" },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <Typography variant="body2" className="text-gray-700">
                        {activity.text}
                      </Typography>
                    </div>
                    <Typography variant="caption" className="text-gray-400">
                      {activity.time}
                    </Typography>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

