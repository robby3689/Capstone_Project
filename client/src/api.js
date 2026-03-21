import axios from 'axios';

const API_BASE_URL = 'https://evergreen-clinic-backend.onrender.com/api'; 

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;