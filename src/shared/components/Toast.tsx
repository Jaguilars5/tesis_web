import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type ToastVariantT = "success" | "error" | "info" | "warning";

interface ToastItemProps {
  message: string;
  variant: ToastVariantT;
  onDismiss: () => void;
}

const VARIANT_STYLES: Record<ToastVariantT, { container: string; icon: typeof Info }> = {
  success: { container: "border-green-200 bg-green-50 text-green-800", icon: CheckCircle2 },
  error: { container: "border-red-200 bg-red-50 text-red-800", icon: XCircle },
  info: { container: "border-blue-200 bg-blue-50 text-blue-800", icon: Info },
  warning: { container: "border-yellow-200 bg-yellow-50 text-yellow-800", icon: AlertCircle },
};

function ToastItem({ message, variant, onDismiss }: ToastItemProps) {
  const styles = VARIANT_STYLES[variant];
  const Icon = styles.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm shadow-sm ${styles.container}`}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <p className="flex-1">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded p-0.5 opacity-60 transition hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

let toastIdCounter = 0;
let addToastFn: ((message: string, variant: ToastVariantT) => void) | null = null;

export function toast(message: string, variant: ToastVariantT = "info") {
  addToastFn?.(message, variant);
}

export function ToastContainer() {
  const [items, setItems] = useState<{ id: number; message: string; variant: ToastVariantT }[]>([]);

  const add = useCallback((message: string, variant: ToastVariantT) => {
    const id = ++toastIdCounter;
    setItems((prev) => [...prev, { id, message, variant }]);
  }, []);

  useEffect(() => {
    addToastFn = add;
    return () => { addToastFn = null; };
  }, [add]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {items.map((item) => (
        <ToastItem
          key={item.id}
          message={item.message}
          variant={item.variant}
          onDismiss={() => dismiss(item.id)}
        />
      ))}
    </div>
  );
}
