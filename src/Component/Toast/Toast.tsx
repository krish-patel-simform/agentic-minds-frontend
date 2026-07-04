import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import type { ComponentType } from "react";
import type { ToastType } from "../../types/toast.type";

interface ToastProps {
  type?: ToastType;
  message: string;
  onClose?: () => void;
}

const TOAST_STYLES: Record<
  ToastType,
  { icon: ComponentType<{ size?: number; className?: string }>; iconColor: string; bg: string; border: string }
> = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  error: {
    icon: XCircle,
    iconColor: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  info: {
    icon: Info,
    iconColor: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
};

const Toast = ({ type = "info", message, onClose }: ToastProps) => {
  const { icon: Icon, iconColor, bg, border } = TOAST_STYLES[type];

  return (
    <div
      role="status"
      className={`flex items-start gap-3 w-full max-w-sm rounded-xl border ${border} ${bg} shadow-sm px-4 py-3`}
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${iconColor}`} />
      <p className="flex-1 text-sm font-medium text-slate-700">{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="text-gray-400 hover:text-gray-600 shrink-0"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Toast;
