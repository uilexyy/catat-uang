import { MessageSquare } from "lucide-react";
import ChatBox from "@/components/ChatBox";

export default function CatatCepatPage() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl p-5 shadow-lg">
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
      <ChatBox />
    </div>
  );
}
