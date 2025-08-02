// import React, { useEffect, useState } from "react";
// import API from "../api/axiosInstance.js";

// const Orders = () => {
//     const [orders, setOrders] = useState([]);
//     const [filteredOrders, setFilteredOrders] = useState([]);
//     const [filter, setFilter] = useState({ userId: "", orderId: "", status: "" });
//     const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
//     const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order details
//     const [userDetails, setUserDetails] = useState(null); // State for user details
//     const [adrressDetails, setAddressDetails] = useState(null); // State for address details
//     const [productDetails, setProductDetails] = useState([]); // State for product details
//     const [showModal, setShowModal] = useState(false); // State to toggle modal visibility

//     const [currentPage, setCurrentPage] = useState(1); // Current page number
//     const [limit, setLimit] = useState(10); // Number of orders per page
//     const [hasMore, setHasMore] = useState(false); // Whether there are more orders to fetch

//     useEffect(() => {
//         fetchOrders();
//     }, [currentPage, limit]);

//     const fetchOrders = async () => {
//         try {
//             const response = await API.get("/orders", {
//                 params: {
//                     new: false, // Fetch all orders
//                     reverse: true, // Fetch latest orders first
//                     page: currentPage,
//                     limit: limit,
//                 },
//             });

//             const fetchedOrders = response.data;
//             setHasMore(fetchedOrders.length === limit); // Check if there are more orders
//             setOrders(fetchedOrders);
//             setFilteredOrders(fetchedOrders);
//         } catch (error) {
//             console.error("Error fetching orders with details", error);
//         }
//     };

//     const handleFilterChange = (e) => {
//         const { name, value } = e.target;
//         setFilter({ ...filter, [name]: value });
//     };

//     const handleDateFilterChange = (e) => {
//         const { name, value } = e.target;
//         setDateFilter({ ...dateFilter, [name]: value });
//     };

//     const applyFilter = async () => {
//         try {
//             const queryParams = {
//                 userId: filter.userId || undefined,
//                 orderId: filter.orderId || undefined,
//                 status: filter.status || undefined,
//                 startDate: dateFilter.startDate ? String(dateFilter.startDate) : undefined,
//                 endDate: dateFilter.endDate ? String(dateFilter.endDate) : undefined,
//                 new: false, // Set to false to fetch all orders
//                 page: currentPage,
//                 limit: limit,
//             };

//             const response = await API.get("/orders", { params: queryParams });
//             setFilteredOrders(response.data);
//         } catch (error) {
//             console.error("Error applying filter", error);
//         }
//     };

//     const viewOrderDetails = async (orderId) => {
//         try {
//             const response = await API.get(`/orders/findbyorderid/${orderId}`);
//             const order = response.data;

//             // Fetch user details
//             const userResponse = await API.get(`/users/find/${order.userId}`);
//             setUserDetails(userResponse.data);

//             // Fetch product details
//             const productResponses = await Promise.all(
//                 order.products.map((product) =>
//                     API.get(`/products/find/${product.productId}`)
//                 )
//             );
//             setProductDetails(productResponses.map((res) => res.data));

//             setAddressDetails(order.address); // Set address details

//             setSelectedOrder(order);
//             setShowModal(true); // Show the modal with order details
//         } catch (error) {
//             console.error("Error fetching order details", error);
//         }
//     };

//     const closeModal = () => {
//         setShowModal(false);
//         setSelectedOrder(null);
//         setUserDetails(null);
//         setProductDetails([]);
//     };

//     const updateOrderStatus = async (orderId, status) => {
//         try {
//             await API.put(`/orders/${orderId}`, { status });
//             fetchOrders();
//         } catch (error) {
//             console.error("Error updating order status", error);
//         }
//     };

//     const deleteOrder = async (orderId) => {
//         try {
//             await API.delete(`/orders/${orderId}`);
//             fetchOrders();
//         } catch (error) {
//             console.error("Error deleting order", error);
//         }
//     };

//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <h2 className="text-3xl font-bold mb-6 text-center">Order Management</h2>

