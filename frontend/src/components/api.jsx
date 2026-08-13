// api.js (or any suitable file)
import axios from 'axios';

export const saveData = async (data) => {
  try {
    const response = await axios.post('http://localhost:5000/api/saveList', data);

    // Assuming the server responds with the updated array directly
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
