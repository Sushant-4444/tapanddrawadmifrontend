// import React, { useEffect, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import API from "../api/axiosInstance.js";

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchById, setSearchById] = useState(""); // State for searching by Product ID
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [viewingProduct, setViewingProduct] = useState(false); // State to track if we are viewing a product
//   const [showForm, setShowForm] = useState(false); // State to toggle form visibility
//   const [currentPage, setCurrentPage] = useState(1); // Current page number
//   const [limit, setLimit] = useState(10); // Number of products per page
//   const [hasMore, setHasMore] = useState(false); // Whether there are more products to fetch
//   const [formData, setFormData] = useState({
//     _id: "", // Product ID
//     title: "",
//     description: "",
//     images: [""],
//     category: [""],
//     variants: [
//       {
//         variantId: uuidv4(),
//         size: "",
//         color: "",
//         price: "",
//         inStock: true,
//       },
//     ],
//     defaultVariant: "",
//   });

//   // Fetch products on component mount
//   useEffect(() => {
//     fetchProducts();
//   }, [currentPage, limit, categoryFilter, searchTerm]);

//   const fetchProducts = async () => {
//     try {
//       const response = await API.get("/products", {
//         params: {
//           page: currentPage,
//           limit: limit + 1, // Fetch one extra product to check if there are more
//           category: categoryFilter || undefined,
//           search: searchTerm || undefined,
//         },
//       });
  
