'use client';
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useResizeObserver } from '@/hooks/useResizeObserver';

// Register necessary ECharts components
echarts.use([
  GridComponent,
  TooltipComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  MarkLineComponent,
  MarkPointComponent,
]);

interface PricePoint {
  date: string;
  price: number;
}

interface PriceHistoryChartProps {
  data: PricePoint[];
}

const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Calculate price change percentage
  const calculatePriceChange = () => {
    if (!data || data.length < 2) return { change: 0, percent: '0.00%' };

    const firstPrice = data[0].price;
    const lastPrice = data[data.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentChange = (change / firstPrice) * 100;

    return {
      change,
      percent: `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`,
      isPositive: percentChange >= 0,
    };
  };

  const priceChange = calculatePriceChange();
  const changeColor = priceChange.isPositive ? '#16c784' : '#ea3943';

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Initialize and update chart
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // If chart already exists, dispose it
    if (chartInstance.current) {
      chartInstance.current.dispose();
    }

    // Create new chart instance
    const chart = echarts.init(chartRef.current);
    chartInstance.current = chart;

    // Prepare data
    const dates = data.map((item) => formatDate(item.date));
    const prices = data.map((item) => item.price);
    const minPrice = Math.min(...prices) * 0.995; // Slightly lower for better visualization
    const maxPrice = Math.max(...prices) * 1.005; // Slightly higher for better visualization

    // Set chart options
    const options = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: {
          lineStyle: {
            color: '#a0a0a0',
          },
        },
        axisLabel: {
          color: '#555',
          fontSize: 12,
        },
      },
      yAxis: {
        type: 'value',
        min: minPrice,
        max: maxPrice,
        axisLine: {
          lineStyle: {
            color: '#a0a0a0',
          },
        },
        axisLabel: {
          formatter: (value: number) => {
            return `$${value.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`;
          },
          color: '#555',
          fontSize: 12,
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          const date = dates[dataIndex];
          const price = prices[dataIndex];
          return `
            <div style="font-size: 14px; color: #666; font-weight: 500; margin-bottom: 4px;">${date}</div>
            <div style="font-size: 14px; display: flex; justify-content: space-between;">
              <span>Price:</span>
              <span style="font-weight: 600; margin-left: 10px; color: #1890ff;">
                $${price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          `;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        padding: 10,
        textStyle: {
          color: '#333',
        },
        extraCssText:
          'box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); border-radius: 4px;',
      },
      series: [
        {
          name: 'Price',
          type: 'line',
          data: prices,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          sampling: 'average',
          itemStyle: {
            color: '#1890ff',
          },
          lineStyle: {
            width: 3,
            color: '#1890ff',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
            ]),
          },
          markPoint: priceChange.isPositive
            ? {
                data: [
                  {
                    type: 'max',
                    name: 'Max',
                    symbolSize: 55,
                    itemStyle: { color: '#16c784' },
                  },
                ],
                label: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter: (params: any) => {
                    return `$${params.value.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`;
                  },
                },
              }
            : {
                data: [
                  {
                    type: 'min',
                    name: 'Min',
                    symbolSize: 55,
                    itemStyle: { color: '#ea3943' },
                  },
                ],
                label: {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter: (params: any) => {
                    return `$${params.value.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`;
                  },
                },
              },
        },
      ],
      animation: true,
    };

    // Apply options to chart
    chart.setOption(options);

    // Return cleanup function
    return () => {
      chart.dispose();
      chartInstance.current = null;
    };
  }, [data, priceChange.isPositive]);

  // Handle chart container resize
  const handleResize = () => {
    if (chartInstance.current) {
      chartInstance.current.resize();
    }
  };

  // Use resize observer to handle container size changes
  useResizeObserver(chartRef as React.RefObject<HTMLElement>, handleResize);

  if (!data || data.length === 0) {
    return <div className="text-center py-4">No price data available</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Price History</h3>
        <div className="flex items-center">
          <span
            className="text-sm font-medium px-2 py-1 rounded"
            style={{ color: changeColor }}
          >
            {priceChange.percent}
          </span>
        </div>
      </div>
      <div ref={chartRef} className="h-64 w-full" />
    </div>
  );
};

export default PriceHistoryChart;
