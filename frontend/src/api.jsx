import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Queue for failed requests during token refresh
let isRefreshing = false;
let refreshSubscribers = [];

// Helper: notify all waiting requests after refresh
const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // If unauthorized & not retried yet
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Queue the request until refresh is done
        return new Promise((resolve) => {
          refreshSubscribers.push(() => resolve(api(original)));
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        const { data } = await api.get("/auth/refresh");

        // Store new token if backend returns it
        if (data?.token) {
          localStorage.setItem("token", data.token);
        }

        isRefreshing = false;
        onRefreshed();

        return api(original); // retry original request
      } catch (err) {
        isRefreshing = false;
        // logout if refresh also fails
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = "/login";
        }
        
        return Promise.reject(err);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data);
    } else if (error.response?.status === 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
