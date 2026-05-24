import { MessageSquare } from "lucide-react";
import ChatBox from "@/components/ChatBox";

export default function CatatCepatPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <MessageSquare className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-stone-800">Catat Cepat</h1>
          <p className="text-xs text-stone-400">Catat transaksi pakai chat</p>
        </div>
      </div>
      <ChatBox />
    </div>
  );
}
