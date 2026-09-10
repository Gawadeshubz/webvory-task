export default function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return <p className="empty-state">No products found.</p>
  }

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th>Price</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.sku}</td>
            <td>₹{p.price.toFixed(2)}</td>
            <td>
              <span className={`status-badge status-${p.status}`}>{p.status}</span>
            </td>
            <td className="actions">
              <button onClick={() => onEdit(p)}>Edit</button>
              <button className="danger" onClick={() => onDelete(p)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
