"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Wallet } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password harus diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal login");

      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-200">Catat Uang</h1>
          <p className="text-sm text-stone-400 dark:text-stone-500 mt-1">Masuk ke akun kamu</p>
        </div>

        <div className="bg-white dark:bg-stone-900/80 backdrop-blur-xl rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots-login" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-stone-800 dark:text-white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots-login)" />
            </svg>
          </div>
          <form onSubmit={handleSubmit} className="relative p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-sm px-4 py-3 rounded-xl border border-rose-200 dark:border-rose-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-4 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              autoFocus
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-2.5 pr-10 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm text-stone-700 dark:text-stone-300 placeholder-stone-300 dark:placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white text-sm font-medium rounded-xl shadow-sm active:scale-[0.97] transition-all duration-200 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Masuk"}
          </button>

          <p className="text-center text-xs text-stone-400 dark:text-stone-500">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Daftar
            </Link>
          </p>
          </form>
        </div>
      </div>
    </div>
  );
}
