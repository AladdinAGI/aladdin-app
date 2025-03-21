'use client';

import { useState, useEffect, useRef } from 'react';
import type { ECharts } from 'echarts';
import * as echarts from 'echarts';

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

  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | undefined>(undefined);

  useEffect(() => {
    if (!chartRef.current) return;

    // 如果已经存在图表实例，先销毁它
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

    // 添加窗口大小变化的监听器
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-[#f0f0f0]">
        <h2 className="text-base font-medium text-[#333] m-0">History</h2>
      </div>

      {/* History items */}
      <div className="overflow-y-auto p-3 flex-1">
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

      {/* Platform Health section - moved from ContractPanel */}
      <div className="p-4 border-t border-[#f0f0f0]">
        <h2 className="text-base font-medium text-gray-900 mb-4">
          Platform Health
        </h2>
        <div ref={chartRef} className="h-40" />
      </div>
    </div>
  );
}
