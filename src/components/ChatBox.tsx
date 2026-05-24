"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "bot";
  text: string;
  time: string;
  error?: boolean;
}

const suggestions = [
  "beli nasi goreng 25rb",
  "gaji 5jt",
  "bayar listrik 350rb",
  "bensin 100rb",
  "belanja bulanan 500rb",
  "nonton bioskop 75rb",
];

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Halo! Catat transaksi kamu pakai chat. Contoh: **beli nasi 25rb**, **gaji 5jt**, **bayar listrik 350rb**",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleScroll() {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSend(text: string) {
    if (!text.trim() || loading) return;

    const userTime = formatTime();
    setMessages((prev) => [...prev, { role: "user", text: text.trim(), time: userTime }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await res.json();
      const botTime = formatTime();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: data.error || "Gagal memproses", time: botTime, error: true },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: data.reply, time: botTime },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Gagal terhubung ke server", time: formatTime(), error: true },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }

  return (
    <div className="flex flex-col h-[500px] rounded-2xl overflow-hidden bg-[#efeae2] border border-stone-200 relative">
      {/* Header */}
      <div className="shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">Catat Uang Bot</p>
          <p className="text-[11px] text-blue-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 inline-block" />
            Online
          </p>
        </div>
        <Sparkles className="w-4 h-4 text-blue-200" />
      </div>

      {/* Chat area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-1 scroll-smooth"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 50%)",
        }}
      >
        {/* Date separator */}
        <div className="flex justify-center mb-2">
          <span className="text-[11px] text-stone-400 bg-white/70 px-3 py-1 rounded-full shadow-xs">
            Hari ini
          </span>
        </div>

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 px-1 ${msg.role === "user" ? "justify-end" : "justify-start"} ${
              i > 0 && messages[i - 1]?.role === msg.role ? "mt-0.5" : "mt-2"
            } animate-fade-in-up`}
            style={{ animationDuration: "0.25s" }}
          >
            {msg.role === "bot" && (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 self-end mb-1 ${
                  msg.error ? "bg-rose-100" : "bg-blue-100"
                }`}
              >
                {msg.error ? (
                  <Loader2 className="w-3.5 h-3.5 text-rose-500" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-blue-600" />
                )}
              </div>
            )}

            <div className="max-w-[80%] group relative">
              <div
                className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white rounded-[18px] rounded-br-[4px] shadow-xs"
                    : msg.error
                      ? "bg-rose-50 text-rose-600 rounded-[18px] rounded-bl-[4px] border border-rose-100"
                      : "bg-white text-stone-700 rounded-[18px] rounded-bl-[4px] shadow-xs border border-stone-100"
                }`}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br>"),
                  }}
                />
              </div>
              <p
                className={`text-[10px] text-stone-400 mt-0.5 px-1 ${
                  msg.role === "user" ? "text-right" : "text-left"
                } opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
              >
                {msg.time}
              </p>
            </div>

            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 self-end mb-1">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 px-1 mt-1 animate-fade-in">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="bg-white rounded-[18px] rounded-bl-[4px] px-4 py-3 shadow-xs border border-stone-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: "0s" }} />
                <span className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: "0.15s" }} />
                <span className="w-2 h-2 rounded-full bg-stone-300 animate-bounce" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}

        {messages.length === 1 && !loading && (
          <div className="flex flex-wrap gap-1.5 justify-center mt-3">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSend(s)}
                className="text-[11px] px-3 py-1.5 rounded-full bg-white/80 text-stone-500 hover:text-blue-600 hover:bg-white border border-stone-200 hover:border-blue-200 shadow-xs transition-all duration-200 active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollBtn && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-20 right-4 w-8 h-8 rounded-full bg-white shadow-md border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-all duration-200 animate-fade-in"
        >
          <ChevronDown className="w-4 h-4 text-stone-500" />
        </button>
      )}

      {/* Input area */}
      <div className="shrink-0 bg-[#efeae2] px-3 py-2.5">
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-stone-200 pl-4 pr-2 py-1.5 shadow-xs focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan..."
            disabled={loading}
            className="flex-1 text-sm text-stone-700 placeholder-stone-300 bg-transparent focus:outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => handleSend(input)}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-200 flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
