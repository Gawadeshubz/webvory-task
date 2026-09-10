import { useState, useEffect, useMemo } from 'react'
import ProductTable from './components/ProductTable.jsx'
import ProductForm from './components/ProductForm.jsx'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from './api.js'

export default function App() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    )
  }, [products, search])

  function openAddForm() {
    setEditingProduct(null)
    setShowForm(true)
  }

  function openEditForm(product) {
    setEditingProduct(product)
    setShowForm(true)
  }

  async function handleSave(formData) {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData)
    } else {
      await createProduct(formData)
    }
    setShowForm(false)
    setEditingProduct(null)
    await loadProducts()
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return
    setError('')
    try {
      await deleteProduct(product.id)
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Product Dashboard</h1>
        <button onClick={openAddForm}>+ Add Product</button>
      </header>

      <input
        className="search-box"
        type="text"
        placeholder="Search by name or SKU..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="form-error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <ProductForm
          initialProduct={editingProduct}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
