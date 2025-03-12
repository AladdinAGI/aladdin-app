'use client';
import React, { useRef, useState, useEffect } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';
import CryptoTickerFooter from '@/components/common/CryptoTickerFooter';
import { Locale } from '@/app/i18n/config';

// Define TypeScript interfaces
interface AssetDistributionItem {
  name: string;
  value: number;
  itemStyle: {
    color: string;
  };
}

interface SeriesItem {
  name: string;
  data: number[];
  type: string;
  smooth: boolean;
  lineStyle: {
    width: number;
    type?: string;
  };
  itemStyle: {
    color: string;
  };
}

interface MonthlyReturnsData {
  months: string[];
  series: SeriesItem[];
}

interface PerformanceItem {
  name: string;
  current: number;
  target: number;
  difference: number;
  color: string;
}

interface AverageReturnItem {
  name: string;
  value: number;
  itemStyle: {
    color: string;
  };
}

interface DashboardClientProps {
  lang: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dictionary: any;
}

export default function DashboardClient({
  lang,
  dictionary,
}: DashboardClientProps) {
  return (
    <>
      <div className="min-h-screen bg-[#f0f2f5]">
        <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* Professional Agents Distribution Component */}
          <div className="bg-white rounded-lg shadow p-4">
            <ProfessionalAgentsDistribution
              lang={lang}
              dictionary={dictionary}
            />
          </div>
        </div>
      </div>
      <CryptoTickerFooter />
    </>
  );
}

interface ProfessionalAgentsDistributionProps {
  lang: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dictionary: any;
}

const ProfessionalAgentsDistribution: React.FC<
  ProfessionalAgentsDistributionProps
