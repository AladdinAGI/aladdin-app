import React, { useState } from 'react';
import Image from 'next/image';
import { StarFilledIcon, CheckCircledIcon } from '@radix-ui/react-icons';

interface InvestmentOption {
  id: number | string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  price?: number;
  pricePerDay?: number;
  tags?: string[];
  abilities?: string[];
  popular?: boolean;
  estimatedReturn: number;
}

interface TranslationType {
  investmentRecommendation?: string;
  marketplace?: string;
  official?: string;
  selected?: string;
  dailyFee?: string;
  [key: string]: string | undefined;
}

interface InvestmentCardProps {
  targetAPY: number;
  translations?: TranslationType;
  className?: string;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  targetAPY,
  translations,
  className = '',
}) => {
  // 选中状态管理
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Default translations with English fallback
  const t: TranslationType = {
    investmentRecommendation:
      translations?.investmentRecommendation || 'Investment Recommendation',
    marketplace: translations?.marketplace || 'Marketplace Solution',
    official: translations?.official || 'Official Solution',
    selected: translations?.selected || 'Selected',
    dailyFee: translations?.dailyFee || 'Daily Fee',
    ...translations,
  };

  // Marketplace agent details - could be fetched from your agents data
  const marketplaceOption: InvestmentOption = {
    id: 4,
    name: 'StableCoin Yield Optimizer',
    category: 'DeFi',
    description:
      'Advanced DeFi agent that manages stablecoin staking and optimizes yield strategies across multiple protocols',
    imageUrl: '/images/agent-defi.png',
    rating: 4.9,
    reviews: 127,
    price: 0.06,
    pricePerDay: 0.8, // 每天0.8 USDT
    tags: ['Staking', 'Yield Farming', 'Stablecoins', 'DeFi'],
    abilities: [
      'Protocol Integration',
      'Yield Optimization',
      'Risk Assessment',
      'Auto-compounding',
      'Portfolio Management',
    ],
    popular: true,
    estimatedReturn: parseFloat((targetAPY * 1.05).toFixed(1)), // Slightly higher than target
  };

  // Official solution details
  const officialOption: InvestmentOption = {
    id: 'official-1',
    name: 'Managed Stablecoin Portfolio',
    category: 'DeFi',
    description:
      'Our official stablecoin yield solution with managed risk and guaranteed returns',
    imageUrl: '/images/agent-official.png',
    rating: 5.0,
    reviews: 348,
    pricePerDay: 1.0, // 每天1 USDT
    estimatedReturn: targetAPY,
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 my-3 w-full ${className}`}
    >
      <div className="p-4 bg-blue-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {t.investmentRecommendation}
        </h2>
      </div>

      {/* Options - 在任何屏幕宽度下都始终垂直堆叠 */}
      <div className="p-4 grid grid-cols-1 gap-4">
        {/* Marketplace Option */}
        <div
          className={`bg-white rounded-lg shadow-sm overflow-hidden border transition-all duration-200 cursor-pointer
            ${
              selectedOption === 'marketplace'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:shadow-md hover:border-gray-300'
            }`}
          onClick={() => setSelectedOption('marketplace')}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="h-16 w-16 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden relative">
                <Image
                  src={marketplaceOption.imageUrl}
                  alt={marketplaceOption.name}
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/agent-default.png';
                  }}
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {marketplaceOption.name}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {t.marketplace}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-700 ml-1">
                    {marketplaceOption.rating}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({marketplaceOption.reviews} reviews)
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
                  {marketplaceOption.description}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {marketplaceOption.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-between items-center">
              <span className="text-gray-900 font-semibold text-green-600">
                ~{marketplaceOption.estimatedReturn}% APY
              </span>

              {/* 重点标注使用费用 */}
              <div className="bg-blue-50 border border-blue-200 rounded-md py-1 px-2 inline-flex items-center">
                <span className="text-blue-700 font-medium text-sm mr-1">
                  {t.dailyFee}:
                </span>
                <span className="text-blue-800 font-bold">
                  {marketplaceOption.pricePerDay} USDT
                </span>
              </div>

              {selectedOption === 'marketplace' && (
                <div className="flex items-center text-blue-600 mt-2 sm:mt-0">
                  <CheckCircledIcon className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">{t.selected}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Official Option */}
        <div
          className={`bg-white rounded-lg shadow-sm overflow-hidden border transition-all duration-200 cursor-pointer
            ${
              selectedOption === 'official'
                ? 'border-green-500 bg-green-50'
                : 'border-blue-200 hover:shadow-md hover:border-blue-300'
            }`}
          onClick={() => setSelectedOption('official')}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="h-16 w-16 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden relative">
                <Image
                  src={officialOption.imageUrl}
                  alt={officialOption.name}
                  className="w-full h-full object-cover"
                  width={64}
                  height={64}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/agent-default.png';
                  }}
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {officialOption.name}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {t.official}
                  </span>
                </div>
                <div className="flex items-center mt-1">
                  <StarFilledIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-700 ml-1">
                    {officialOption.rating}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({officialOption.reviews} reviews)
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
                  {officialOption.description}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                  Verified
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                  Risk-Managed
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                  Guaranteed Returns
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-between items-center">
              <span className="text-gray-900 font-semibold text-green-600">
                {officialOption.estimatedReturn}% APY Guaranteed
              </span>

              {/* 重点标注使用费用 */}
              <div className="bg-green-50 border border-green-200 rounded-md py-1 px-2 inline-flex items-center">
                <span className="text-green-700 font-medium text-sm mr-1">
                  {t.dailyFee}:
                </span>
                <span className="text-green-800 font-bold">
                  {officialOption.pricePerDay} USDT
                </span>
              </div>

              {selectedOption === 'official' && (
                <div className="flex items-center text-green-600 mt-2 sm:mt-0">
                  <CheckCircledIcon className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">{t.selected}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
