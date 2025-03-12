'use client';

import { useState } from 'react';
import {
  EnterIcon,
  GridIcon,
  ListBulletIcon,
  StarFilledIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import { useParams } from 'next/navigation';
import { Locale } from '@/app/i18n/config';

// 多语言支持 - 翻译
const translations = {
  en: {
    search: 'Search AI Agent...',
    popularAgents: 'Popular AI Agents',
    uploadAgent: 'Upload Agent',
    allAgents: 'All AI Agents',
    results: 'results',
    pricePerUse: 'USDT/use',
    viewDetails: 'View Details',
    categories: {
      all: 'All',
      finance: 'Finance',
      development: 'Development',
      data: 'Data',
      content: 'Content',
      legal: 'Legal',
      marketing: 'Marketing',
      research: 'Research',
      healthcare: 'Healthcare',
    },
    reviews: 'reviews',
    abilities: 'Abilities:',
  },
  zh: {
    search: '搜索AI Agent...',
    popularAgents: '热门AI Agent',
    allAgents: '所有AI Agent',
    results: '个结果',
    pricePerUse: 'USDT/次',
    viewDetails: '查看详情',
    uploadAgent: '上传Agent',
    categories: {
      all: '全部',
      finance: '金融',
      development: '开发',
      data: '数据',
      content: '内容',
      legal: '法律',
      marketing: '营销',
      research: '研究',
      healthcare: '医疗',
    },
    reviews: '评价',
    abilities: '能力:',
  },
};

// 模拟的 AI Agent 数据
const agentsData = {
  en: [
    {
      id: 1,
      name: 'FinAnalyst Pro',
      category: 'Finance',
      description:
        'Professional financial analysis assistant providing in-depth market analysis and investment advice',
      imageUrl: '/images/agent-finance.png',
      rating: 4.8,
      reviews: 356,
      price: 0.05,
      tags: ['Data Analysis', 'Market Prediction', 'Portfolio'],
      abilities: [
        'Data Processing',
        'Market Analysis',
        'API Connection',
        'Report Generation',
      ],
      popular: true,
    },
    {
      id: 2,
      name: 'CodeCopilot',
      category: 'Development',
      description:
        'Intelligent programming assistant helping developers write, optimize, and debug code',
      imageUrl: '/images/agent-code.png',
      rating: 4.9,
      reviews: 1024,
      price: 0.08,
      tags: ['Programming', 'Code Review', 'Debugging'],
      abilities: [
        'Code Generation',
        'Refactoring',
        'Performance Optimization',
        'Language Conversion',
      ],
      popular: true,
    },
    {
      id: 3,
      name: 'DataVizard',
      category: 'Data',
      description:
        'Data visualization expert transforming complex data into clear and intuitive charts and reports',
      imageUrl: '/images/agent-data.png',
      rating: 4.6,
      reviews: 218,
      price: 0.04,
      tags: ['Data Visualization', 'Reports', 'Analysis'],
      abilities: [
        'Chart Generation',
        'Data Cleaning',
        'Dynamic Dashboards',
        'Trend Analysis',
      ],
      popular: false,
    },
    {
      id: 4,
      name: 'ContentGenius',
      category: 'Content',
      description:
        'Content creation assistant generating various articles, blogs, and social media content',
      imageUrl: '/images/agent-content.png',
      rating: 4.7,
      reviews: 452,
      price: 0.03,
      tags: ['Writing', 'Editing', 'Content Strategy'],
      abilities: [
        'Article Generation',
        'SEO Optimization',
        'Style Adjustment',
        'Multi-language Support',
      ],
      popular: true,
    },
    {
      id: 5,
      name: 'LegalAssistant',
      category: 'Legal',
      description:
        'Legal document assistant helping draft and review various legal documents',
      imageUrl: '/images/agent-legal.png',
      rating: 4.5,
      reviews: 186,
      price: 0.07,
      tags: ['Legal', 'Contracts', 'Compliance'],
      abilities: [
        'Document Drafting',
        'Regulation Lookup',
        'Risk Assessment',
        'Clause Analysis',
      ],
      popular: false,
    },
    {
      id: 6,
      name: 'MarketingGuru',
      category: 'Marketing',
      description:
        'Marketing expert providing comprehensive marketing strategies and execution advice',
      imageUrl: '/images/agent-marketing.png',
      rating: 4.6,
      reviews: 312,
      price: 0.05,
      tags: ['Marketing', 'Advertising', 'Strategy'],
      abilities: [
        'Strategy Development',
        'Audience Analysis',
        'Campaign Planning',
        'Effectiveness Evaluation',
      ],
      popular: false,
    },
    {
      id: 7,
      name: 'ResearchBot',
      category: 'Research',
      description:
        'Research assistant capable of collecting, organizing, and analyzing various academic and market research data',
      imageUrl: '/images/agent-research.png',
      rating: 4.7,
      reviews: 208,
      price: 0.06,
      tags: ['Research', 'Literature', 'Analysis'],
      abilities: [
        'Information Retrieval',
        'Literature Analysis',
        'Trend Identification',
        'Report Generation',
      ],
      popular: false,
    },
    {
      id: 8,
      name: 'HealthAdvisor',
      category: 'Healthcare',
      description:
        'Health advisor providing health knowledge queries and lifestyle advice',
      imageUrl: '/images/agent-health.png',
      rating: 4.4,
      reviews: 175,
      price: 0.04,
      tags: ['Health', 'Medical', 'Lifestyle'],
      abilities: [
        'Health Assessment',
        'Nutrition Advice',
        'Exercise Plans',
        'Medical Knowledge',
      ],
      popular: false,
    },
  ],
  zh: [
    {
      id: 1,
      name: 'FinAnalyst Pro',
      category: 'Finance',
      description: '专业金融分析助手，提供深度市场分析和投资建议',
      imageUrl: '/images/agent-finance.png',
      rating: 4.8,
      reviews: 356,
      price: 0.05,
      tags: ['数据分析', '市场预测', '投资组合'],
      abilities: ['数据处理', '市场分析', 'API连接', '报告生成'],
      popular: true,
    },
    {
      id: 2,
      name: 'CodeCopilot',
      category: 'Development',
      description: '智能编程助手，帮助开发者编写、优化和调试代码',
      imageUrl: '/images/agent-code.png',
      rating: 4.9,
      reviews: 1024,
      price: 0.08,
      tags: ['编程', '代码审查', '调试'],
      abilities: ['代码生成', '重构建议', '性能优化', '语言转换'],
      popular: true,
    },
    {
      id: 3,
      name: 'DataVizard',
      category: 'Data',
      description: '数据可视化专家，将复杂数据转化为清晰直观的图表和报告',
      imageUrl: '/images/agent-data.png',
      rating: 4.6,
      reviews: 218,
      price: 0.04,
      tags: ['数据可视化', '报告', '分析'],
      abilities: ['图表生成', '数据清洗', '动态仪表盘', '趋势分析'],
      popular: false,
    },
    {
      id: 4,
      name: 'ContentGenius',
      category: 'Content',
      description: '内容创作助手，可以生成各类文章、博客和社交媒体内容',
      imageUrl: '/images/agent-content.png',
      rating: 4.7,
      reviews: 452,
      price: 0.03,
      tags: ['写作', '编辑', '内容策略'],
      abilities: ['文章生成', 'SEO优化', '风格调整', '多语言支持'],
      popular: true,
    },
    {
      id: 5,
      name: 'LegalAssistant',
      category: 'Legal',
      description: '法律文件助手，帮助起草和审查各类法律文档',
      imageUrl: '/images/agent-legal.png',
      rating: 4.5,
      reviews: 186,
      price: 0.07,
      tags: ['法律', '合同', '合规'],
      abilities: ['文档起草', '法规查询', '风险评估', '条款分析'],
      popular: false,
    },
    {
      id: 6,
      name: 'MarketingGuru',
      category: 'Marketing',
      description: '市场营销专家，提供全方位的营销策略和执行建议',
      imageUrl: '/images/agent-marketing.png',
      rating: 4.6,
      reviews: 312,
      price: 0.05,
      tags: ['营销', '广告', '策略'],
      abilities: ['策略制定', '受众分析', '活动规划', '效果评估'],
      popular: false,
    },
    {
      id: 7,
      name: 'ResearchBot',
      category: 'Research',
      description: '研究助手，能够收集、整理和分析各类学术和市场研究数据',
      imageUrl: '/images/agent-research.png',
      rating: 4.7,
      reviews: 208,
      price: 0.06,
      tags: ['研究', '文献', '分析'],
      abilities: ['信息检索', '文献分析', '趋势识别', '报告生成'],
      popular: false,
    },
    {
      id: 8,
      name: 'HealthAdvisor',
      category: 'Healthcare',
      description: '健康顾问，提供健康知识查询和生活方式建议',
      imageUrl: '/images/agent-health.png',
      rating: 4.4,
      reviews: 175,
      price: 0.04,
      tags: ['健康', '医疗', '生活方式'],
      abilities: ['健康评估', '营养建议', '运动计划', '医学知识'],
      popular: false,
    },
  ],
};

export default function AIMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [, setShowUploadModal] = useState(false);
  // 获取当前语言
  const params = useParams();
  const lang = (params?.lang as Locale) || 'en';
  const t = translations[lang];

  // 根据语言获取对应的数据
  const agents = agentsData[lang];

  // 获取分类列表
  const categories = [
    { id: 'all', name: t.categories.all },
    { id: 'Finance', name: t.categories.finance },
    { id: 'Development', name: t.categories.development },
    { id: 'Data', name: t.categories.data },
    { id: 'Content', name: t.categories.content },
    { id: 'Legal', name: t.categories.legal },
    { id: 'Marketing', name: t.categories.marketing },
    { id: 'Research', name: t.categories.research },
    { id: 'Healthcare', name: t.categories.healthcare },
  ];

  // 过滤和搜索逻辑
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      searchQuery === '' ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'all' || agent.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 顶部搜索区域 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnterIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4 self-end">
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
              >
                <UploadIcon className="w-4 h-4 mr-2" />
                {t.uploadAgent}
              </button>
              <div className="hidden sm:flex space-x-2 items-center">
                <button
                  className={`p-1.5 rounded-md ${
                    viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setViewMode('grid')}
                  aria-label="网格视图"
                >
                  <GridIcon className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  className={`p-1.5 rounded-md ${
                    viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setViewMode('list')}
                  aria-label="列表视图"
                >
                  <ListBulletIcon className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>

          {/* 分类导航 */}
          <div className="mt-4 -mb-px flex space-x-6 overflow-x-auto pb-1 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm ${
                  selectedCategory === category.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 热门AI Agent横幅 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t.popularAgents}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents
              .filter((agent) => agent.popular)
              .slice(0, 3)
              .map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="h-16 w-16 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold">
                          {agent.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {agent.name}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {
                              categories.find((c) => c.id === agent.category)
                                ?.name
                            }
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-700 ml-1">
                            {agent.rating}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({agent.reviews} {t.reviews})
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-2">
                        {agent.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-gray-900 font-semibold">
                        {agent.price} {t.pricePerUse}
                      </span>
                      <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        {t.viewDetails}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 所有AI Agent列表 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {t.allAgents}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredAgents.length} {t.results}
            </span>
          </div>

          {/* 网格视图 */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold">
                          {agent.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base font-medium text-gray-900">
                          {agent.name}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          {
                            categories.find((c) => c.id === agent.category)
                              ?.name
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <StarFilledIcon className="h-3.5 w-3.5 text-yellow-400" />
                      <span className="text-sm text-gray-700 ml-1">
                        {agent.rating}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({agent.reviews})
                      </span>
                      <span className="ml-auto text-gray-900 font-medium text-sm">
                        {agent.price} {t.pricePerUse}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {agent.description}
                    </p>
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {agent.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {agent.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{agent.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="mt-3 w-full inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      {t.viewDetails}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 列表视图 */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start">
                      <div className="h-14 w-14 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden relative">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold">
                          {agent.name.charAt(0)}
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {agent.name}
                              </h3>
                              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {
                                  categories.find(
                                    (c) => c.id === agent.category
                                  )?.name
                                }
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                              <span className="text-sm text-gray-700 ml-1">
                                {agent.rating}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">
                                ({agent.reviews} {t.reviews})
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0 flex items-center">
                            <span className="text-lg font-semibold text-gray-900">
                              {agent.price} {t.pricePerUse}
                            </span>
                            <button className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              {t.viewDetails}
                            </button>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {agent.description}
                        </p>
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-2">
                            {agent.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            {t.abilities}
                          </h4>
                          <div className="mt-2 flex flex-wrap gap-3">
                            {agent.abilities.map((ability) => (
                              <div
                                key={ability}
                                className="flex items-center text-sm text-gray-700"
                              >
                                <span className="mr-1 h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                                {ability}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
