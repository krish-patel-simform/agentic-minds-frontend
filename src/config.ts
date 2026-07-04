export const config = {
  // Legacy json-server dummy backend - no longer used by any page.
  baseURL: import.meta.env.VITE_JSON_SERVER_BASE_URL,
  apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  endpoints: {
    jobs: "/api/v1/jobs",
    candidates: "/api/v1/candidates",
    auth: {
      login: "/api/v1/auth/login",
      refresh: "/api/v1/auth/refresh",
      logout: "/api/v1/auth/logout",
      me: "/api/v1/auth/me",
    },
  },
};
