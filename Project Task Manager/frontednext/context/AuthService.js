import axios from "axios";

let token = localStorage.getItem("token");

export const getToken = () => token;

export const setToken = (newToken) => {
  token = newToken;
  localStorage.setItem("token", newToken);
};

export const clearToken = () => {
  token = null;
  localStorage.removeItem("token");
};

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/auth/refresh",
      null,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    const newToken = response.data.access_token;
    setToken(newToken);
    return newToken;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    throw error;
  }
};
