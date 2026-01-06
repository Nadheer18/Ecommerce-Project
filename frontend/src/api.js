import axios from 'axios';

// BEST APPROACH FOR KUBERNETES
// Ingress exposes backend on: http://ecommerce.local/api
// Using relative URL works both locally and in cluster
const API = axios.create({
  baseURL: "/api"
});

// Attach token for protected routes
API.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