//             {/* Filters Section */}
//             <div className="mb-6 bg-white shadow-md rounded p-4">
//                 <h3 className="text-xl font-semibold mb-4">Filters</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <input
//                         type="text"
//                         name="userId"
//                         placeholder="Filter by User ID"
//                         value={filter.userId}
//                         onChange={handleFilterChange}
//                         className="p-2 border rounded w-full"
//                     />
//                     <input
//                         type="text"
//                         name="orderId"
//                         placeholder="Filter by Order ID"
//                         value={filter.orderId}
//                         onChange={handleFilterChange}
//                         className="p-2 border rounded w-full"
//                     />
//                     <select
//                         name="status"
//                         value={filter.status}
//                         onChange={handleFilterChange}
//                         className="p-2 border rounded w-full"
//                     >
//                         <option value="">Filter by Status</option>
//                         <option value="pending">Pending</option>
//                         <option value="shipped">Shipped</option>
//                         <option value="completed">Completed</option>
//                         <option value="cancelled">Cancelled</option>
//                         <option value="cancellation requested">Cancellation Requested</option>
//                     </select>
//                     <button
//                         onClick={applyFilter}
//                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
//                     >
//                         Apply Filter
//                     </button>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                     <input
//                         type="date"
//                         name="startDate"
//                         value={dateFilter.startDate}
//                         onChange={handleDateFilterChange}
//                         className="p-2 border rounded w-full"
//                     />
//                     <input
//                         type="date"
//                         name="endDate"
//                         value={dateFilter.endDate}
//                         onChange={handleDateFilterChange}
//                         className="p-2 border rounded w-full"
//                     />
//                     <button
//                         onClick={applyFilter}
//                         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full col-span-2"
//                     >
//                         Apply Date Filter
//                     </button>
//                 </div>
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex justify-between items-center my-4">
//                 <div>
//                     <label className="mr-2">Orders per page:</label>
//                     <select
//                         value={limit}
//                         onChange={(e) => {
//                             setLimit(parseInt(e.target.value));
//                             setCurrentPage(1); // Reset to the first page when limit changes
//                         }}
//                         className="p-2 border rounded"
//                     >
//                         <option value={5}>5</option>
//                         <option value={10}>10</option>
//                         <option value={20}>20</option>
//                     </select>
//                 </div>
//                 <div>
//                     <button
//                         onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                         disabled={currentPage === 1}
//                         className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//                     >
//                         Previous
//                     </button>
//                     <span className="mx-4">Page {currentPage}</span>
//                     <button
//                         onClick={() => setCurrentPage((prev) => (hasMore ? prev + 1 : prev))}
//                         disabled={!hasMore}
//                         className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//                     >
//                         Next
//                     </button>
//                 </div>
//             </div>

