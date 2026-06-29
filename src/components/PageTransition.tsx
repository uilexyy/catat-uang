"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [state, setState] = useState<"enter" | "stable">("stable");
  const prevPath = useRef(pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setState("enter");
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setState("stable"), 50);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [pathname]);

  return (
    <div
      className={`transition-all duration-[500ms] cubic-bezier(0.16,1,0.3,1) ${
        state === "enter"
          ? "opacity-0 translate-y-3"
          : "opacity-100 translate-y-0"
      }`}
    >
      {children}
    </div>
  );
}
