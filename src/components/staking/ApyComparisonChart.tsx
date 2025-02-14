// components/staking/ApyComparisonChart.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { ECharts } from 'echarts';

export default function ApyComparisonChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | undefined>(undefined);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    // 生成近7天的日期
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const option = {
      title: {
        text: 'APY Trend by Agent APY趋势',
        left: 'center',
        top: 0,
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal',
          color: '#333',
        },
      },
      tooltip: {
        trigger: 'axis',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: function (params: any) {
          let result = `${params[0].axisValue}<br/>`;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          params.forEach((param: any) => {
            result += `${param.marker}${param.seriesName}: ${param.value}%<br/>`;
          });
          return result;
        },
      },
      legend: {
        bottom: 0,
        left: 'center',
        data: ['Stability Agent', 'Yield Agent', 'Safety Agent'],
      },
      grid: {
        top: 50,
        right: 20,
        bottom: 50,
        left: 50,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#ddd',
          },
        },
        axisLabel: {
          color: '#666',
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%',
          color: '#666',
        },
        splitLine: {
          lineStyle: {
            color: '#eee',
          },
        },
      },
      series: [
        {
          name: 'Stability Agent',
          type: 'line',
          data: [5.1, 5.2, 5.2, 5.3, 5.2, 5.2, 5.2],
          lineStyle: { width: 2 },
          itemStyle: { color: '#1890ff' },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
          },
        },
        {
          name: 'Yield Agent',
          type: 'line',
          data: [4.7, 4.8, 4.8, 4.9, 4.8, 4.8, 4.8],
          lineStyle: { width: 2 },
          itemStyle: { color: '#52c41a' },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
          },
        },
        {
          name: 'Safety Agent',
          type: 'line',
          data: [5.0, 5.1, 5.1, 5.2, 5.1, 5.1, 5.1],
          lineStyle: { width: 2 },
          itemStyle: { color: '#722ed1' },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
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
      <div ref={chartRef} className="h-[300px] w-full" />
    </div>
  );
}
