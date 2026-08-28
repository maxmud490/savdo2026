// api.js (or any suitable file)
import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const saveData = async (data) => {
  try {
    const response = await axios.post('http://https://savdo2026.onrender.com/api/saveList', data);

    // Assuming the server responds with the updated array directly
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
