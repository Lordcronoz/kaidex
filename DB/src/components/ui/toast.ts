import { toast as sonnerToast, type ExternalToast } from "sonner";

/**
 * Opinionated toast helper on top of sonner.
 *
 * - Stacking limit + duration are configured on the <Toaster /> in __root.
 * - Variants match the top-nav notification tones (success / info / warning / error).
 * - Dismissible by default; `persistent: true` disables auto-dismiss.
 */

type Variant = "default" | "success" | "info" | "warning" | "error";

export interface ToastOptions extends Omit<ExternalToast, "duration"> {
  description?: React.ReactNode;
  duration?: number;
  persistent?: boolean;
  action?: { label: string; onClick: () => void };
}

function fire(variant: Variant, message: React.ReactNode, opts: ToastOptions = {}) {
  const { persistent, duration, action, ...rest } = opts;
  const payload = {
    ...rest,
    duration: persistent ? Infinity : (duration ?? 4500),
    ...(action ? { action: { label: action.label, onClick: () => action.onClick() } } : {}),
  } as ExternalToast;
  switch (variant) {
    case "success":
      return sonnerToast.success(message, payload);
    case "info":
      return sonnerToast.info(message, payload);
    case "warning":
      return sonnerToast.warning(message, payload);
    case "error":
      return sonnerToast.error(message, payload);
    default:
      return sonnerToast(message, payload);
  }
}

export const toast = Object.assign(
  (message: React.ReactNode, options?: ToastOptions) => fire("default", message, options),
  {
    success: (m: React.ReactNode, o?: ToastOptions) => fire("success", m, o),
    info: (m: React.ReactNode, o?: ToastOptions) => fire("info", m, o),
    warning: (m: React.ReactNode, o?: ToastOptions) => fire("warning", m, o),
    error: (m: React.ReactNode, o?: ToastOptions) => fire("error", m, o),
    dismiss: sonnerToast.dismiss,
    promise: sonnerToast.promise,
    loading: sonnerToast.loading,
  },
);