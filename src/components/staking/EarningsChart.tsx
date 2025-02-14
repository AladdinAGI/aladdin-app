// components/staking/EarningsChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

export default function EarningsChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | undefined>(undefined);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    // Generate data for the past 30 days
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString();
    });

    // Generate realistic daily earnings between $2-3
    const data = dates.map(() => +(Math.random() * 1 + 2).toFixed(2));

    const option = {
      title: {
        text: 'Daily Earnings (Past 30 Days)',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal',
          color: '#333',
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: { name: string; value: number }[]) => {
          const data = params[0];
          return `${data.name}<br/>$${data.value.toFixed(2)}`;
        },
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '12%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          },
          interval: 'auto',
          rotate: 45,
        },
        axisLine: {
          lineStyle: {
            color: '#ddd',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '${value}',
        },
        splitLine: {
          lineStyle: {
            color: '#eee',
          },
        },
      },
      series: [
        {
          data,
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#1890ff',
          },
          itemStyle: {
            color: '#1890ff',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(24,144,255,0.3)',
                },
                {
                  offset: 1,
                  color: 'rgba(24,144,255,0.1)',
                },
              ],
            },
          },
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
      <div ref={chartRef} className="h-[400px] w-full" />
    </div>
  );
}
