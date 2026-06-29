"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, List, Plus, MessageSquare, Handshake, PieChart, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/catat-cepat", label: "Catat Cepat", icon: MessageSquare },
  { href: "/transactions", label: "Riwayat", icon: List },
  { href: "/transactions/new", label: "Tambah", icon: Plus },
  { href: "/anggaran", label: "Anggaran", icon: PieChart },
  { href: "/utang", label: "Utang", icon: Handshake },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!navRef.current) return;
    const activeIdx = links.findIndex((l) => pathname === l.href);
    if (activeIdx === -1) return;
    const el = navRef.current.children[activeIdx] as HTMLElement | undefined;
    if (!el) return;
    setPillStyle({
      left: el.offsetLeft + el.offsetWidth / 2 - 16,
      width: 32,
    });
  }, [pathname]);

  if (pathname === "/login" || pathname === "/register") return null;

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {}
  }

  return (
    <>
      {/* Desktop: Sidebar */}
      <aside className="hidden md:flex flex-col w-56 h-screen sticky top-0 bg-white dark:bg-stone-900 border-r border-stone-200/60 dark:border-stone-800 shrink-0">
        <div className="px-5 pt-5 pb-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <span className="font-bold text-lg text-stone-800 dark:text-stone-200 group-hover:text-blue-600 transition-colors duration-300">
              Catat Uang
            </span>
          </Link>
        </div>

        <nav className="flex-1 flex flex-col gap-0.5 px-3 group/nav">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                    : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-blue-500 animate-scale-in" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-500" : "text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] text-stone-300 dark:text-stone-600">Catat Uang v1.0</p>
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs text-stone-400 dark:text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all duration-200 active:scale-[0.97]"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile: Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 z-50 pb-[env(safe-area-inset-bottom,0px)]">
        <div ref={navRef} className="relative flex items-center justify-around h-16">
          {/* Sliding pill */}
          <span
            className="absolute bottom-2 h-1 rounded-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ left: pillStyle.left, width: pillStyle.width }}
          />

          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-14 px-2 h-full transition-all duration-200 active:scale-[0.97] ${
                  isActive ? "text-blue-600" : "text-stone-400 dark:text-stone-500 hover:text-stone-500 dark:hover:text-stone-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={`text-[10px] font-medium leading-tight truncate max-w-full transition-all duration-200 ${isActive ? "opacity-100" : "opacity-70"}`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
