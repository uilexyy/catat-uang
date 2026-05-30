"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<"enter" | "stable" | "exit">("enter");
  const prevPath = useRef(pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      setState("exit");
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setState("enter");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setState("stable");
          });
        });
      }, 150);
      prevPath.current = pathname;
    } else {
      setState("stable");
    }
    return () => clearTimeout(timeoutRef.current);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-[400ms] ease-out ${
        state === "exit"
          ? "opacity-0 translate-y-2 scale-[0.98]"
          : state === "enter"
            ? "opacity-0 translate-y-2 scale-[0.98]"
            : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {children}
    </div>
  );
}