//       const fetchedProducts = response.data;
//       setHasMore(fetchedProducts.length > limit); // Check if there are more products
//       setProducts(fetchedProducts.slice(0, limit)); // Only keep the products for the current page
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const handlePageChange = (page) => {
//     if (page >= 1 && (page < currentPage || hasMore)) {
//       setCurrentPage(page);
//     }
//   };

//   const handleSearchChange = (e) => setSearchTerm(e.target.value);

//   const handleSearchByIdChange = (e) => setSearchById(e.target.value);

//   const handleSearchById = async () => {
//     if (!searchById) return;
//     try {
//       const response = await API.get(`/products/find/${searchById}`);
//       setProducts([response.data]); // Display only the searched product
//     } catch (error) {
//       console.error("Error fetching product by ID:", error);
//     }
//   };

//   const handleCategoryChange = (e) => setCategoryFilter(e.target.value);

//   const handleFormChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleVariantChange = (index, field, value) => {
//     const updatedVariants = [...formData.variants];
//     updatedVariants[index][field] = value;
//     setFormData((prev) => ({ ...prev, variants: updatedVariants }));
//   };

//   const handleAddVariant = () => {
//     setFormData((prev) => ({
//       ...prev,
//       variants: [
//         ...prev.variants,
//         {
//           variantId: uuidv4(),
//           size: "",
//           color: "",
//           price: "",
//           inStock: true,
//         },
//       ],
//     }));
//   };

//   const handleRemoveVariant = (index) => {
//     const updatedVariants = [...formData.variants];
//     const removed = updatedVariants.splice(index, 1);
//     setFormData((prev) => ({
//       ...prev,
//       variants: updatedVariants,
//       defaultVariant:
//         removed[0]?.variantId === prev.defaultVariant ? "" : prev.defaultVariant,
//     }));
//   };

//   const handleAddImage = () => {
//     setFormData((prev) => ({
//       ...prev,
//       images: [...prev.images, ""],
//     }));
//   };

//   const handleRemoveImage = (index) => {
//     const updatedImages = [...formData.images];
//     updatedImages.splice(index, 1);
//     setFormData((prev) => ({ ...prev, images: updatedImages }));
//   };

//   const handleImageChange = (index, value) => {
//     const updatedImages = [...formData.images];
//     updatedImages[index] = value;
//     setFormData((prev) => ({ ...prev, images: updatedImages }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingProduct) {
//         // Update product
//         const response = await API.put(
//           `/products/${editingProduct._id}`,
//           formData
//         );
//         setProducts((prev) =>
//           prev.map((prod) =>
//             prod._id === editingProduct._id ? response.data : prod
//           )
//         );
//       } else {
//         // Add new product
//         const response = await API.post("/products", formData);
//         setProducts((prev) => [...prev, response.data]);
//       }
//       resetForm();
//     } catch (error) {
//       console.error("Error saving product:", error);
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingProduct(product);
//     setViewingProduct(false); // Not in view mode
//     setFormData(product);
//     setShowForm(true); // Show the form when editing
//   };

//   const handleView = (product) => {
//     setFormData(product);
//     setEditingProduct(null); // Not in editing mode
//     setViewingProduct(true); // Enable view mode
//     setShowForm(true); // Show the form when viewing
//   };

//   const handleDelete = async (id) => {
//     try {
//       await API.delete(`/products/${id}`);
//       setProducts((prev) => prev.filter((prod) => prod._id !== id));
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   // Toggle the inStock status for the overall product
//   const handleToggleStock = async (productId) => {
//     console.log("Toggling stock for product ID:", productId);
//     const product = products.find((prod) => prod._id === productId);
//     if (!product) return;

//     // Toggle the overall inStock status
//     const updatedProduct = {
//       ...product,
//       inStock: !product.inStock,
//       // Also update all variants' inStock status to match the product's new status
//       variants: product.variants.map(variant => ({
//       ...variant,
//       inStock: !product.inStock,
//       })),
//     };

//     try {
//       const response = await API.put(`/products/${productId}`, updatedProduct);
//       console.log("Updated product response:", response.data);
//       setProducts((prev) =>
//         prev.map((prod) =>
//           prod._id === productId ? response.data : prod
//         )
//       );
//     } catch (error) {
//       console.error("Error toggling stock status:", error);
//     }
//   };

//   const handleAddNewProduct = () => {
//     resetForm();
//     setViewingProduct(false); // Not in view mode
//     setShowForm(true); // Show the form when adding a new product
//   };

//   const resetForm = () => {
//     setEditingProduct(null);
//     setViewingProduct(false); // Not in view mode
//     setFormData({
//       _id: "",
//       title: "",
//       description: "",
//       images: [""],
//       category: [""],
//       variants: [
//         {
//           variantId: uuidv4(),
//           size: "",
//           color: "",
//           price: "",
//           inStock: true,
//         },
//       ],
//       defaultVariant: "",
//     });
//     setShowForm(false); // Hide the form after resetting
//   };

//   const filteredProducts = products.filter(
//     (prod) =>
//       prod.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (!categoryFilter || prod.category.includes(categoryFilter))
//   );

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Product Management</h1>

//       {/* Search and Filter */}
//       <div className="flex space-x-4 mb-4">
//         <input
//           type="text"
//           placeholder="Search by title..."
//           className="p-2 border rounded w-1/3"
//           value={searchTerm}
//           onChange={handleSearchChange}
//         />
//         <input
//           type="text"
//           placeholder="Filter by category..."
//           className="p-2 border rounded w-1/3"
//           value={categoryFilter}
//           onChange={handleCategoryChange}
//         />
//         <input
//           type="text"
//           placeholder="Search by Product ID..."
//           className="p-2 border rounded w-1/3"
//           value={searchById}
//           onChange={handleSearchByIdChange}
//         />
//         <button
//           onClick={handleSearchById}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Search by ID
//         </button>
//       </div>

//       {/* Add Product Button */}
//       <button
//         onClick={handleAddNewProduct}
//         className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//       >
//         Add New Product
//       </button>

//       {/* Product Form */}
//       {showForm && (
//         <form onSubmit={handleSubmit} className="p-4 border rounded mb-6">
//           <h2 className="text-xl font-bold mb-4">
//             {viewingProduct
//               ? "View Product"
//               : editingProduct
//               ? "Edit Product"
//               : "Add Product"}
//           </h2>
//           {formData._id && (
//             <div className="mb-4">
//               <label className="font-semibold">Product ID:</label>
//               <p className="p-2 border rounded bg-gray-100">{formData._id}</p>
//             </div>
//           )}
//           <input
//             type="text"
//             placeholder="Title"
//             className="w-full p-2 border rounded mb-4"
//             value={formData.title}
//             onChange={(e) => handleFormChange("title", e.target.value)}
//             required
//             disabled={viewingProduct} // Disable in view mode
//           />
//           <textarea
//             placeholder="Description"
//             className="w-full p-2 border rounded mb-4"
//             value={formData.description}
//             onChange={(e) => handleFormChange("description", e.target.value)}
//             required
//             disabled={viewingProduct} // Disable in view mode
//           />
//           <div className="mb-4">
//             <label className="font-semibold">Images</label>
//             {formData.images.map((img, i) => (
//               <div key={i} className="flex space-x-2 mt-2">
//                 <input
//                   type="text"
//                   value={img}
//                   onChange={(e) => handleImageChange(i, e.target.value)}
//                   placeholder="Image URL"
//                   className="w-full p-2 border rounded"
//                   disabled={viewingProduct} // Disable in view mode
//                 />
//                 {!viewingProduct && (
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveImage(i)}
//                     className="bg-red-500 text-white px-3 py-1 rounded"
//                   >
//                     X
//                   </button>
//                 )}
//               </div>
//             ))}
//             {!viewingProduct && (
//               <button
//                 type="button"
//                 onClick={handleAddImage}
//                 className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
//               >
//                 + Add Image
//               </button>
//             )}
//           </div>
//           <input
//             type="text"
//             placeholder="Category (comma separated)"
//             className="w-full p-2 border rounded mb-4"
//             value={formData.category.join(", ")}
//             onChange={(e) =>
//               handleFormChange(
//                 "category",
//                 e.target.value.split(",").map((c) => c.trim())
//               )
//             }
//             disabled={viewingProduct} // Disable in view mode
//           />
//           <div className="mb-4">
//             <label className="font-semibold">Variants</label>
//             {formData.variants.map((variant, index) => (
//               <div
//                 key={variant.variantId}
//                 className="border p-3 rounded space-y-2 bg-gray-50 mt-2"
//               >
//                 <div className="mb-2">
//                   <label className="font-semibold">Variant ID:</label>
//                   <p className="p-2 border rounded bg-gray-100">
//                     {variant.variantId}
//                   </p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <input
//                     type="text"
//                     placeholder="Size"
//                     className="p-2 border rounded w-1/4"
//                     value={variant.size}
//                     onChange={(e) =>
//                       handleVariantChange(index, "size", e.target.value)
//                     }
//                     disabled={viewingProduct} // Disable in view mode
//                   />
//                   <input
//                     type="text"
//                     placeholder="Color"
//                     className="p-2 border rounded w-1/4"
//                     value={variant.color}
//                     onChange={(e) =>
//                       handleVariantChange(index, "color", e.target.value)
//                     }
//                     disabled={viewingProduct} // Disable in view mode
//                   />
//                   <input
//                     type="number"
//                     placeholder="Price"
//                     className="p-2 border rounded w-1/4"
//                     value={variant.price}
//                     onChange={(e) =>
//                       handleVariantChange(index, "price", e.target.value)
//                     }
//                     disabled={viewingProduct} // Disable in view mode
//                   />
//                   <label className="flex items-center space-x-1">
//                     <input
//                       type="checkbox"
//                       checked={variant.inStock}
//                       onChange={(e) =>
//                         handleVariantChange(index, "inStock", e.target.checked)
//                       }
//                       disabled={viewingProduct} // Disable in view mode
//                     />
//                     <span>In Stock</span>
//                   </label>
//                 </div>
//                 {!viewingProduct && (
//                   <div className="flex justify-between items-center">
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveVariant(index)}
//                       className="text-red-600 text-sm"
//                     >
//                       Remove Variant
//                     </button>
//                     <label className="text-sm">
//                       <input
//                         type="radio"
//                         name="defaultVariant"
//                         value={variant.variantId}
//                         checked={formData.defaultVariant === variant.variantId}
//                         onChange={() =>
//                           handleFormChange("defaultVariant", variant.variantId)
//                         }
//                       />{" "}
//                       Set as Default Variant
//                     </label>
//                   </div>
//                 )}
//               </div>
//             ))}
//             {!viewingProduct && (
//               <button
//                 type="button"
//                 onClick={handleAddVariant}
//                 className="bg-green-600 text-white px-4 py-1 rounded"
//               >
//                 + Add Variant
//               </button>
//             )}
//           </div>
//           {!viewingProduct && (
//             <button
//               type="submit"
//               className="w-full bg-blue-600 text-white py-2 rounded"
//             >
//               {editingProduct ? "Update Product" : "Add Product"}
//             </button>
//           )}
//           <button
//             type="button"
//             onClick={resetForm}
//             className="w-full bg-gray-600 text-white py-2 rounded mt-2"
//           >
//             {viewingProduct ? "Close" : "Cancel"}
//           </button>
//         </form>
//       )}

