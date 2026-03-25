import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

function isPublicInsightsGet(config) {
  const method = (config?.method || "get").toLowerCase();
  const url = config?.url || "";
  return method === "get" && /^\/insights\/stocks(\/|$)/.test(url);
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  
  // Do not append Authorization header for public endpoints or if it's already set
  const isAuthEndpoint = ['/auth/token/', '/auth/register/', '/auth/password/'].some(ep => config.url && config.url.includes(ep));
  
  if (token && !isAuthEndpoint && !isPublicInsightsGet(config)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestConfig = error?.config;
    // Redirect to login on 401 Unauthorized, except for public endpoints
    if (status === 401 && !isPublicInsightsGet(requestConfig)) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("current_user");
      window.dispatchEvent(new Event("auth-changed"));
      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
