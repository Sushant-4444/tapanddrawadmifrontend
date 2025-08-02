// import { useEffect, useState } from "react";
// import API from "../api/axiosInstance.js";

// const Users = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     API.get("http://localhost:5000/api/users")
//       .then((response) => setUsers(response.data))
//       .catch((error) => console.error(error));
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Registered Users</h1>
//       <table className="table-auto w-full border-collapse border border-gray-300">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Email</th>
//             <th className="border p-2">Phone number</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user._id}>
//               <td className="border p-2">{user.username}</td>
//               <td className="border p-2">{user.email}</td>
//               <td className="border p-2">{user.phone}</td>

//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Users;


"use client"

import { useEffect, useState, useCallback } from "react"
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
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material"
import {
  People,
  Search,
  Email,
  Phone,
  MoreVert,
  PersonAdd,
  Refresh,
  NavigateBefore,
  NavigateNext,
  FirstPage,
  Clear,
} from "@mui/icons-material"
import API from "../api/axiosInstance.js"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchEmail, setSearchEmail] = useState("")
  const [isSearchMode, setIsSearchMode] = useState(false)

  // Pagination states (only for non-search mode)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)
  const [showNewUsers, setShowNewUsers] = useState(false)
  const [isLastPage, setIsLastPage] = useState(false)

  const fetchUsers = async (page = 1, limit = itemsPerPage, newUsers = false) => {
    try {
      setLoading(true)
      setError(null)

      let url = "http://localhost:5000/api/users"
      const params = new URLSearchParams()

      if (newUsers) {
        params.append("new", "true")
      } else if (limit) {
        params.append("page", page.toString())
        // Fetch one extra item to check if there are more pages
        params.append("limit", (limit + 1).toString())
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await API.get(url)
      let fetchedUsers = response.data

      if (!newUsers && limit) {
        // Check if we have more users than requested
        const hasMore = fetchedUsers.length > limit
        setHasNextPage(hasMore)
        setIsLastPage(!hasMore)

        // Remove the extra user if we fetched one more
        if (hasMore) {
          fetchedUsers = fetchedUsers.slice(0, limit)
        }

        // Set previous page availability
        setHasPrevPage(page > 1)
      } else {
        setHasNextPage(false)
        setHasPrevPage(false)
        setIsLastPage(true)
      }

      setUsers(fetchedUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to load users. Please try again.")
      setUsers([])
      setHasNextPage(false)
      setHasPrevPage(false)
    } finally {
      setLoading(false)
    }
  }

  const searchUserByEmail = async (email) => {
    if (!email.trim()) {
      // If search is empty, go back to normal mode
      setIsSearchMode(false)
      setCurrentPage(1)
      fetchUsers(1, itemsPerPage, showNewUsers)
      return
    }

    try {
      setSearchLoading(true)
      setError(null)
      setIsSearchMode(true)

      const response = await API.get(`http://localhost:5000/api/users/findbyemail/${encodeURIComponent(email)}`)

      // API might return a single user object or an array
      const userData = Array.isArray(response.data) ? response.data : [response.data]
      setUsers(userData)

      // Reset pagination states for search mode
      setHasNextPage(false)
      setHasPrevPage(false)
      setIsLastPage(true)
    } catch (error) {
      console.error("Error searching user by email:", error)
      if (error.response?.status === 404) {
        setError("No user found with this email address.")
        setUsers([])
      } else {
        setError("Failed to search user. Please try again.")
        setUsers([])
      }
    } finally {
      setSearchLoading(false)
    }
  }

  // Debounced search function
  const debounceSearch = useCallback(
    (() => {
      let timeoutId
      return (email) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          searchUserByEmail(email)
        }, 500) // 500ms delay
      }
    })(),
    [showNewUsers, itemsPerPage],
  )

  useEffect(() => {
    if (!isSearchMode) {
      fetchUsers(currentPage, showNewUsers ? null : itemsPerPage, showNewUsers)
    }
  }, [currentPage, itemsPerPage, showNewUsers, isSearchMode])

  useEffect(() => {
    debounceSearch(searchEmail)
  }, [searchEmail, debounceSearch])

  const handleNextPage = () => {
    if (hasNextPage && !isSearchMode) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (hasPrevPage && !isSearchMode) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleFirstPage = () => {
    if (!isSearchMode) {
      setCurrentPage(1)
    }
  }

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value)
    setCurrentPage(1)
  }

  const handleNewUsersToggle = (event) => {
    setShowNewUsers(event.target.checked)
    setCurrentPage(1)
    // Clear search when toggling
    setSearchEmail("")
    setIsSearchMode(false)
  }

  const handleRefresh = () => {
    if (isSearchMode && searchEmail) {
      searchUserByEmail(searchEmail)
    } else {
      fetchUsers(currentPage, showNewUsers ? null : itemsPerPage, showNewUsers)
    }
  }

  const handleClearSearch = () => {
    setSearchEmail("")
    setIsSearchMode(false)
    setCurrentPage(1)
  }

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRandomColor = (index) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-yellow-500"]
    return colors[index % colors.length]
  }

  if (loading) {
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
              <Avatar className="bg-blue-100 text-blue-600">
                <People />
              </Avatar>
              <div>
                <Typography variant="h4" className="font-light text-gray-900 mb-1">
                  Users
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  {isSearchMode
                    ? `Search results for "${searchEmail}"`
                    : showNewUsers
                      ? "Latest 5 users"
                      : `Page ${currentPage} • ${users.length} users ${hasNextPage ? "(more available)" : isLastPage ? "(last page)" : ""}`}
                </Typography>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <IconButton onClick={handleRefresh} className="text-gray-600 hover:bg-gray-100">
                <Refresh />
              </IconButton>
              <IconButton className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                <PersonAdd />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* Controls */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <TextField
                placeholder="Search by email address..."
                variant="outlined"
                size="small"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="w-80"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {searchLoading ? <CircularProgress size={20} /> : <Search className="text-gray-400" />}
                    </InputAdornment>
                  ),
                  endAdornment: searchEmail && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearSearch}>
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                  className: "bg-white",
                }}
              />
              {!isSearchMode && (
                <FormControlLabel
                  control={<Switch checked={showNewUsers} onChange={handleNewUsersToggle} color="primary" />}
                  label="Show newest users only"
                  className="text-gray-700"
                />
              )}
            </div>

            <div className="flex items-center space-x-4">
              {!showNewUsers && !isSearchMode && (
                <FormControl size="small" className="min-w-32">
                  <InputLabel>Per page</InputLabel>
                  <Select
                    value={itemsPerPage}
                    label="Per page"
                    onChange={handleItemsPerPageChange}
                    className="bg-white"
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
              )}
              <Chip
                label={`${users.length} user${users.length !== 1 ? "s" : ""} ${isSearchMode ? "found" : "shown"}`}
                className={isSearchMode ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}
              />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-medium text-gray-700 py-4">User</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4">Contact</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4">Status</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4 text-right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <People className="text-gray-300 text-4xl" />
                          <Typography variant="body1" className="text-gray-500">
                            {isSearchMode ? "No user found with this email address" : "No users found"}
                          </Typography>
                          {isSearchMode && (
                            <Button variant="outlined" size="small" onClick={handleClearSearch} className="mt-2">
                              Clear search
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user, index) => (
                      <TableRow key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className={`${getRandomColor(index)} text-white w-10 h-10`}>
                              {getInitials(user.username)}
                            </Avatar>
                            <div>
                              <Typography variant="body1" className="font-medium text-gray-900">
                                {user.username}
                              </Typography>
                              <Typography variant="body2" className="text-gray-500">
                                ID: {user._id?.slice(-6)}
                              </Typography>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Email className="text-gray-400 w-4 h-4" />
                              <Typography
                                variant="body2"
                                className={`text-gray-700 ${isSearchMode ? "font-medium bg-yellow-100 px-1 rounded" : ""}`}
                              >
                                {user.email}
                              </Typography>
                            </div>
                            {user.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="text-gray-400 w-4 h-4" />
                                <Typography variant="body2" className="text-gray-700">
                                  {user.phone}
                                </Typography>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Chip
                            label={isSearchMode ? "Found" : showNewUsers ? "New" : "Active"}
                            size="small"
                            className={
                              isSearchMode
                                ? "bg-yellow-100 text-yellow-800 font-medium"
                                : showNewUsers
                                  ? "bg-blue-100 text-blue-800 font-medium"
                                  : "bg-green-100 text-green-800 font-medium"
                            }
                          />
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <IconButton size="small" className="text-gray-400 hover:text-gray-600">
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Server-Friendly Pagination - Only show when not in search mode */}
        {!showNewUsers && !isSearchMode && (hasPrevPage || hasNextPage) && (
          <div className="mt-6 flex justify-center">
            <Card className="border-0 shadow-sm">
              <CardContent className="py-4">
                <div className="flex items-center justify-between space-x-4">
                  <Typography variant="body2" className="text-gray-600">
                    Page {currentPage} • {users.length} users shown
                    {hasNextPage && " • More available"}
                    {isLastPage && " • Last page"}
                  </Typography>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleFirstPage}
                      disabled={!hasPrevPage}
                      startIcon={<FirstPage />}
                      className="min-w-0"
                    >
                      First
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handlePrevPage}
                      disabled={!hasPrevPage}
                      startIcon={<NavigateBefore />}
                      className="min-w-0"
                    >
                      Previous
                    </Button>

                    <Chip label={currentPage} className="bg-blue-100 text-blue-800 font-medium mx-2" />

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleNextPage}
                      disabled={!hasNextPage}
                      endIcon={<NavigateNext />}
                      className="min-w-0"
                    >
                      Next
                    </Button>

                    {hasNextPage && (
                      <Typography variant="caption" className="text-gray-500 ml-2">
                        More pages available
                      </Typography>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Summary Stats */}
        {users.length > 0 && (
          <div className="mt-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-medium text-gray-900 mb-4">
                  {isSearchMode ? "Search Results" : showNewUsers ? "New User Statistics" : "Current Page Statistics"}
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Typography variant="h4" className="font-light text-blue-600 mb-1">
                      {users.length}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      {isSearchMode ? "Users Found" : showNewUsers ? "New Users" : "Users on Page"}
                    </Typography>
                  </div>
                  <div className="text-center">
                    <Typography variant="h4" className="font-light text-green-600 mb-1">
                      {users.filter((u) => u.email).length}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      With Email
                    </Typography>
                  </div>
                  <div className="text-center">
                    <Typography variant="h4" className="font-light text-purple-600 mb-1">
                      {users.filter((u) => u.phone).length}
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      With Phone
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users

