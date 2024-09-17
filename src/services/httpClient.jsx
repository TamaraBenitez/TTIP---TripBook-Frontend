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

    // Manejo de errores de autenticación (401)
    if (
      error.response !== undefined &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      sessionStorage.removeItem("token");
      window.location.reload();

      return httpClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export { httpClient };
