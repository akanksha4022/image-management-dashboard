import API from '../api';

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getProducts = () => API.get('/products',{
  headers: getAuthHeader(),
});

export const createProduct = (data) => API.post('/products', data, {
  headers: { 
    ...getAuthHeader(),
    'Content-Type': 'multipart/form-data' },
});

export const updateProduct = (id, data) => API.put(`/products/${id}`, data, {
  headers: { 
    ...getAuthHeader(),
    'Content-Type': 'multipart/form-data' },
});

export const deleteProduct = (id) => API.delete(`/products/${id}`,{
  headers: getAuthHeader(),
});
