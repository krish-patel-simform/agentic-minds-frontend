import axiosInstance from "./axiosInstance";
import { config } from "../config";
import type { AuthTokens, AuthUser, LoginRequest } from "../types/auth.type";

const AUTH_ENDPOINTS = config.endpoints.auth;

export const authApi = {
  login: async (payload: LoginRequest): Promise<AuthTokens> => {
    const { data } = await axiosInstance.post<AuthTokens>(
      `${config.apiBaseURL}${AUTH_ENDPOINTS.login}`,
      payload,
    );
    return data;
  },

  logout: async (refreshToken: string): Promise<void> => {
    await axiosInstance.post(`${config.apiBaseURL}${AUTH_ENDPOINTS.logout}`, {
      refresh_token: refreshToken,
    });
  },

  me: async (): Promise<AuthUser> => {
    const { data } = await axiosInstance.get<AuthUser>(
      `${config.apiBaseURL}${AUTH_ENDPOINTS.me}`,
    );
    return data;
  },
};
