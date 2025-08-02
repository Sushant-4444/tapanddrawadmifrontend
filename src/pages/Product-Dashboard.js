// import React, { useEffect, useState } from "react";
// import API from "../api/axiosInstance.js";


// const AdminDashboard = () => {
//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     images: [""],
//     category: [""],
//     variants: [{ variantId: "", size: "", color: "", price: "", inStock: true }],
//     defaultVariant: "",
//   });
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     const res = await API.get("/products");
//     setProducts(res.data);
//   };

//   const handleFormChange = (e, index, field, isVariant = false) => {
//     if (isVariant) {
//       const updatedVariants = [...form.variants];
//       updatedVariants[index][field] = field === "inStock" ? e.target.checked : e.target.value;
//       setForm({ ...form, variants: updatedVariants });
//     } else {
//       setForm({ ...form, [e.target.name]: e.target.value });
//     }
//   };

//   const addVariant = () => {
//     setForm({
//       ...form,
//       variants: [...form.variants, { variantId: "", size: "", color: "", price: "", inStock: true }],
//     });
//   };

//   const removeVariant = (index) => {
//     const newVariants = [...form.variants];
//     newVariants.splice(index, 1);
//     setForm({ ...form, variants: newVariants });
//   };

//   const handleSubmit = async () => {
//     try {
//       const payload = {
//         ...form,
//         images: form.images.filter(img => img.trim() !== ""),
//         category: form.category.filter(cat => cat.trim() !== ""),
//         variants: form.variants.map((v) => ({
//           ...v,
//           price: parseFloat(v.price),
//         })),
//       };

//       if (editingId) {
//         await API.put(`/products/${editingId}`, payload);
//       } else {
//         await API.post(`/products`, payload);
//       }

//       fetchProducts();
//       resetForm();
//     } catch (err) {
//       console.error("Error submitting product:", err);
//     }
//   };

//   const resetForm = () => {
//     setEditingId(null);
//     setForm({
//       title: "",
//       description: "",
//       images: [""],
//       category: [""],
//       variants: [{ variantId: "", size: "", color: "", price: "", inStock: true }],
//       defaultVariant: "",
//     });
//   };

//   const deleteProduct = async (id) => {
//     if (window.confirm("Are you sure you want to delete this product?")) {
//       await API.delete(`/products/${id}`);
//       fetchProducts();
//     }
//   };

//   const editProduct = (product) => {
//     setEditingId(product._id);
//     setForm(product);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Admin Product Dashboard</h1>

//       <div className="bg-white shadow-md p-4 rounded-lg mb-8">
//         <h2 className="text-xl font-semibold mb-2">{editingId ? "Edit" : "Add"} Product</h2>

//         <input
//           type="text"
//           name="title"
//           placeholder="Title"
//           value={form.title}
//           onChange={handleFormChange}
//           className="border px-2 py-1 mb-2 w-full"
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleFormChange}
//           className="border px-2 py-1 mb-2 w-full"
//         />
//         <input
//           type="text"
//           name="defaultVariant"
//           placeholder="Default Variant ID"
//           value={form.defaultVariant}
//           onChange={handleFormChange}
//           className="border px-2 py-1 mb-2 w-full"
//         />

//         <div className="grid grid-cols-2 gap-2 mb-2">
//           {form.images.map((img, idx) => (
//             <input
//               key={idx}
//               type="text"
//               placeholder={`Image URL ${idx + 1}`}
//               value={img}
//               onChange={(e) => {
//                 const newImages = [...form.images];
//                 newImages[idx] = e.target.value;
//                 setForm({ ...form, images: newImages });
//               }}
//               className="border px-2 py-1"
//             />
//           ))}
//         </div>

//         <input
//           type="text"
//           placeholder="Category (comma-separated)"
//           value={form.category.join(",")}
//           onChange={(e) => setForm({ ...form, category: e.target.value.split(",") })}
//           className="border px-2 py-1 mb-4 w-full"
//         />