//             {/* Orders Table */}
//             <div className="bg-white shadow-md rounded p-4">
//                 <h3 className="text-xl font-semibold mb-4">Orders</h3>
//                 <table className="w-full border-collapse border border-gray-300">
//                     <thead>
//                         <tr className="bg-gray-200">
//                             <th className="p-3 border border-gray-300">Order ID</th>
//                             <th className="p-3 border border-gray-300">User ID</th>
//                             <th className="p-3 border border-gray-300">Amount</th>
//                             <th className="p-3 border border-gray-300">Status</th>
//                             <th className="p-3 border border-gray-300">Created At</th>
//                             <th className="p-3 border border-gray-300">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredOrders.map((order) => (
//                             <tr key={order._id} className="hover:bg-gray-100">
//                                 <td className="p-3 border border-gray-300">{order._id}</td>
//                                 <td className="p-3 border border-gray-300">{order.userId}</td>
//                                 <td className="p-3 border border-gray-300">${order.amount}</td>
//                                 <td className="p-3 border border-gray-300">
//                                     <select
//                                         value={order.status}
//                                         onChange={(e) => updateOrderStatus(order._id, e.target.value)}
//                                         className="p-2 border rounded"
//                                     >
//                                         <option value="pending">Pending</option>
//                                         <option value="shipped">Shipped</option>
//                                         <option value="completed">Completed</option>
//                                         <option value="cancelled">Cancelled</option>
//                                         <option value="cancellation requested">Cancellation Requested</option>
//                                         <option value="In Progress">In Progress</option>
//                                     </select>
//                                 </td>
//                                 <td className="p-3 border border-gray-300">
//                                     {new Date(order.createdAt).toLocaleDateString()}
//                                 </td>
//                                 <td className="p-3 border border-gray-300 flex space-x-2">
//                                     <button
//                                         onClick={() => viewOrderDetails(order._id)}
//                                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                                     >
//                                         View
//                                     </button>
//                                     <button
//                                         onClick={() => deleteOrder(order._id)}
//                                         className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Order Details Modal */}
//             {showModal && selectedOrder && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//                     <div className="bg-white p-6 rounded shadow-lg w-3/4">
//                         <h3 className="text-2xl font-bold mb-4">Order Details</h3>
//                         <table className="w-full border-collapse border border-gray-300">
//                             <tbody>
//                                 <tr>
//                                     <td className="p-3 font-bold border border-gray-300">Order ID:</td>
//                                     <td className="p-3 border border-gray-300">{selectedOrder._id}</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="p-3 font-bold border border-gray-300">User ID:</td>
//                                     <td className="p-3 border border-gray-300">{selectedOrder.userId}</td>
//                                 </tr>
//                                 {userDetails && (
//                                     <>
//                                         <tr>
//                                             <td className="p-3 font-bold border border-gray-300">User Name:</td>
//                                             <td className="p-3 border border-gray-300">{userDetails.username}</td>
//                                         </tr>
//                                         <tr>
//                                             <td className="p-3 font-bold border border-gray-300">Email:</td>
//                                             <td className="p-3 border border-gray-300">{userDetails.email}</td>
//                                         </tr>
//                                         <tr>
//                                             <td className="p-3 font-bold border border-gray-300">Phone:</td>
//                                             <td className="p-3 border border-gray-300">{userDetails.phone}</td>
//                                         </tr>
//                                         <tr>
//                                             <td className="p-3 font-bold border border-gray-300">Name On Address:</td>
//                                             <td className="p-3 border border-gray-300">{adrressDetails.name}</td>
//                                         </tr>
//                                         <tr>
//                                             <td className="p-3 font-bold border border-gray-300">Phone On Address:</td>
//                                             <td className="p-3 border border-gray-300">{adrressDetails.phone}</td>
//                                         </tr>
//                                         <tr>
//                                             <td className="p-3 font-bold border border-gray-300">Address:</td>
//                                             <td className="p-3 border border-gray-300">
//                                                 {adrressDetails.fullAddress.buildingNumber},{" "}
//                                                 {adrressDetails.fullAddress.addressLine1},{" "}
//                                                 {adrressDetails.fullAddress?.addressLine2},{" "}
//                                                 {adrressDetails.fullAddress?.landmark},{" "}
//                                                 {adrressDetails.fullAddress.pincode},{" "}
//                                                 {adrressDetails.fullAddress.state}
//                                             </td>
//                                         </tr>
//                                     </>
//                                 )}
//                                 <tr>
//                                     <td className="p-3 font-bold border border-gray-300">Amount:</td>
//                                     <td className="p-3 border border-gray-300">${selectedOrder.amount}</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="p-3 font-bold border border-gray-300">Status:</td>
//                                     <td className="p-3 border border-gray-300">{selectedOrder.status}</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="p-3 font-bold border border-gray-300">Created At:</td>
//                                     <td className="p-3 border border-gray-300">
//                                         {new Date(selectedOrder.createdAt).toLocaleDateString()}
//                                     </td>
//                                 </tr>
//                                 <tr>
//                                     <td className="p-3 font-bold border border-gray-300">Products:</td>
//                                     <td className="p-3 border border-gray-300">
//                                         <ul className="list-disc ml-6">
//                                             {selectedOrder.products.map((product, index) => {
//                                                 const productDetail = productDetails.find(
//                                                     (p) => p._id === product.productId
//                                                 );
//                                                 const variantDetail = productDetail?.variants.find(
//                                                     (v) => v.variantId === product.variantId
//                                                 );
//                                                 return (
//                                                     <li key={index}>
//                                                         {productDetail ? (
//                                                             <>
//                                                                 <strong>{productDetail.title}</strong> -{" "}
//                                                                 {variantDetail ? (
//                                                                     <>
//                                                                         Size: {variantDetail.size}, Color:{" "}
//                                                                         {variantDetail.color}, Price: $
//                                                                         {variantDetail.price}, Quantity:{" "}
//                                                                         {product.quantity}
//                                                                     </>
//                                                                 ) : (
//                                                                     ` Variant ID: ${product.variantId} (Details not found)`
//                                                                 )}
//                                                             </>
//                                                         ) : (
//                                                             `Product ID: ${product.productId} - Quantity: ${product.quantity}`
//                                                         )}
//                                                     </li>
//                                                 );
//                                             })}
//                                         </ul>
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                         <button
//                             onClick={closeModal}
//                             className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Orders;



