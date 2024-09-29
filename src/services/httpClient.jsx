import axios from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_TRIPBOOK_API,
});

httpClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (config.headers)
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

// Interceptor de respuesta para las llamadas a la API
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and the request has not been retried
    if (
      error.response !== undefined &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      sessionStorage.removeItem("token");

      // Check if the user is on the login page
      const isLoginPage = window.location.pathname === "/login";

      // If not on the login page, redirect to login and notify about session expiration
      if (!isLoginPage) {
        window.location.href = "/login"; // Redirect to login with a query parameter
      }
    }
    return Promise.reject(error);
  }
);

export { httpClient };
