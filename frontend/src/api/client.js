import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

function isPublicInsightsGet(config) {
  const method = (config?.method || "get").toLowerCase();
  const url = config?.url || "";
  return method === "get" && /^\/insights\/stocks(\/|$)/.test(url);
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && !isPublicInsightsGet(config)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config?.headers?.Authorization && isPublicInsightsGet(config)) {
    delete config.headers.Authorization;

  }
  return config;
});



api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestConfig = error?.config;
    if (status === 401 && !isPublicInsightsGet(requestConfig)) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("current_user");
      window.dispatchEvent(new Event("auth-changed"));
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);


export default api;