//       {/* Pagination Controls */}
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <label className="mr-2">Products per page:</label>
//           <select
//             value={limit}
//             onChange={(e) => {
//               setLimit(parseInt(e.target.value));
//               setCurrentPage(1); // Reset to the first page when limit changes
//             }}
//             className="p-2 border rounded"
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={20}>20</option>
//           </select>
//         </div>
//         <div>
//           <button
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="mx-4">Page {currentPage}</span>
//           <button
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={!hasMore}
//             className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Product List */}
//       <div className="bg-white shadow-md rounded p-4">
//         <h3 className="text-xl font-semibold mb-4">Products</h3>
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-3 border border-gray-300">Title</th>
//               <th className="p-3 border border-gray-300">Category</th>
//               <th className="p-3 border border-gray-300">Price</th>
//               <th className="p-3 border border-gray-300">In Stock</th>
//               <th className="p-3 border border-gray-300">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product) => (
//               <tr
//                 key={product._id}
//                 className="hover:bg-gray-100 cursor-pointer"
//                 onClick={() => handleView(product)}
//                 tabIndex={0}
//                 style={{ outline: "none" }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" || e.key === " ") {
//                     handleView(product);
//                   }
//                 }}
//               >
//                 <td className="p-3 border border-gray-300">{product.title}</td>
//                 <td className="p-3 border border-gray-300">
//                   {product.category.join(", ")}
//                 </td>
//                 <td className="p-3 border border-gray-300">
//                   ${product.variants[0]?.price || "N/A"}
//                 </td>
//                 <td
//   className="p-3 border border-gray-300 cursor-pointer hover:bg-green-100"
//   onClick={e => {
//     e.stopPropagation(); // Prevent row click
//     handleToggleStock(product._id);
//     // Optionally: e.preventDefault();
//   }}
//   title="Click to toggle stock status"
// >
//   {product.inStock ? "✅" : "❌"}
// </td>
//                 <td className="p-3 border border-gray-300 flex space-x-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleView(product);
//                     }}
//                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   >
//                     View
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleEdit(product);
//                     }}
//                     className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDelete(product._id);
//                     }}
//                     className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Products;




