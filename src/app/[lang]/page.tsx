// app/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import ChatPanel from '@/components/Home/ChatPanel';
import ContractPanel from '@/components/Home/ContractPanel';
import HistoryPanel from '@/components/Home/HistoryPanel';
import { stakingStateAtom } from '@/store';
import { useAtom } from 'jotai';

export default function Home() {
  const [showContract] = useAtom(stakingStateAtom);
  const [isContractMounted, setIsContractMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // 更高效的处理方式，避免使用timeout
  useEffect(() => {
    if (showContract) {
      // 当需要显示合约面板时，立即挂载组件
      setIsContractMounted(true);
    } else if (!showContract && isContractMounted) {
      // 监听过渡动画结束，再卸载组件
      const handleTransitionEnd = () => {
        setIsContractMounted(false);
      };

      const currentPanelRef = panelRef.current;
      if (currentPanelRef) {
        currentPanelRef.addEventListener('transitionend', handleTransitionEnd, {
          once: true,
        });
        return () => {
          currentPanelRef.removeEventListener(
            'transitionend',
            handleTransitionEnd
          );
        };
      }
    }
  }, [showContract, isContractMounted]);

  return (
    <main className="px-4 pt-3 ">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 ">
        {/* History panel - always visible on md screens and up */}
        <div className="hidden md:flex md:flex-col bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:order-1 md:h-[calc(100vh-88px)]">
          <HistoryPanel />
        </div>

        <div className="order-1 md:order-2">
          {/* 使用CSS Grid布局而非条件类名改变，确保平滑过渡 */}
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: showContract ? '1fr 1fr' : '1fr',
              transition:
                'grid-template-columns 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Chat panel - 使用固定定位和宽度，防止变化时闪动 */}
            <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] h-[calc(100vh-88px)] overflow-hidden will-change-transform">
              <ChatPanel />
            </div>

            {/* Contract panel - 只有在需要时才渲染，并使用CSS过渡效果 */}
            {(showContract || isContractMounted) && (
              <div
                ref={panelRef}
                className={`
                  bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] 
                  transform transition-all duration-500 ease-in-out will-change-transform
                  h-[calc(100vh-88px)] overflow-hidden
                  ${
                    showContract
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-10 pointer-events-none'
                  }
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
