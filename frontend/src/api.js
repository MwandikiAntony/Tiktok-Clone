import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", 
});

// Attach token for future requests
export const setToken = (token) => {
  api.defaults.headers.common["Authorization"] = "Bearer " + token;
  localStorage.setItem("token", token); // save token locally
};

// Get token from localStorage
export const getToken = () => {
  const token = localStorage.getItem("token");
  if (token) setToken(token); // ensure axios has it set
  return token;
};

// Optional: remove token on logout
export const removeToken = () => {
  delete api.defaults.headers.common["Authorization"];
  localStorage.removeItem("token");
};
