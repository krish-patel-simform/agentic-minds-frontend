export const config = {
  baseURL: import.meta.env.VITE_JSON_SERVER_BASE_URL,
  apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  endpoints: {
    jobs: "/jobs",
    candidates: "/candidates",
    auth: {
      login: "/api/v1/auth/login",
      refresh: "/api/v1/auth/refresh",
      logout: "/api/v1/auth/logout",
      me: "/api/v1/auth/me",
    },
  },
};
