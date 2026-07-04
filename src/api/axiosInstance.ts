import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { config } from "../config";

export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const axiosInstance = axios.create({
  baseURL: config.apiBaseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    // No login flow exists yet - fall back to a dev-only token from env
    // until real auth is wired up.
    const token = localStorage.getItem("authToken") || config.mockAuthToken;
    if (token) {
      requestConfig.headers.set("Authorization", `Bearer ${token}`);
    }
    return requestConfig;
  },
  (error: AxiosError) => Promise.reject(error),
);

interface BackendErrorBody {
  message?: string;
  detail?: string | { loc: (string | number)[]; msg: string; type: string }[];
}

function extractErrorMessage(data: BackendErrorBody | undefined, status: number): string {
  if (!data) return `Request failed with status ${status}`;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail) && data.detail.length > 0) {
    return data.detail.map((item) => item.msg).join(", ");
  }
  return data.message ?? `Request failed with status ${status}`;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorBody>) => {
    if (error.response) {
      const message = extractErrorMessage(error.response.data, error.response.status);
      return Promise.reject(
        new ApiError(message, error.response.status, error.code),
      );
    }

    if (error.request) {
      return Promise.reject(
        new ApiError(
          "No response from server. Please check your connection.",
          undefined,
          error.code,
        ),
      );
    }

    return Promise.reject(new ApiError(error.message, undefined, error.code));
  },
);

export default axiosInstance;
