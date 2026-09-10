// Base URL comes from env, not hardcoded. Vite exposes vars prefixed
// with VITE_ via import.meta.env.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function handleResponse(res) {
  if (!res.ok) {
    let detail = `Request failed with status ${res.status}`
    try {
      const body = await res.json()
      if (body.detail) detail = Array.isArray(body.detail)
        ? body.detail.map((d) => d.msg).join(', ')
        : body.detail
    } catch {
      // response had no JSON body — keep default message
    }
    throw new Error(detail)
  }
  if (res.status === 204) return null
  return res.json()
}

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/api/products`)
  return handleResponse(res)
}

export async function createProduct(product) {
  const res = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  return handleResponse(res)
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })
  return handleResponse(res)
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(res)
}
