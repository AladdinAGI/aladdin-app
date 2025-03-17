// app/page.tsx
import ChatPanel from '@/components/Home/ChatPanel';
import ContractPanel from '@/components/Home/ContractPanel';
import HistoryPanel from '@/components/Home/HistoryPanel';

export default function Home() {
  return (
    <main className="px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[300px_1fr_300px] gap-6 h-auto md:h-[calc(100vh-88px)]">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] order-2 md:order-1">
          <HistoryPanel />
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] order-1 md:order-2">
          <ChatPanel />
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] order-3 lg:order-3">
          <ContractPanel />
        </div>
      </div>
    </main>
  );
}
