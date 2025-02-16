// app/page.tsx
import ChatPanel from '@/components/Home/ChatPanel';
import ContractPanel from '@/components/Home/ContractPanel';
import HistoryPanel from '@/components/Home/HistoryPanel';

export default function Home() {
  return (
    <main className="px-4 py-3">
      <div className="grid grid-cols-[300px_1fr_300px] gap-6 h-[calc(100vh-88px)]">
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <HistoryPanel />
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <ChatPanel />
        </div>
        <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <ContractPanel />
        </div>
      </div>
    </main>
  );
}