"use client"

import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
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
  Switch,
  FormControlLabel,
  Box,
  Grid,
} from "@mui/material"
import {
  Inventory,
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  Category,
  AttachMoney,
  Image,
  Close,
  NavigateBefore,
  NavigateNext,
  FirstPage,
} from "@mui/icons-material"
import API from "../api/axiosInstance.js"

const Products = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchById, setSearchById] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [editingProduct, setEditingProduct] = useState(null)
  const [viewingProduct, setViewingProduct] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    description: "",
    images: [""],
    category: [""],
    variants: [
      {
        variantId: uuidv4(),
        size: "",
        color: "",
        price: "",
        inStock: true,
      },
    ],
    defaultVariant: "",
  })

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [currentPage, limit, categoryFilter, searchTerm])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await API.get("/products", {
        params: {
          page: currentPage,
          limit: limit + 1,
          category: categoryFilter || undefined,
          search: searchTerm || undefined,
        },
      })

      const fetchedProducts = response.data
      setHasMore(fetchedProducts.length > limit)
      setProducts(fetchedProducts.slice(0, limit))
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    if (page >= 1 && (page < currentPage || hasMore)) {
      setCurrentPage(page)
    }
  }

  const handleSearchChange = (e) => setSearchTerm(e.target.value)
  const handleSearchByIdChange = (e) => setSearchById(e.target.value)

  const handleSearchById = async () => {
    if (!searchById) return
    try {
      setLoading(true)
      const response = await API.get(`/products/find/${searchById}`)
      setProducts([response.data])
    } catch (error) {
      console.error("Error fetching product by ID:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (e) => setCategoryFilter(e.target.value)

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...formData.variants]
    updatedVariants[index][field] = value
    setFormData((prev) => ({ ...prev, variants: updatedVariants }))
  }

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          variantId: uuidv4(),
          size: "",
          color: "",
          price: "",
          inStock: true,
        },
      ],
    }))
  }

  const handleRemoveVariant = (index) => {
    const updatedVariants = [...formData.variants]
    const removed = updatedVariants.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      variants: updatedVariants,
      defaultVariant: removed[0]?.variantId === prev.defaultVariant ? "" : prev.defaultVariant,
    }))
  }

  const handleAddImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }))
  }

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images]
    updatedImages.splice(index, 1)
    setFormData((prev) => ({ ...prev, images: updatedImages }))
  }

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images]
    updatedImages[index] = value
    setFormData((prev) => ({ ...prev, images: updatedImages }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        const response = await API.put(`/products/${editingProduct._id}`, formData)
        setProducts((prev) => prev.map((prod) => (prod._id === editingProduct._id ? response.data : prod)))
      } else {
        const response = await API.post("/products", formData)
        setProducts((prev) => [...prev, response.data])
      }
      resetForm()
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setViewingProduct(false)
    setFormData(product)
    setShowForm(true)
  }

  const handleView = (product) => {
    setFormData(product)
    setEditingProduct(null)
    setViewingProduct(true)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`)
      setProducts((prev) => prev.filter((prod) => prod._id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleToggleStock = async (productId) => {
    console.log("Toggling stock for product ID:", productId)
    const product = products.find((prod) => prod._id === productId)
    if (!product) return

    const updatedProduct = {
      ...product,
      inStock: !product.inStock,
      variants: product.variants.map((variant) => ({
        ...variant,
        inStock: !product.inStock,
      })),
    }

    try {
      const response = await API.put(`/products/${productId}`, updatedProduct)
      console.log("Updated product response:", response.data)
      setProducts((prev) => prev.map((prod) => (prod._id === productId ? response.data : prod)))
    } catch (error) {
      console.error("Error toggling stock status:", error)
    }
  }

  const handleAddNewProduct = () => {
    resetForm()
    setViewingProduct(false)
    setShowForm(true)
  }

  const resetForm = () => {
    setEditingProduct(null)
    setViewingProduct(false)
    setFormData({
      _id: "",
      title: "",
      description: "",
      images: [""],
      category: [""],
      variants: [
        {
          variantId: uuidv4(),
          size: "",
          color: "",
          price: "",
          inStock: true,
        },
      ],
      defaultVariant: "",
    })
    setShowForm(false)
  }

  const getRandomColor = (index) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-yellow-500"]
    return colors[index % colors.length]
  }

  if (loading && products.length === 0) {
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
              <Avatar className="bg-green-100 text-green-600">
                <Inventory />
              </Avatar>
              <div>
                <Typography variant="h4" className="font-light text-gray-900 mb-1">
                  Products
                </Typography>
                <Typography variant="body2" className="text-gray-500">
                  Manage your product inventory
                </Typography>
              </div>
            </div>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddNewProduct}
              className="bg-green-600 hover:bg-green-700"
            >
              Add Product
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <Typography variant="h6" className="font-medium text-gray-900 mb-4">
              Search & Filters
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by title..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
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
                <TextField
                  fullWidth
                  placeholder="Filter by category..."
                  variant="outlined"
                  size="small"
                  value={categoryFilter}
                  onChange={handleCategoryChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Category className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search by Product ID..."
                  variant="outlined"
                  size="small"
                  value={searchById}
                  onChange={handleSearchByIdChange}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button fullWidth variant="outlined" onClick={handleSearchById} className="h-10">
                  Search ID
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
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              startIcon={<FirstPage />}
            >
              First
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              startIcon={<NavigateBefore />}
            >
              Previous
            </Button>
            <Chip label={`Page ${currentPage}`} className="bg-blue-100 text-blue-800 font-medium mx-2" />
            <Button
              variant="outlined"
              size="small"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasMore}
              endIcon={<NavigateNext />}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-medium text-gray-700 py-4">Product</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4">Category</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4">Price</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4">Stock</TableCell>
                    <TableCell className="font-medium text-gray-700 py-4 text-right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <Inventory className="text-gray-300 text-4xl" />
                          <Typography variant="body1" className="text-gray-500">
                            No products found
                          </Typography>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product, index) => (
                      <TableRow
                        key={product._id}
                        className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                        onClick={() => handleView(product)}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className={`${getRandomColor(index)} text-white w-10 h-10`}>
                              <Inventory />
                            </Avatar>
                            <div>
                              <Typography variant="body1" className="font-medium text-gray-900">
                                {product.title}
                              </Typography>
                              <Typography variant="body2" className="text-gray-500">
                                ID: {product._id?.slice(-6)}
                              </Typography>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-wrap gap-1">
                            {product.category.map((cat, idx) => (
                              <Chip key={idx} label={cat} size="small" className="bg-gray-100 text-gray-700" />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-1">
                            <AttachMoney className="text-gray-400 w-4 h-4" />
                            <Typography variant="body2" className="font-medium text-gray-900">
                              {product.variants[0]?.price || "N/A"}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Chip
                            label={product.inStock ? "In Stock" : "Out of Stock"}
                            size="small"
                            className={
                              product.inStock
                                ? "bg-green-100 text-green-800 font-medium cursor-pointer hover:bg-green-200"
                                : "bg-red-100 text-red-800 font-medium cursor-pointer hover:bg-red-200"
                            }
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleStock(product._id)
                            }}
                          />
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleView(product)
                              }}
                              className="text-blue-600 hover:bg-blue-50"
                            >
                              <Visibility />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(product)
                              }}
                              className="text-yellow-600 hover:bg-yellow-50"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(product._id)
                              }}
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

      {/* Product Form Dialog */}
      <Dialog open={showForm} onClose={resetForm} maxWidth="md" fullWidth>
        <DialogTitle className="flex items-center justify-between">
          <Typography variant="h6">
            {viewingProduct ? "View Product" : editingProduct ? "Edit Product" : "Add Product"}
          </Typography>
          <IconButton onClick={resetForm}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={handleSubmit}>
            {formData._id && (
              <Box className="mb-4 p-3 bg-gray-50 rounded">
                <Typography variant="body2" className="font-medium text-gray-700">
                  Product ID: {formData._id}
                </Typography>
              </Box>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={formData.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  required
                  disabled={viewingProduct}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  required
                  disabled={viewingProduct}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" className="font-medium text-gray-900 mb-2">
                  Images
                </Typography>
                {formData.images.map((img, i) => (
                  <div key={i} className="flex items-center space-x-2 mb-2">
                    <TextField
                      fullWidth
                      size="small"
                      value={img}
                      onChange={(e) => handleImageChange(i, e.target.value)}
                      placeholder="Image URL"
                      disabled={viewingProduct}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    {!viewingProduct && (
                      <IconButton size="small" onClick={() => handleRemoveImage(i)} className="text-red-600">
                        <Delete />
                      </IconButton>
                    )}
                  </div>
                ))}
                {!viewingProduct && (
                  <Button variant="outlined" size="small" onClick={handleAddImage} startIcon={<Add />} className="mt-2">
                    Add Image
                  </Button>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Categories (comma separated)"
                  variant="outlined"
                  value={formData.category.join(", ")}
                  onChange={(e) =>
                    handleFormChange(
                      "category",
                      e.target.value.split(",").map((c) => c.trim()),
                    )
                  }
                  disabled={viewingProduct}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" className="font-medium text-gray-900 mb-3">
                  Variants
                </Typography>
                {formData.variants.map((variant, index) => (
                  <Card key={variant.variantId} className="mb-3 border border-gray-200">
                    <CardContent className="p-4">
                      <Typography variant="body2" className="text-gray-500 mb-2">
                        Variant ID: {variant.variantId}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Size"
                            value={variant.size}
                            onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                            disabled={viewingProduct}
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Color"
                            value={variant.color}
                            onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                            disabled={viewingProduct}
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Price"
                            type="number"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                            disabled={viewingProduct}
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={variant.inStock}
                                onChange={(e) => handleVariantChange(index, "inStock", e.target.checked)}
                                disabled={viewingProduct}
                              />
                            }
                            label="In Stock"
                          />
                        </Grid>
                      </Grid>
                      {!viewingProduct && (
                        <div className="flex justify-between items-center mt-3">
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveVariant(index)}
                            startIcon={<Delete />}
                          >
                            Remove Variant
                          </Button>
                          <FormControlLabel
                            control={
                              <input
                                type="radio"
                                name="defaultVariant"
                                value={variant.variantId}
                                checked={formData.defaultVariant === variant.variantId}
                                onChange={() => handleFormChange("defaultVariant", variant.variantId)}
                              />
                            }
                            label="Default Variant"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {!viewingProduct && (
                  <Button variant="outlined" onClick={handleAddVariant} startIcon={<Add />}>
                    Add Variant
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={resetForm} color="inherit">
            {viewingProduct ? "Close" : "Cancel"}
          </Button>
          {!viewingProduct && (
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {editingProduct ? "Update Product" : "Add Product"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Products
