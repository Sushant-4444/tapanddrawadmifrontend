import { useEffect, useState } from "react";
import API from "../api/axiosInstance.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "", category: [], size: "", color: "", inStock: true, imageUrl: "" });
  const [editProduct, setEditProduct] = useState(null);

  // Fetch products on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Add a new product
  const handleAddProduct = async () => {
    try {
      const response = await API.post("/products", newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ title: "", description: "", price: "", category: [], size: "", color: "", inStock: true, imageUrl: "" });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Edit an existing product
  const handleEditProduct = async () => {
    try {
      const response = await API.put(`/products/${editProduct._id}`, editProduct);
      setProducts(products.map((prod) => (prod._id === editProduct._id ? response.data : prod)));
      setEditProduct(null);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  // Delete a product
  const handleDeleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((prod) => prod._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Filter and search products
  const filteredProducts = products
    .filter((prod) => prod.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((prod) => (category ? prod.category.includes(category) : true));

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {/* Search and Category Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search product..."
          className="border p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="border p-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {[...new Set(products.flatMap((p) => p.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Add Product Form */}
      <div className="border p-4 mb-4 rounded bg-gray-100">
        <h2 className="text-lg font-semibold">Add New Product</h2>
        <div className="flex flex-wrap gap-2">
          <input type="text" placeholder="Title" className="border p-2 rounded" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
          <input type="text" placeholder="Description" className="border p-2 rounded" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
          <input type="number" placeholder="Price" className="border p-2 rounded" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
          <input type="text" placeholder="Category (comma separated)" className="border p-2 rounded" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value.split(",") })} />
          <input type="text" placeholder="Size" className="border p-2 rounded" value={newProduct.size} onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })} />
          <input type="text" placeholder="Color" className="border p-2 rounded" value={newProduct.color} onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })} />
          <input type="text" placeholder="Image URL" className="border p-2 rounded" value={newProduct.imageUrl} onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })} />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newProduct.inStock}
              onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
            />
            In Stock
          </label>
          <button onClick={handleAddProduct} className="bg-blue-500 text-white p-2 rounded">Add</button>
        </div>
      </div>

      {/* Product List */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Size</th>
            <th className="border p-2">Color</th>
            <th className="border p-2">In Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id} className="border">
              <td className="border p-2">{product.title}</td>
              <td className="border p-2">{product.description}</td>
              <td className="border p-2">${product.price}</td>
              <td className="border p-2">{product.category.join(", ")}</td>
              <td className="border p-2">{product.size}</td>
              <td className="border p-2">{product.color}</td>
              <td className="border p-2">{product.inStock ? "✅" : "❌"}</td>
              <td className="border p-2 flex gap-2">
                <button onClick={() => setEditProduct(product)} className="bg-yellow-500 text-white p-1 rounded">Edit</button>
                <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Product Form */}
      {editProduct && (
        <div className="border p-4 mt-4 rounded bg-gray-100">
          <h2 className="text-lg font-semibold">Edit Product</h2>
          <div className="flex flex-wrap gap-2">
            <input type="text" placeholder="Title" className="border p-2 rounded" value={editProduct.title} onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })} />
            <input type="text" placeholder="Description" className="border p-2 rounded" value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
            <input type="number" placeholder="Price" className="border p-2 rounded" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })} />
            <input type="text" placeholder="Category (comma separated)" className="border p-2 rounded" value={editProduct.category} onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value.split(",") })} />
            <input type="text" placeholder="Size" className="border p-2 rounded" value={editProduct.size} onChange={(e) => setEditProduct({ ...editProduct, size: e.target.value })} />
            <input type="text" placeholder="Color" className="border p-2 rounded" value={editProduct.color} onChange={(e) => setEditProduct({ ...editProduct, color: e.target.value })} />
            <input type="text" placeholder="Image URL" className="border p-2 rounded" value={editProduct.imageUrl} onChange={(e) => setEditProduct({ ...editProduct, imageUrl: e.target.value })} />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editProduct.inStock}
                onChange={(e) => setEditProduct({ ...editProduct, inStock: e.target.checked })}
              />
              In Stock
            </label>
            <button onClick={handleEditProduct} className="bg-green-500 text-white p-2 rounded">Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;