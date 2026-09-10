import { useState, useEffect } from 'react'

const STATUS_OPTIONS = ['active', 'inactive', 'discontinued']

export default function ProductForm({ initialProduct, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    status: 'active',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialProduct) {
      setForm({
        name: initialProduct.name,
        sku: initialProduct.sku,
        price: initialProduct.price,
        status: initialProduct.status,
      })
    }
  }, [initialProduct])

  function validate() {
    if (!form.name.trim()) return 'Name is required'
    if (!form.sku.trim()) return 'SKU is required'
    if (form.sku.includes(' ')) return 'SKU must not contain spaces'
    const priceNum = Number(form.price)
    if (!form.price || isNaN(priceNum) || priceNum <= 0) return 'Price must be a number greater than 0'
    if (!STATUS_OPTIONS.includes(form.status)) return 'Invalid status'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setSaving(true)
    try {
      await onSave({
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: Number(form.price),
        status: form.status,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{initialProduct ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            SKU
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
          </label>
          <label>
            Price
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onCancel} disabled={saving}>Cancel</button>
            <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
