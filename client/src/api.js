// src/api.js
import axios from 'axios';

const base = import.meta.env.VITE_API_URL || '/api'; // prefer VITE_API_URL, fallback to proxy '/api'

const api = axios.create({
  baseURL: base,
  withCredentials: true,
});

export default api;
