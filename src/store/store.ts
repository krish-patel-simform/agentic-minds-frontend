import { configureStore } from "@reduxjs/toolkit";
import authReducer, { bootstrapSession } from "./authSlice";
import { tokenStorage } from "../utils/tokenStorage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

if (tokenStorage.getAccessToken() || tokenStorage.getRefreshToken()) {
  store.dispatch(bootstrapSession());
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
