import { ArrowRightIcon } from 'lucide-react';

// StakingButton 组件
interface StakingButtonProps {
  onClick: () => void;
  amount: number;
  apy: number;
  riskTolerance: number;
}

export const StakingButton = ({
  onClick,
  amount,
  apy,
  riskTolerance,
}: StakingButtonProps) => {
  return (
    <div className="mt-4 flex flex-col">
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
          <span className="font-semibold text-[#ff7875]">{riskTolerance}%</span>
        </div>
      </div>

      <button
        onClick={onClick}
        className="px-4 py-3 bg-[#1890ff] hover:bg-[#40a9ff] text-white rounded-md transition-colors flex items-center justify-center space-x-2"
      >
        <span>Proceed to Stake Now</span>
        <ArrowRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
};
