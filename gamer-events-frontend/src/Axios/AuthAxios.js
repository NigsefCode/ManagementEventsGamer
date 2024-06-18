import axiosInstance from "./Axios";

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('register/', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('token/', credentials);
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
