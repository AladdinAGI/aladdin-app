'use client';
import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';

interface Protocol {
  name: string;
  value: number;
}

interface DeFiPieChartProps {
  data: Protocol[];
}

// Better color palette inspired by the previous implementation
const colorPalette = [
  '#FF3366', // Bright pink
  '#39C0ED', // Bright blue
  '#33CC99', // Bright green
  '#FFCC00', // Bright yellow
  '#FF9933', // Bright orange
  '#9966FF', // Bright purple
  '#00CCFF', // Bright cyan
  '#FF6666', // Bright coral
  '#66CC33', // Bright lime
  '#FF66CC', // Bright magenta
];

const DeFiPieChart: React.FC<DeFiPieChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [, setHoveredProtocol] = useState<string | null>(null);

  // Format currency function
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}B`;
    }
    return `$${value}M`;
  };

  // Initialize and update chart
  useEffect(() => {
    // Make sure we only run this on the client side and have data
    if (!chartRef.current || !data || data.length === 0) return;

    // Initialize the chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // Series data for the chart - use colorPalette instead of protocol.color
    const seriesData = data.map((protocol, index) => ({
      name: protocol.name,
      value: protocol.value,
      itemStyle: {
        color: colorPalette[index % colorPalette.length],
      },
    }));

    // Configure chart options
    const options: echarts.EChartsOption = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          const value = Array.isArray(params) ? params[0].value : params.value;
          const name = Array.isArray(params) ? params[0].name : params.name;
          const percent = Array.isArray(params)
            ? params[0].percent
            : params.percent;
          return `<b>${name}</b>: ${percent?.toFixed(1)}% (${formatCurrency(
            value as number
          )})`;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        textStyle: {
          fontSize: 12,
        },
      },
      legend: {
        show: true,
        orient: 'horizontal',
        bottom: 0,
        textStyle: {
          fontSize: 12,
        },
      },
      series: [
        {
          name: 'TVL',
          type: 'pie',
          radius: ['35%', '70%'], // Inner and outer radius for donut
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'outside',
            formatter: function (params) {
              return `${formatCurrency(params.value as number)}`;
            },
            fontSize: 12,
            fontWeight: 'bold',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          labelLine: {
            show: true,
            length: 15,
            length2: 10,
            smooth: true,
          },
          data: seriesData,
        },
      ],
    };

    // Set options and render chart
    chartInstance.current.setOption(options);

    // Add event handlers
    chartInstance.current.on('mouseover', { seriesIndex: 0 }, (params) => {
      setHoveredProtocol(params.name);
    });

    chartInstance.current.on('mouseout', { seriesIndex: 0 }, () => {
      setHoveredProtocol(null);
    });

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [data]);

  return (
    <div className="flex flex-col">
      <div className="relative w-full" style={{ height: '300px' }}>
        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default DeFiPieChart;
