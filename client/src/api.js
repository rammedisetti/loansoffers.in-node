/** Thin fetch wrapper. Uses same-origin /api in production and Vite proxy in dev. */

const BASE = import.meta.env.VITE_API_BASE || '';

async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const opts = { method, credentials: 'include', headers: {} };
  if (body != null) {
    if (isForm) {
      opts.body = body; // FormData; browser sets multipart headers
    } else {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(body);
    }
  }
  const res = await fetch(`${BASE}/api${path}`, opts);
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : null;
  if (!res.ok) {
    const err = new Error((data && (data.detail || 'Request failed')) || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get: (p) => request(p),
  post: (p, body) => request(p, { method: 'POST', body }),
  put: (p, body) => request(p, { method: 'PUT', body }),
  del: (p) => request(p, { method: 'DELETE' }),
  postForm: (p, formData) => request(p, { method: 'POST', body: formData, isForm: true }),
  putForm: (p, formData) => request(p, { method: 'PUT', body: formData, isForm: true }),
};

export default api;
