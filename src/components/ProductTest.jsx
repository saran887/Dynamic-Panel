import React, { useState, useEffect } from "react";

export default function ProductTest({ userId }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [catForm, setCatForm] = useState({ name: "" });
  const [prodForm, setProdForm] = useState({ name: "", description: "", price: "", categoryId: "" });
  const [catError, setCatError] = useState("");
  const [catSuccess, setCatSuccess] = useState("");
  const [prodError, setProdError] = useState("");
  const [prodSuccess, setProdSuccess] = useState("");

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/product/category?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setCategories(data.categories || []));
      fetch(`http://localhost:5000/api/product/product?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setProducts(data.products || []));
    }
  }, [userId]);

  // Category form handlers
  const handleCatChange = (e) => {
    setCatForm({ ...catForm, [e.target.name]: e.target.value });
    setCatError("");
    setCatSuccess("");
  };
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    setCatError("");
    setCatSuccess("");
    if (!catForm.name) {
      setCatError("Category name is required");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/product/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catForm.name, userId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add category");
      setCatSuccess("Category added!");
      setCatForm({ name: "" });
      // Refresh categories
      fetch(`http://localhost:5000/api/product/category?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setCategories(data.categories || []));
    } catch (err) {
      setCatError(err.message);
    }
  };

  // Product form handlers
  const handleProdChange = (e) => {
    setProdForm({ ...prodForm, [e.target.name]: e.target.value });
    setProdError("");
    setProdSuccess("");
  };
  const handleProdSubmit = async (e) => {
    e.preventDefault();
    setProdError("");
    setProdSuccess("");
    if (!prodForm.name || !prodForm.price || !prodForm.categoryId) {
      setProdError("Name, price, and category are required");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/product/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prodForm.name,
          description: prodForm.description,
          price: parseFloat(prodForm.price),
          categoryId: prodForm.categoryId,
          userId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add product");
      setProdSuccess("Product added!");
      setProdForm({ name: "", description: "", price: "", categoryId: "" });
      // Refresh product list
      fetch(`http://localhost:5000/api/product/product?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setProducts(data.products || []));
    } catch (err) {
      setProdError(err.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Add Category</h2>
      <form onSubmit={handleCatSubmit} className="space-y-3 mb-8">
        {catError && <div className="text-red-600 text-sm">{catError}</div>}
        {catSuccess && <div className="text-green-600 text-sm">{catSuccess}</div>}
        <div>
          <label className="block mb-1 font-medium">Category Name</label>
          <input type="text" name="name" value={catForm.name} onChange={handleCatChange} className="w-full px-3 py-2 border rounded" required />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Add Category</button>
      </form>

      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      {categories.length === 0 ? (
        <div className="text-gray-600 mb-4">Add a category first to add products.</div>
      ) : (
        <form onSubmit={handleProdSubmit} className="space-y-3">
          {prodError && <div className="text-red-600 text-sm">{prodError}</div>}
          {prodSuccess && <div className="text-green-600 text-sm">{prodSuccess}</div>}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input type="text" name="name" value={prodForm.name} onChange={handleProdChange} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <input type="text" name="description" value={prodForm.description} onChange={handleProdChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input type="number" name="price" value={prodForm.price} onChange={handleProdChange} className="w-full px-3 py-2 border rounded" required min="0" step="0.01" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select name="categoryId" value={prodForm.categoryId} onChange={handleProdChange} className="w-full px-3 py-2 border rounded" required>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Add Product</button>
        </form>
      )}

      <h3 className="text-lg font-bold mt-8 mb-2">Product List</h3>
      <ul className="divide-y">
        {products.length === 0 && <li className="py-2 text-gray-500">No products found.</li>}
        {products.map((prod) => (
          <li key={prod.id} className="py-2 flex flex-col">
            <span className="font-semibold">{prod.name}</span>
            <span className="text-sm text-gray-600">{prod.description}</span>
            <span className="text-sm">Price: ${prod.price}</span>
            <span className="text-xs text-gray-500">Category: {prod.Category?.name || "-"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
