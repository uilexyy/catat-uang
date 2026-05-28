"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { X, CheckCircle2, AlertCircle, Undo2 } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  onUndo?: () => void;
  startedAt: number;
}

interface ToastContextValue {
  toast: (type: ToastType, message: string, onUndo?: () => void) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const DURATION = 4000;
let nextId = 0;

function ToastItem({ t, onRemove }: { t: Toast; onRemove: (id: number) => void }) {
  const [paused, setPaused] = useState(false);
  const [remaining, setRemaining] = useState(DURATION);
  const startRef = useRef(t.startedAt);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (paused) return;
    const elapsed = Date.now() - startRef.current;
    const left = Math.max(0, remaining - elapsed);
    if (left <= 0) {
      onRemove(t.id);
      return;
    }
    timerRef.current = setTimeout(() => onRemove(t.id), left);
    return () => clearTimeout(timerRef.current);
  }, [paused]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        setRemaining(DURATION - (Date.now() - startRef.current));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [paused]);

  const progress = Math.max(0, Math.min(100, (remaining / DURATION) * 100));

  return (
    <div
      className={`relative flex items-start gap-3 px-4 pt-3 pb-3.5 rounded-xl shadow-lg border backdrop-blur-xl overflow-hidden animate-[slide-in-right_0.35s_cubic-bezier(0.16,1,0.3,1)] ${
        t.type === "success"
          ? "bg-emerald-50/95 dark:bg-emerald-950/80 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-200"
          : "bg-rose-50/95 dark:bg-rose-950/80 border-rose-200/80 dark:border-rose-800/60 text-rose-800 dark:text-rose-200"
      }`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); startRef.current = Date.now(); }}
    >
      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 transition-all duration-100 ${
          t.type === "success" ? "bg-emerald-400 dark:bg-emerald-500" : "bg-rose-400 dark:bg-rose-500"
        }`}
        style={{ width: `${progress}%` }}
      />

      {t.type === "success" ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">{t.message}</p>
        {t.onUndo && (
          <button
            onClick={() => { t.onUndo!(); onRemove(t.id); }}
            className="flex items-center gap-1 mt-1.5 text-xs font-semibold opacity-70 hover:opacity-100 transition-opacity"
          >
            <Undo2 className="w-3 h-3" />
            Batalkan
          </button>
        )}
      </div>

      <button
        onClick={() => onRemove(t.id)}
        className="shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4 opacity-60" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, onUndo?: () => void) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message, onUndo, startedAt: Date.now() }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2 max-w-sm w-full sm:w-auto pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem t={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
