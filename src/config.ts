export const config = {
  // Legacy json-server dummy backend - still used by the candidates page.
  baseURL: import.meta.env.VITE_JSON_SERVER_BASE_URL,
  // Real jobs backend.
  apiBaseURL: import.meta.env.VITE_API_BASE_URL,
  mockAuthToken: import.meta.env.VITE_MOCK_AUTH_TOKEN,
  endpoints: {
    jobs: "/api/v1/jobs",
    candidates: "/candidates",
  },
};
