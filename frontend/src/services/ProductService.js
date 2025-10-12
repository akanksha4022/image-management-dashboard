import API from '../api';

export const getProducts = () => API.get('/products');

export const createProduct = (data) => API.post('/products', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const updateProduct = (id, data) => API.put(`/products/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const deleteProduct = (id) => API.delete(`/products/${id}`);
