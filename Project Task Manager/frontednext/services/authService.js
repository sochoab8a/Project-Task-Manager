import axios from './AxiosInstance';

export const getToken = () => localStorage.getItem('token');

export const setToken = (newToken) => {
  localStorage.setItem('token', newToken);
};

export const clearToken = () => {
  localStorage.removeItem('token');
};

export const refreshToken = async () => {
  try {
    const response = await axios.post('/auth/refresh', null, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    const newToken = response.data.access_token;
    setToken(newToken);
    return newToken;
  } catch (error) {
    window.location.reload();
        throw error;
  }
};