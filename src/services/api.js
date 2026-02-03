// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
        }
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || error.error || 'API request failed');
    }

    return response.json();
}

// Products API
export const productsAPI = {
    getAll: () => fetchAPI('/products'),
    getById: (id) => fetchAPI(`/products/${id}`),
    create: (formData) => fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        body: formData
    }).then(res => res.json()),
    update: (id, formData) => fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        body: formData
    }).then(res => res.json()),
    delete: (id) => fetchAPI(`/products/${id}`, { method: 'DELETE' })
};

// Orders API
export const ordersAPI = {
    getAll: () => fetchAPI('/orders'),
    getById: (orderId) => fetchAPI(`/orders/${orderId}`),
    track: (orderId) => fetchAPI(`/orders/track/${orderId}`),
    create: (orderData) => fetchAPI('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    }),
    updateStatus: (orderId, status, note) => fetchAPI(`/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note })
    })
};

// Memberships API
export const membershipsAPI = {
    getAll: () => fetchAPI('/memberships'),
    getRequests: () => fetchAPI('/memberships/requests'),
    getUserMembership: (email) => fetchAPI(`/memberships/user/${email}`),
    getPendingRequest: (email) => fetchAPI(`/memberships/request/${email}`),
    submitRequest: (formData) => fetch(`${API_BASE_URL}/memberships/request`, {
        method: 'POST',
        body: formData
    }).then(res => res.json()),
    approveRequest: (id) => fetchAPI(`/memberships/request/${id}/approve`, { method: 'PUT' }),
    rejectRequest: (id) => fetchAPI(`/memberships/request/${id}/reject`, { method: 'PUT' }),
    addReferral: (referralCode, referredUserName) => fetchAPI('/memberships/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode, referredUserName })
    })
};

// Categories API
export const categoriesAPI = {
    getAll: () => fetchAPI('/categories'),
    getById: (id) => fetchAPI(`/categories/${id}`),
    create: (formData) => fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        body: formData
    }).then(res => res.json()),
    update: (id, formData) => fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        body: formData
    }).then(res => res.json()),
    delete: (id) => fetchAPI(`/categories/${id}`, { method: 'DELETE' })
};

// Auth API
export const authAPI = {
    register: (userData) => fetchAPI('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    }),
    login: (credentials) => fetchAPI('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    }),
    getProfile: (token) => fetchAPI('/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
};

// Health check
export const checkAPIHealth = () => fetchAPI('/health');

export default { productsAPI, ordersAPI, membershipsAPI, categoriesAPI, authAPI, checkAPIHealth };

