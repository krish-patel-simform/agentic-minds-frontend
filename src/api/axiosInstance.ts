import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { config } from "../config";
import { tokenStorage } from "../utils/tokenStorage";
import type { AuthTokens } from "../types/auth.type";

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

const AUTH_ENDPOINTS = config.endpoints.auth;

function isExcludedFromRefresh(url?: string): boolean {
  if (!url) return false;
  return url.includes(AUTH_ENDPOINTS.login) || url.includes(AUTH_ENDPOINTS.refresh);
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const body = data as { message?: string; detail?: unknown };
    if (typeof body.message === "string") return body.message;
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail) && body.detail.length > 0) {
      const first = body.detail[0] as { msg?: string };
      if (typeof first?.msg === "string") return first.msg;
    }
  }
  return fallback;
}

const axiosInstance = axios.create({
  baseURL: config.baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Dedicated, interceptor-free client used only to call the refresh endpoint.
// Keeping it separate avoids recursive refresh attempts and a circular
// import with auth.api.ts (which itself imports axiosInstance).
const refreshClient = axios.create({
  baseURL: config.apiBaseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    if (!isExcludedFromRefresh(requestConfig.url)) {
      const token = tokenStorage.getAccessToken();
      if (token) {
        requestConfig.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return requestConfig;
  },
  (error: AxiosError) => Promise.reject(error),
);

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let refreshQueue: QueuedRequest[] = [];

function resolveQueue(token: string): void {
  refreshQueue.forEach(({ resolve }) => resolve(token));
  refreshQueue = [];
}

function rejectQueue(error: unknown): void {
  refreshQueue.forEach(({ reject }) => reject(error));
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const { data } = await refreshClient.post<AuthTokens>(
    AUTH_ENDPOINTS.refresh,
    { refresh_token: refreshToken },
  );

  tokenStorage.setTokens({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  });

  return data.access_token;
}

function forceLogoutRedirect(): void {
  tokenStorage.clearTokens();
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.assign("/login?sessionExpired=true");
  }
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; detail?: unknown }>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    const shouldAttemptRefresh =
      (status === 401 || status === 403) &&
      !!originalRequest &&
      !originalRequest._retry &&
      !isExcludedFromRefresh(originalRequest.url);

    if (shouldAttemptRefresh && originalRequest) {
      if (!tokenStorage.getRefreshToken()) {
        forceLogoutRedirect();
        return Promise.reject(
          new ApiError("Session expired. Please log in again.", status, error.code),
        );
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.set("Authorization", `Bearer ${token}`);
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const newAccessToken = await refreshAccessToken();
        isRefreshing = false;
        resolveQueue(newAccessToken);
        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        rejectQueue(refreshError);
        forceLogoutRedirect();
        return Promise.reject(
          new ApiError("Session expired. Please log in again.", status, error.code),
        );
      }
    }

    if (error.response) {
      const message = extractErrorMessage(
        error.response.data,
        `Request failed with status ${error.response.status}`,
      );
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
