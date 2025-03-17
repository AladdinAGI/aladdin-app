'use client';

import { useState } from 'react';

interface HistoryItem {
  time: string;
  question: string;
  type: 'staking' | 'price' | 'general';
}

export default function HistoryPanel() {
  const [history] = useState<HistoryItem[]>([
    {
      time: '14:30',
      question: "What's the current Bitcoin price?",
      type: 'price',
    },
    {
      time: '14:25',
      question: 'Show me staking options',
      type: 'staking',
    },
  ]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#f0f0f0]">
        <h2 className="text-base font-medium text-[#333] m-0">History</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {history.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border border-[#f0f0f0] mb-2 cursor-pointer hover:bg-[#fafafa] transition-all hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
          >
            <div className="text-xs text-[#666] mb-1.5">{item.time}</div>
            <div className="flex justify-between items-start gap-2">
              <div className="text-sm text-[#333] break-all flex-1">
                {item.question}
              </div>
              <span
                className={`
                px-2 py-0.5 rounded text-xs flex-shrink-0
                ${item.type === 'staking' ? 'bg-[#e6f7ff] text-[#1890ff]' : ''}
                ${item.type === 'price' ? 'bg-[#f6ffed] text-[#52c41a]' : ''}
              `}
              >
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
