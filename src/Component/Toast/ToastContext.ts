import { createContext } from "react";
import type { ToastContextValue } from "../../types/toast.type";

export const ToastContext = createContext<ToastContextValue | null>(null);
