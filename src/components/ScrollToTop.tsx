"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 left-6 z-40 w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-lg flex items-center justify-center text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:shadow-xl active:scale-90 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      title="Ke atas"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
}
