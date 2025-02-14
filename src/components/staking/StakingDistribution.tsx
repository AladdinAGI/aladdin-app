// components/staking/StakingDistribution.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

export default function StakingDistribution() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | undefined>(undefined);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: ${c} ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        left: 'center',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          fontSize: 12,
          color: '#666',
        },
      },
      series: [
        {
          name: 'Staking Distribution',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: false,
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: 2000,
              name: 'USDC-Morpho',
              itemStyle: { color: '#1890ff' },
            },
            {
              value: 1500,
              name: 'USDT-Aave',
              itemStyle: { color: '#52c41a' },
            },
            {
              value: 1500,
              name: 'DAI-Compound',
              itemStyle: { color: '#722ed1' },
            },
          ],
        },
      ],
    };

    chart.setOption(option);

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
    <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Staking Distribution 质押分布</h2>
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-500">Total Earnings 累计收益</div>
          <div className="text-xl font-semibold text-[#1890ff]">$36.30</div>
        </div>
      </div>
      <div ref={chartRef} className="h-[300px] w-full" />
    </div>
  );
}
