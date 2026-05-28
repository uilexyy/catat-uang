"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, Plus, MessageSquare, Handshake, PieChart } from "lucide-react";
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

        <nav className="flex-1 flex flex-col gap-0.5 px-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                    : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-blue-500" : ""}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <p className="text-[11px] text-stone-300 dark:text-stone-600">Catat Uang v1.0</p>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile: Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 z-50 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex items-center justify-around h-16">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-14 px-2 h-full transition-all duration-200 active:scale-[0.97] relative ${
                  isActive ? "text-blue-600" : "text-stone-400 dark:text-stone-500 hover:text-stone-500 dark:hover:text-stone-300"
                }`}
              >
                {isActive && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-blue-500" />
                )}
                <Icon className="w-5.5 h-5.5" />
                <span className="text-[10px] font-medium leading-tight">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