> = ({ lang, dictionary }) => {
  // Chart container refs
  const pie3DChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const lineChartRef = useRef<HTMLDivElement>(null);

  // Chart instances
  const [pie3DChart, setPie3DChart] = useState<echarts.ECharts | null>(null);
  const [barChart, setBarChart] = useState<echarts.ECharts | null>(null);
  const [lineChart, setLineChart] = useState<echarts.ECharts | null>(null);

  // Translation shorthand
  const t = dictionary.dashboard;

  // Color palette
  const colors = React.useMemo(
    () => ({
      primaryMarket: '#1890ff',
      secondaryMarket: '#52c41a',
      cashFuturesArbitrage: '#722ed1',
      derivatives: '#faad14',
      otherStrategies: '#f5222d',
    }),
    []
  );

  // Data based on current language
  const getAssetDistributionData = React.useCallback(
    (): AssetDistributionItem[] => [
      {
        name: t.primaryMarket,
        value: 35,
        itemStyle: { color: colors.primaryMarket },
      },
      {
        name: t.secondaryMarket,
        value: 25,
        itemStyle: { color: colors.secondaryMarket },
      },
      {
        name: t.cashFuturesArbitrage,
        value: 20,
        itemStyle: { color: colors.cashFuturesArbitrage },
      },
      {
        name: t.derivatives,
        value: 15,
        itemStyle: { color: colors.derivatives },
      },
      {
        name: t.otherStrategies,
        value: 5,
        itemStyle: { color: colors.otherStrategies },
      },
    ],
    [t, colors]
  );

  const getMonthlyReturnsData = React.useCallback((): MonthlyReturnsData => {
    const months =
      lang === 'en'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        : ['1月', '2月', '3月', '4月', '5月', '6月'];

    const primaryMarketData = [5.2, 4.8, 6.1, 5.7, 7.2, 6.8];
    const secondaryMarketData = [3.8, 2.7, 4.2, 3.9, 4.5, 5.3];
    const arbitrageData = [2.9, 3.5, 2.8, 3.6, 4.1, 3.8];
    const derivativesData = [7.1, 6.3, 5.9, 6.7, 8.2, 7.5];
    const averageData = [4.8, 4.3, 4.8, 5.0, 6.0, 5.9];

    return {
      months,
      series: [
        {
          name: t.primaryMarket,
          data: primaryMarketData,
          type: 'line',
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: colors.primaryMarket },
        },
        {
          name: t.secondaryMarket,
          data: secondaryMarketData,
          type: 'line',
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: colors.secondaryMarket },
        },
        {
          name: t.cashFuturesArbitrage,
          data: arbitrageData,
          type: 'line',
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: colors.cashFuturesArbitrage },
        },
        {
          name: t.derivatives,
          data: derivativesData,
          type: 'line',
          smooth: true,
          lineStyle: { width: 3 },
          itemStyle: { color: colors.derivatives },
        },
        {
          name: t.average,
          data: averageData,
          type: 'line',
          smooth: true,
          lineStyle: { width: 3, type: 'dashed' },
          itemStyle: { color: '#333333' },
        },
      ],
    };
  }, [
    colors.cashFuturesArbitrage,
    colors.derivatives,
    colors.primaryMarket,
    colors.secondaryMarket,
    lang,
    t.average,
    t.cashFuturesArbitrage,
    t.derivatives,
    t.primaryMarket,
    t.secondaryMarket,
  ]);

  const getPerformanceData = (): PerformanceItem[] => [
    {
      name: t.primaryMarket,
      current: 35.6,
      target: 30,
      difference: 5.6,
      color: colors.primaryMarket,
    },
    {
      name: t.secondaryMarket,
      current: 24.3,
      target: 25,
      difference: -0.7,
      color: colors.secondaryMarket,
    },
    {
      name: t.cashFuturesArbitrage,
      current: 21.2,
      target: 20,
      difference: 1.2,
      color: colors.cashFuturesArbitrage,
    },
    {
      name: t.derivatives,
      current: 16.8,
      target: 15,
      difference: 1.8,
      color: colors.derivatives,
    },
    {
      name: t.otherStrategies,
      current: 4.1,
      target: 10,
      difference: -5.9,
      color: colors.otherStrategies,
    },
  ];

  // Calculate average returns for bar chart
  const getAverageReturnsData = React.useCallback((): AverageReturnItem[] => {
    const { series } = getMonthlyReturnsData();
    const averages = series.slice(0, 4).map((strategy) => {
      const avg =
        strategy.data.reduce((sum, val) => sum + val, 0) / strategy.data.length;
      return {
        name: strategy.name,
        value: parseFloat(avg.toFixed(1)),
        itemStyle: { color: strategy.itemStyle.color },
      };
    });

    // Sort by value descending
    return averages.sort((a, b) => b.value - a.value);
  }, [getMonthlyReturnsData]);

  // Initialize charts
  useEffect(() => {
    // Initialize 3D Pie Chart
    if (pie3DChartRef.current && !pie3DChart) {
      const chart = echarts.init(pie3DChartRef.current);
      setPie3DChart(chart);
    }

    // Initialize Bar Chart
    if (barChartRef.current && !barChart) {
      const chart = echarts.init(barChartRef.current);
      setBarChart(chart);
    }

    // Initialize Line Chart
    if (lineChartRef.current && !lineChart) {
      const chart = echarts.init(lineChartRef.current);
      setLineChart(chart);
    }

    // Clean up
    return () => {
      if (pie3DChart) {
        pie3DChart.dispose();
      }
      if (barChart) {
        barChart.dispose();
      }
      if (lineChart) {
        lineChart.dispose();
      }
    };
  }, [pie3DChart, barChart, lineChart]);

  // Update charts on language change or resize
  useEffect(() => {
    const updateCharts = () => {
      if (pie3DChart) {
        // 3D Pie Chart
        const pieOption: echarts.EChartsOption = {
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              // 安全处理传入的参数
              if (
                typeof params === 'object' &&
                params !== null &&
                'name' in params &&
                'value' in params &&
                'percent' in params
              ) {
                const name = String(params.name);
                const value = Number(params.value);
                const percent = Number(params.percent);
                return `${t.assetDistribution}<br/>${name}: ${value} (${percent}%)`;
              }
              return '';
            },
          },
          legend: {
            orient: 'vertical',
            right: '5%',
            top: 'center',
          },
          series: [
            {
              name: t.assetDistribution,
              type: 'pie',
              radius: ['35%', '70%'],
              center: ['40%', '50%'],
              roseType: 'radius',
              itemStyle: {
                borderRadius: 8,
                borderColor: '#fff',
                borderWidth: 2,
              },
              label: {
                formatter: '{b}: {d}%',
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
              data: getAssetDistributionData(),
            },
          ],
        };
        pie3DChart.setOption(pieOption);
      }

      if (barChart) {
        // Bar Chart
        const averages = getAverageReturnsData();
        const barOption: echarts.EChartsOption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params) => {
              // 处理数组或单个对象
              if (Array.isArray(params) && params.length > 0) {
                const param = params[0];
                if ('name' in param && 'value' in param) {
                  return `${String(param.name)}: ${Number(param.value)}%`;
                }
              }
              return '';
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'value',
            axisLabel: {
              formatter: (value) => `${value}%`,
            },
          },
          yAxis: {
            type: 'category',
            data: averages.map((item) => item.name),
            axisLabel: {
              formatter: (value) => {
                // Shorten long strategy names if needed
                return typeof value === 'string' && value.length > 12
                  ? value.substring(0, 10) + '...'
                  : value;
              },
            },
          },
          series: [
            {
              name: t.averageReturns,
              type: 'bar',
              data: averages,
              barWidth: '60%',
              itemStyle: {
                borderRadius: [0, 4, 4, 0],
              },
              label: {
                show: true,
                position: 'right',
                formatter: (params) => {
                  if (
                    typeof params === 'object' &&
                    params !== null &&
                    'value' in params
                  ) {
                    return `${params.value}%`;
                  }
                  return '';
                },
              },
            },
          ],
        };
        barChart.setOption(barOption);
      }

      if (lineChart) {
        // Line Chart for monthly trends
        const { months, series } = getMonthlyReturnsData();
        const lineOption: echarts.EChartsOption = {
          tooltip: {
            trigger: 'axis',
            formatter: (params) => {
              if (Array.isArray(params) && params.length > 0) {
                let result = '';
                if ('name' in params[0]) {
                  result = `${params[0].name}<br/>`;
                }

                params.forEach((param) => {
                  if ('seriesName' in param && 'value' in param) {
                    result += `${param.seriesName}: ${param.value}%<br/>`;
                  }
                });
                return result;
              }
              return '';
            },
          },
          legend: {
            data: series.map((item) => item.name),
            textStyle: {
              fontSize: 11,
            },
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: months,
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: (value) => `${value}%`,
            },
          },
          series: series.map((item) => ({
            ...item,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              ...item.lineStyle,
              width: 4,
            },
          })),
        };
        lineChart.setOption(lineOption);
      }
    };

    if (pie3DChart && barChart && lineChart) {
      updateCharts();
    }

    // Handle window resize
    const handleResize = () => {
      if (pie3DChart) pie3DChart.resize();
      if (barChart) barChart.resize();
      if (lineChart) lineChart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [
    pie3DChart,
    barChart,
    lineChart,
    lang,
    t,
    getAssetDistributionData,
    getAverageReturnsData,
    getMonthlyReturnsData,
  ]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Left column */}
        <div>
          {/* 3D Pie Chart */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              {t.assetDistribution}
            </h3>
            <div className="h-96 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
              <div
                ref={pie3DChartRef}
                style={{ width: '100%', height: '100%' }}
                className="transition-all duration-300"
              />
            </div>
          </div>

          {/* Performance vs Target */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              {t.targetAchievement}
            </h3>
            <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left text-sm font-medium text-gray-700">
                      {t.strategyName}
                    </th>
                    <th className="p-2 text-right text-sm font-medium text-gray-700">
                      {t.targetAllocation}
                    </th>
                    <th className="p-2 text-right text-sm font-medium text-gray-700">
                      {t.actualAllocation}
                    </th>
                    <th className="p-2 text-right text-sm font-medium text-gray-700">
                      {t.deviation}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getPerformanceData().map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="p-2 text-sm font-medium">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: item.color }}
                          />
                          {item.name}
                        </div>
                      </td>
                      <td className="p-2 text-right text-sm">{item.target}%</td>
                      <td className="p-2 text-right text-sm">
                        {item.current.toFixed(1)}%
                      </td>
                      <td className="p-2 text-right text-sm">
                        <span
                          className={
                            item.difference >= 0
                              ? 'text-green-600 flex items-center justify-end'
                              : 'text-red-600 flex items-center justify-end'
                          }
                        >
                          {item.difference >= 0 ? '▲' : '▼'}
                          {Math.abs(item.difference).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Bar Chart */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              {t.averageReturns}
            </h3>
            <div className="h-80 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
              <div
                ref={barChartRef}
                style={{ width: '100%', height: '100%' }}
                className="transition-all duration-300"
              />
            </div>
          </div>

          {/* Line Chart */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              {t.monthlyTrends}
            </h3>
            <div className="h-80 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
              <div
                ref={lineChartRef}
                style={{ width: '100%', height: '100%' }}
                className="transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
