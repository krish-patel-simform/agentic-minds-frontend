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
  baseURL: config.baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      requestConfig.headers.set("Authorization", `Bearer ${token}`);
    }
    return requestConfig;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response) {
      const message =
        error.response.data?.message ??
        `Request failed with status ${error.response.status}`;
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