//         <h3 className="font-medium">Variants:</h3>
//         {form.variants.map((v, index) => (
//           <div key={index} className="grid grid-cols-6 gap-2 mb-2">
//             <input
//               type="text"
//               placeholder="Variant ID"
//               value={v.variantId}
//               onChange={(e) => handleFormChange(e, index, "variantId", true)}
//               className="border px-2 py-1"
//             />
//             <input
//               type="text"
//               placeholder="Size"
//               value={v.size}
//               onChange={(e) => handleFormChange(e, index, "size", true)}
//               className="border px-2 py-1"
//             />
//             <input
//               type="text"
//               placeholder="Color"
//               value={v.color}
//               onChange={(e) => handleFormChange(e, index, "color", true)}
//               className="border px-2 py-1"
//             />
//             <input
//               type="number"
//               placeholder="Price"
//               value={v.price}
//               onChange={(e) => handleFormChange(e, index, "price", true)}
//               className="border px-2 py-1"
//             />
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={v.inStock}
//                 onChange={(e) => handleFormChange(e, index, "inStock", true)}
//               />
//               <span>In Stock</span>
//             </label>
//             <button
//               onClick={() => removeVariant(index)}
//               className="bg-red-500 text-white px-2 rounded"
//             >
//               X
//             </button>
//           </div>
//         ))}

//         <button
//           onClick={addVariant}
//           className="bg-blue-600 text-white px-4 py-1 rounded mr-2"
//         >
//           Add Variant
//         </button>
//         <button
//           onClick={handleSubmit}
//           className="bg-green-600 text-white px-4 py-1 rounded"
//         >
//           {editingId ? "Update Product" : "Add Product"}
//         </button>
//       </div>

//       <div className="bg-white p-4 rounded shadow-md">
//         <h2 className="text-xl font-semibold mb-4">All Products</h2>
//         {products.map((product) => (
//           <div key={product._id} className="border-b py-2">
//             <h3 className="font-bold">{product.title}</h3>
//             <p>{product.description}</p>
//             <p className="text-sm text-gray-500">Categories: {product.category.join(", ")}</p>
//             <p className="text-sm">Variants: {product.variants.length}</p>
//             <div className="flex space-x-2 mt-2">
//               <button
//                 onClick={() => editProduct(product)}
//                 className="bg-yellow-400 px-2 py-1 rounded text-white"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => deleteProduct(product._id)}
//                 className="bg-red-600 px-2 py-1 rounded text-white"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import API from "../api/axiosInstance.js";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = React.useCallback(async () => {
    try {
      setLoading(true);
      let query = `?page=${page}`;
      if (searchQuery) query += `&search=${searchQuery}`;
      if (categoryFilter) query += `&category=${categoryFilter}`;
      if (sizeFilter) query += `&size=${sizeFilter}`;
      if (colorFilter) query += `&color=${colorFilter}`;

      const res = await API.get(`/products${query}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, categoryFilter, sizeFilter, colorFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleSave = async () => {
    try {
      if (editingProduct._id) {
        await API.put(`/products/${editingProduct._id}`, editingProduct);
      } else {
        await API.post("/products", editingProduct);
      }
      fetchProducts();
      setEditingProduct(null);
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Product Dashboard</h1>

      <button
        onClick={() => setEditingProduct({ title: "", category: "", defaultVariant: { price: 0, inStock: 0 } })}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Product
      </button>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">All Categories</option>
          <option value="tshirt">T-Shirts</option>
          <option value="hoodie">Hoodies</option>
          <option value="cap">Caps</option>
        </select>

        <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">All Sizes</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>

        <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)} className="border px-3 py-2 rounded">
          <option value="">All Colors</option>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="blue">Blue</option>
          <option value="red">Red</option>
        </select>

        <button
          onClick={() => {
            setSearchQuery("");
            setCategoryFilter("");
            setSizeFilter("");
            setColorFilter("");
          }}
          className="bg-gray-400 text-white px-4 rounded"
        >
          Clear Filters
        </button>
      </div>

      {loading ? (
        <div className="text-center text-lg py-10">Loading products...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4 shadow">
                <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
                <p className="text-sm mb-1">Category: {product.category}</p>
                <p className="text-sm mb-1">Price: ₹{product.defaultVariant?.price}</p>
                <p className="text-sm mb-2">In Stock: {product.defaultVariant?.inStock}</p>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-4 py-1">Page {page} of {totalPages}</span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {editingProduct && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              {editingProduct?._id ? "Edit Product" : "Add Product"}
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={editingProduct?.title || ""}
              onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
              className="border px-3 py-2 rounded w-full mb-2"
            />

            <input
              type="number"
              placeholder="Price"
              value={editingProduct?.defaultVariant?.price || ""}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  defaultVariant: { ...editingProduct.defaultVariant, price: e.target.value },
                })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />

            <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Save</button>
            <button onClick={() => setEditingProduct(null)} className="bg-gray-400 text-white px-4 py-2 rounded mt-2 ml-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
