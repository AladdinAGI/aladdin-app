'use client';

import { useState, useEffect, useRef } from 'react';
import type { ECharts } from 'echarts';
import * as echarts from 'echarts';
import { TrashIcon } from '@radix-ui/react-icons';
import { useHistory, HistoryItem } from '@/hooks/useHistory';

// Event bus for communicating with ChatPanel - hydration safe version
export const HistoryEventBus = {
  useOnSelectQuestion: (callback: (question: string) => void) => {
    useEffect(() => {
      // Define the event handler
      const handleSelectQuestion = (e: CustomEvent<{ question: string }>) => {
        callback(e.detail.question);
      };

      // Attach event listener
      window.addEventListener(
        'history:select-question',
        handleSelectQuestion as EventListener
      );

      // Return cleanup function
      return () => {
        window.removeEventListener(
          'history:select-question',
          handleSelectQuestion as EventListener
        );
      };
    }, [callback]);
  },

  selectQuestion: (question: string) => {
    // Only dispatch event on client-side
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('history:select-question', {
          detail: { question },
        })
      );
    }
  },
};

export default function HistoryPanel() {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag after mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle click on history item
  const handleHistoryItemClick = (item: HistoryItem) => {
    HistoryEventBus.selectQuestion(item.question);
  };

  // Handle delete history item
  const handleDeleteHistoryItem = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.stopPropagation(); // Prevent triggering parent click event
    removeFromHistory(id);
  };

  // Initialize chart - only on client side
  useEffect(() => {
    if (!chartRef.current) return;

    // Dispose of existing chart instance if any
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    const option = {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 4,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.25, '#f5222d'],
                [0.5, '#faad14'],
                [0.75, '#52c41a'],
                [1, '#1890ff'],
              ],
            },
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 4,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto',
            },
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 1,
            },
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 2,
            },
          },
          axisLabel: {
            color: '#666',
            fontSize: 10,
            distance: -60,
          },
          title: {
            offsetCenter: [0, '-20%'],
            fontSize: 12,
          },
          detail: {
            fontSize: 14,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            color: 'auto',
          },
          data: [
            {
              value: 95,
              name: '',
            },
          ],
        },
      ],
    };

    chart.setOption(option);

    // Add window resize listener
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [isClient]); // Only run after client-side hydration is complete

  // Get type badge color
  const getTypeBadgeStyle = (type: HistoryItem['type']) => {
    switch (type) {
      case 'staking':
        return 'bg-[#e6f7ff] text-[#1890ff]';
      case 'price':
        return 'bg-[#f6ffed] text-[#52c41a]';
      case 'defi':
        return 'bg-[#fff7e6] text-[#fa8c16]';
      case 'token':
        return 'bg-[#f9f0ff] text-[#722ed1]';
      case 'market':
        return 'bg-[#fcf4f6] text-[#eb2f96]';
      default:
        return 'bg-[#f5f5f5] text-[#666]';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#f0f0f0] flex justify-between items-center">
        <h2 className="text-base font-medium text-[#333] m-0">History</h2>
        {isClient && history.length > 0 && (
          <button
            onClick={() => clearHistory()}
            className="text-xs text-[#999] hover:text-[#666] transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* History items */}
      <div className="overflow-y-auto p-3 flex-1">
        {!isClient || history.length === 0 ? (
          <div className="text-center py-6 text-[#999] text-sm">
            No history yet. Your chat questions will appear here.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleHistoryItemClick(item)}
              className="p-3 rounded-lg border border-[#f0f0f0] mb-2 cursor-pointer hover:bg-[#fafafa] transition-all hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
            >
              <div className="text-xs text-[#666] mb-1.5 flex justify-between">
                <span>{item.time}</span>
                <button
                  onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                  className="text-[#999] hover:text-[#f5222d] transition-colors"
                  title="Delete this history item"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </div>
              <div className="flex justify-between items-start gap-2">
                <div className="text-sm text-[#333] break-all flex-1">
                  {item.question.length > 50
                    ? `${item.question.substring(0, 50)}...`
                    : item.question}
                </div>
                <span
                  className={`
                    px-2 py-0.5 rounded text-xs flex-shrink-0
                    ${getTypeBadgeStyle(item.type)}
                  `}
                >
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Platform Health section */}
      <div className="p-4 border-t border-[#f0f0f0]">
        <h2 className="text-base font-medium text-gray-900 mb-4">
          Platform Health
        </h2>
        <div ref={chartRef} className="h-40" />
      </div>
    </div>
  );
}
