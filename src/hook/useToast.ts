import { useContext } from "react";
import { ToastContext } from "../Component/Toast/ToastContext";
import type { ToastContextValue } from "../types/toast.type";

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
