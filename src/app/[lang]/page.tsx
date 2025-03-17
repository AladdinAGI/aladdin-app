// app/page.tsx
import ChatPanel from '@/components/Home/ChatPanel';
import ContractPanel from '@/components/Home/ContractPanel';
import HistoryPanel from '@/components/Home/HistoryPanel';

export default function Home() {
  return (
    <main className="px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[300px_1fr_300px] gap-6">
        {/* 在移动端隐藏 HistoryPanel */}
        <div className="hidden md:block bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:order-1 md:h-[calc(100vh-88px)]">
          <HistoryPanel />
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] order-1 md:order-2 h-[calc(100vh-88px)]">
          <ChatPanel />
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] order-2 lg:order-3 h-[calc(100vh-88px)] md:h-[calc(100vh-88px)]">
          <ContractPanel />
        </div>
      </div>
    </main>
  );
}
