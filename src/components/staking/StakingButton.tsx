import { ArrowRightIcon } from 'lucide-react';
import React from 'react';
import InvestmentCard from './InvestmentCard';

// StakingButton 组件
interface StakingButtonProps {
  onClick: () => void;
  amount: number;
  apy: number;
  riskTolerance: number;
  showInvestmentCard?: boolean; // 是否显示投资卡片
  className?: string; // 允许添加额外的类名
  translations?: {
    investmentRecommendation?: string;
    marketplace?: string;
    official?: string;
    selected?: string;
    dailyFee?: string;
    [key: string]: string | undefined;
  };
}

export const StakingButton = ({
  onClick,
  amount,
  apy,
  riskTolerance,
  showInvestmentCard = true, // 默认显示
  className = '',
  translations,
}: StakingButtonProps) => {
  return (
    <div className={`flex flex-col w-full max-w-6xl mx-auto ${className}`}>
      {/* StakingButton 本身的 UI */}
      <div className="mt-4 flex flex-col w-full">
        <div className="bg-[#f0f7ff] border border-[#d9e8ff] rounded-lg p-3 mb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="font-semibold">{amount} USDT</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Target APY:</span>
            <span className="font-semibold text-[#1890ff]">{apy}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Risk Tolerance:</span>
            <span className="font-semibold text-[#ff7875]">
              {riskTolerance}%
            </span>
          </div>
        </div>

        {/* 如果需要显示投资卡片，则渲染 InvestmentCard */}
        {showInvestmentCard && (
          <div className="w-full">
            <InvestmentCard
              targetAPY={apy}
              translations={translations}
              className="mb-4"
            />
          </div>
        )}

        <button
          onClick={onClick}
          className="px-4 py-3 bg-[#1890ff] hover:bg-[#40a9ff] text-white rounded-md transition-colors flex items-center justify-center space-x-2"
        >
          <span>Proceed to Stake Now</span>
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
