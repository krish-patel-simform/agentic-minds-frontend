export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}
