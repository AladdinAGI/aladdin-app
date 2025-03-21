// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ChatPanel from '@/components/Home/ChatPanel';
import ContractPanel from '@/components/Home/ContractPanel';
import HistoryPanel from '@/components/Home/HistoryPanel';
import { stakingStateAtom } from '@/store';
import { useAtom } from 'jotai';

export default function Home() {
  const [showContract] = useAtom(stakingStateAtom);
  const [isContractVisible, setIsContractVisible] = useState(false);

  // Handle the animation timing
  useEffect(() => {
    let animationTimeout;
    if (showContract) {
      setIsContractVisible(true);
    } else {
      // Set a timeout to allow the exit animation to complete
      animationTimeout = setTimeout(() => {
        setIsContractVisible(false);
      }, 500); // Match the duration in the CSS
    }

    // Cleanup timeout on unmount
    return () => {
      if (animationTimeout) clearTimeout(animationTimeout);
    };
  }, [showContract]);

  return (
    <main className="px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* History panel - always visible on md screens and up */}
        <div className="hidden md:flex md:flex-col bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:order-1 md:h-[calc(100vh-88px)]">
          <HistoryPanel />
        </div>

        <div className="order-1 md:order-2">
          <div
            className={`grid grid-cols-1 ${
              showContract ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
            } gap-6`}
          >
            {/* Chat panel - always visible */}
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] h-[calc(100vh-88px)]">
              <ChatPanel />
            </div>

            {/* Contract panel - conditionally visible with animation */}
            {(showContract || isContractVisible) && (
              <div
                className={`
                  bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] 
                  transform transition-all duration-500 ease-in-out
                  ${
                    isContractVisible
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 lg:pointer-events-none'
                  } 
                  h-[calc(100vh-88px)]
                `}
              >
                <ContractPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
