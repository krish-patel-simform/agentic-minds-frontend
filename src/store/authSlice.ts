import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { authApi } from "../api/auth.api";
import { ApiError } from "../api/axiosInstance";
import { tokenStorage } from "../utils/tokenStorage";
import type { AuthUser, LoginRequest } from "../types/auth.type";
import type { RootState } from "./store";

interface AuthState {
  user: AuthUser | null;
  isInitializing: boolean;
}

const initialState: AuthState = {
  user: null,
  isInitializing: Boolean(
    tokenStorage.getAccessToken() || tokenStorage.getRefreshToken(),
  ),
};

export const bootstrapSession = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: ApiError }
>("auth/bootstrapSession", async (_, { rejectWithValue }) => {
  try {
    return await authApi.me();
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const login = createAsyncThunk<
  AuthUser,
  LoginRequest,
  { rejectValue: ApiError }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const tokens = await authApi.login(payload);
    tokenStorage.setTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
    return await authApi.me();
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  const refreshToken = tokenStorage.getRefreshToken();
  try {
    if (refreshToken) {
      await authApi.logout(refreshToken);
    }
  } finally {
    tokenStorage.clearTokens();
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        bootstrapSession.fulfilled,
        (state, action: PayloadAction<AuthUser>) => {
          state.user = action.payload;
          state.isInitializing = false;
        },
      )
      .addCase(bootstrapSession.rejected, (state) => {
        state.user = null;
        state.isInitializing = false;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.user !== null;
export const selectIsInitializing = (state: RootState) =>
  state.auth.isInitializing;
