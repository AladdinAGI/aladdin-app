'use client';

import { useEffect, useRef } from 'react';
import type { ECharts } from 'echarts';
import * as echarts from 'echarts';

export default function ContractPanel() {
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
    <div className="bg-white rounded-lg shadow-sm h-full p-4">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Platform Health
      </h2>
      <div ref={chartRef} className="h-40" />

      <div className="mt-0">
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Signed Agents
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Agent Alpha', status: 'Active', type: 'General AI' },
            { name: 'Agent Beta', status: 'Pending', type: 'Finance AI' },
          ].map((agent, index) => (
            <div
              key={index}
              className="p-3 border border-gray-100 rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-gray-900">{agent.name}</div>
                <div className="text-sm text-gray-500">{agent.type}</div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  agent.status === 'Active'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {agent.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
