import { MessageSquare } from "lucide-react";
import ChatBox from "@/components/ChatBox";

export default function CatatCepatPage() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots-emerald" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-emerald)" />
          </svg>
        </div>
        <div className="relative p-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Catat Cepat</h1>
              <p className="text-sm text-emerald-100">Catat transaksi pakai chat</p>
            </div>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full h-4 text-stone-50 dark:text-stone-950" viewBox="0 0 1200 16" preserveAspectRatio="none" fill="currentColor">
          <path d="M0,16 C300,0 600,16 900,0 C1050,-5 1200,8 1200,8 L1200,16 L0,16 Z" />
        </svg>
      </div>
      <ChatBox />
    </div>
  );
}