"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"
import {
  ShoppingCart,
  Search,
  FilterList,
  Visibility,
  Delete,
  Person,
  AttachMoney,
  CalendarToday,
  Close,
  NavigateBefore,
  NavigateNext,
  FirstPage,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material"
import API from "../api/axiosInstance.js"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [filter, setFilter] = useState({ userId: "", orderId: "", status: "" })
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const [adrressDetails, setAddressDetails] = useState(null)
  const [productDetails, setProductDetails] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [currentPage, limit])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await API.get("/orders", {
        params: {
          new: false,
          reverse: true,
          page: currentPage,
          limit: limit,
        },
      })

      const fetchedOrders = response.data
      setHasMore(fetchedOrders.length === limit)
      setOrders(fetchedOrders)
      setFilteredOrders(fetchedOrders)
    } catch (error) {
      console.error("Error fetching orders with details", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter({ ...filter, [name]: value })
  }

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target
    setDateFilter({ ...dateFilter, [name]: value })
  }

  const applyFilter = async () => {
    try {
      setLoading(true)
      const queryParams = {
        userId: filter.userId || undefined,
        orderId: filter.orderId || undefined,
        status: filter.status || undefined,
        startDate: dateFilter.startDate ? String(dateFilter.startDate) : undefined,
        endDate: dateFilter.endDate ? String(dateFilter.endDate) : undefined,
        new: false,
        page: currentPage,
        limit: limit,
      }

      const response = await API.get("/orders", { params: queryParams })
      setFilteredOrders(response.data)
    } catch (error) {
      console.error("Error applying filter", error)
    } finally {
      setLoading(false)
    }
  }

  const viewOrderDetails = async (orderId) => {
    try {
      const response = await API.get(`/orders/findbyorderid/${orderId}`)
      const order = response.data

      const userResponse = await API.get(`/users/find/${order.userId}`)
      setUserDetails(userResponse.data)

      const productResponses = await Promise.all(
        order.products.map((product) => API.get(`/products/find/${product.productId}`)),
      )
      setProductDetails(productResponses.map((res) => res.data))

      setAddressDetails(order.address)
      setSelectedOrder(order)
      setShowModal(true)
    } catch (error) {
      console.error("Error fetching order details", error)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
    setUserDetails(null)
    setProductDetails([])
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}`, { status })
      fetchOrders()
    } catch (error) {
      console.error("Error updating order status", error)
    }
  }

  const deleteOrder = async (orderId) => {
    try {
      await API.delete(`/orders/${orderId}`)
      fetchOrders()
    } catch (error) {
      console.error("Error deleting order", error)
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "cancellation requested":
        return "bg-orange-100 text-orange-800"
      case "in progress":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRandomColor = (index) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-yellow-500"]
    return colors[index % colors.length]
  }

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <CircularProgress />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="bg-orange-100 text-orange-600">
                <ShoppingCart />
              </Avatar>
              <div>
                <Typography variant="h4" className="font-light text-gray-900 mb-1">
                  Orders
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Manage customer orders and track deliveries
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters Section */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FilterList className="text-gray-600" />
              <Typography variant="h6" className="font-medium text-gray-900">
                Filters
              </Typography>
            </div>

            <Grid container spacing={3} className="mb-4">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  name="userId"
                  label="User ID"
                  value={filter.userId}
                  onChange={handleFilterChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  name="orderId"
                  label="Order ID"
                  value={filter.orderId}
                  onChange={handleFilterChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select name="status" value={filter.status} label="Status" onChange={handleFilterChange}>
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                    <MenuItem value="cancellation requested">Cancellation Requested</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button fullWidth variant="contained" onClick={applyFilter} className="h-10 bg-blue-600">
                  Apply Filters
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  name="startDate"
                  label="Start Date"
                  value={dateFilter.startDate}
                  onChange={handleDateFilterChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  name="endDate"
                  label="End Date"
                  value={dateFilter.endDate}
                  onChange={handleDateFilterChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Button fullWidth variant="outlined" onClick={applyFilter} className="h-10">
                  Apply Date Filter
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mb-6">
          <FormControl size="small" className="min-w-40">
            <InputLabel>Per page</InputLabel>
            <Select
              value={limit}
              label="Per page"
              onChange={(e) => {
                setLimit(Number.parseInt(e.target.value))
                setCurrentPage(1)
              }}
              className="bg-white"
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>

          <div className="flex items-center space-x-2">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              startIcon={<FirstPage />}
            >
              First
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              startIcon={<NavigateBefore />}
            >
              Previous
            </Button>
            <Chip label={`Page ${currentPage}`} className="bg-blue-100 text-blue-800 font-medium mx-2" />
            <Button
              variant="outlined"
              size="small"
              onClick={() => setCurrentPage((prev) => (hasMore ? prev + 1 : prev))}
              disabled={!hasMore}
              endIcon={<NavigateNext />}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-medium text-gray-700 py-4">Order</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4">Customer</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4">Amount</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4">Status</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4">Date</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4 text-right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <ShoppingCart className="text-gray-300 text-4xl" />
                          <Typography variant="body1" className="text-gray-500">
                            No orders found
                          </Typography>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order, index) => (
                      <TableRow key={order._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className={`${getRandomColor(index)} text-white w-10 h-10`}>
                              <ShoppingCart />
                            </Avatar>
                            <div>
                              <Typography variant="body1" className="font-medium text-gray-900">
                                #{order._id?.slice(-8)}
                              </Typography>
                              <Typography variant="body2" className="text-gray-500">
                                Order ID
                              </Typography>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            <Person className="text-gray-400 w-4 h-4" />
                            <Typography variant="body2" className="text-gray-700">
                              {order.userId?.slice(-6)}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-1">
                            <AttachMoney className="text-gray-400 w-4 h-4" />
                            <Typography variant="body2" className="font-medium text-gray-900">
                              {order.amount}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <FormControl size="small" className="min-w-32">
                            <Select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="bg-white"
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="shipped">Shipped</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                              <MenuItem value="cancelled">Cancelled</MenuItem>
                              <MenuItem value="cancellation requested">Cancellation Requested</MenuItem>
                              <MenuItem value="In Progress">In Progress</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            <CalendarToday className="text-gray-400 w-4 h-4" />
                            <Typography variant="body2" className="text-gray-700">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <IconButton
                              size="small"
                              onClick={() => viewOrderDetails(order._id)}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => deleteOrder(order._id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Modal */}
      <Dialog open={showModal} onClose={closeModal} maxWidth="lg" fullWidth>
        <DialogTitle className="flex items-center justify-between">
          <Typography variant="h6">Order Details</Typography>
          <IconButton onClick={closeModal}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Grid container spacing={4}>
              {/* Order Information */}
              <Grid item xs={12} md={6}>
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <Typography variant="h6" className="font-medium text-gray-900 mb-3">
                      Order Information
                    </Typography>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-gray-600">
                          Order ID:
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {selectedOrder._id}
                        </Typography>
                      </div>
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-gray-600">
                          Amount:
                        </Typography>
                        <Typography variant="body2" className="font-medium text-green-600">
                          ${selectedOrder.amount}
                        </Typography>
                      </div>
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-gray-600">
                          Status:
                        </Typography>
                        <Chip
                          label={selectedOrder.status}
                          size="small"
                          className={getStatusColor(selectedOrder.status)}
                        />
                      </div>
                      <div className="flex justify-between">
                        <Typography variant="body2" className="text-gray-600">
                          Created:
                        </Typography>
                        <Typography variant="body2" className="font-medium">
                          {new Date(selectedOrder.createdAt).toLocaleDateString()}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>

              {/* Customer Information */}
              {userDetails && (
                <Grid item xs={12} md={6}>
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <Typography variant="h6" className="font-medium text-gray-900 mb-3">
                        Customer Information
                      </Typography>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Person className="text-gray-400 w-4 h-4" />
                          <Typography variant="body2">{userDetails.username}</Typography>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Person className="text-gray-400 w-4 h-4" />
                          <Typography variant="body2">{userDetails._id}</Typography>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Email className="text-gray-400 w-4 h-4" />
                          <Typography variant="body2">{userDetails.email}</Typography>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="text-gray-400 w-4 h-4" />
                          <Typography variant="body2">{userDetails.phone}</Typography>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Shipping Address */}
              {adrressDetails && (
                <Grid item xs={12}>
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <Typography variant="h6" className="font-medium text-gray-900 mb-3">
                        Shipping Address
                      </Typography>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            Name:
                          </Typography>
                          <Typography variant="body2" className="font-medium">
                            {adrressDetails.name}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            Phone:
                          </Typography>
                          <Typography variant="body2" className="font-medium">
                            {adrressDetails.phone}
                          </Typography>
                        </div>
                        <div className="md:col-span-2">
                          <Typography variant="body2" className="text-gray-600 mb-1">
                            Address:
                          </Typography>
                          <div className="flex items-start space-x-2">
                            <LocationOn className="text-gray-400 w-4 h-4 mt-0.5" />
                            <Typography variant="body2" className="font-medium">
                              {adrressDetails.fullAddress.buildingNumber}, {adrressDetails.fullAddress.addressLine1},{" "}
                              {adrressDetails.fullAddress?.addressLine2}, {adrressDetails.fullAddress?.landmark},{" "}
                              {adrressDetails.fullAddress.pincode}, {adrressDetails.fullAddress.state}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Products */}
              <Grid item xs={12}>
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <Typography variant="h6" className="font-medium text-gray-900 mb-3">
                      Products
                    </Typography>
                    <List className="space-y-2">
                      {selectedOrder.products.map((product, index) => {
                        const productDetail = productDetails.find((p) => p._id === product.productId)
                        const variantDetail = productDetail?.variants.find((v) => v.variantId === product.variantId)

                        return (
                          <ListItem key={index} className="border border-gray-100 rounded p-3">
                            <ListItemText
                              primary={
                                <div className="flex justify-between items-start">
                                  <div>
                                    <Typography variant="body1" className="font-medium">
                                      {productDetail ? productDetail.title : `Product ID: ${product.productId}`}
                                    </Typography>
                                    {variantDetail && (
                                      <Typography variant="body2" className="text-gray-600 mt-1">
                                        Size: {variantDetail.size} • Color: {variantDetail.color} • Quantity:{" "}
                                        {product.quantity}
                                      </Typography>
                                    )}
                                  </div>
                                  <Typography variant="body1" className="font-medium text-green-600">
                                    ${variantDetail?.price || "N/A"}
                                  </Typography>
                                </div>
                              }
                            />
                          </ListItem>
                        )
                      })}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={closeModal} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Orders
