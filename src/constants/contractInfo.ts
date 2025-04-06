import { getAddress } from 'viem';

// 使用 getAddress 函数来确保地址符合 EIP-55 校验和格式
const contractAddress = getAddress(
  '0x90E51BD7e0F5347b07D0e383e739cE5da292d725'
);
const agentAddress = getAddress('0x330136160d2008AbF5c24d0aFda688A1B5C11c53');

// 使用 getAddress 确保地址有正确的校验和
const aavePoolAddress = getAddress(
  '0x87870BCa3F3FD6335C3F4ce8392d69350B4F4e2b'
);
const aavePoolUSCAddress = getAddress(
  '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'
);
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
      defi: 'DeFi',
    },
    reviews: 'reviews',
    abilities: 'Abilities:',
    agentName: 'Agent Name',
    category: 'Category',
    selectCategory: 'Select Category',
    description: 'Description',
    price: 'Price',
    tags: 'Tags',
    commaSeparated: 'Comma Separated',
    upload: 'Upload',
    cancel: 'Cancel',
    walletAddress: 'Wallet Address',
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
      defi: 'DeFi金融',
    },
    reviews: '评价',
    abilities: '能力:',
    agentName: '代理名称',
    category: '类别',
    selectCategory: '选择类别',
    description: '描述',
    price: '价格',
    tags: '标签',
    commaSeparated: '用逗号分隔',
    upload: '上传',
    cancel: '取消',
    walletAddress: '钱包地址',
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
      name: 'TaxGenius',
      category: 'Finance',
      description:
        'Specialized tax planning assistant providing personalized tax optimization strategies and compliance guidance for individuals and businesses',
      imageUrl: '/images/agent-finance.png',
      rating: 4.7,
      reviews: 283,
      price: 0.07,
      tags: ['Tax Planning', 'Financial Optimization', 'Compliance'],
      abilities: [
        'Tax Strategy Creation',
        'Deduction Finder',
        'Regulatory Compliance',
        'Document Preparation',
        'Financial Forecasting',
      ],
      popular: true,
    },
    // {
    //   id: 4,
    //   name: 'StableCoin Yield Optimizer',
    //   category: 'DeFi',
    //   description:
    //     'Advanced DeFi agent that manages stablecoin staking and optimizes yield strategies across multiple protocols',
    //   imageUrl: '/images/agent-defi.png',
    //   rating: 4.9,
    //   reviews: 127,
    //   price: 0.06,
    //   tags: ['Staking', 'Yield Farming', 'Stablecoins', 'DeFi'],
    //   abilities: [
    //     'Protocol Integration',
    //     'Yield Optimization',
    //     'Risk Assessment',
    //     'Auto-compounding',
    //     'Portfolio Management',
    //   ],
    //   popular: true,
    // },
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
  ],
};
export {
  contractAddress,
  aavePoolAddress,
  agentAddress,
  aavePoolUSCAddress,
  translations,
  agentsData,
};
