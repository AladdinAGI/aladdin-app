// components/staking/StakingStats.tsx
import { HeartIcon, PieChartIcon, BellIcon } from '@radix-ui/react-icons';

export default function StakingStats() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Total Staked</h3>
            <div className="text-2xl font-semibold text-[#1890ff]">
              $5,000.00
            </div>
          </div>
          <div className="bg-[#1890ff]/10 p-2 rounded-lg">
            <BellIcon className="w-6 h-6 text-[#1890ff]" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Across 3 active contracts
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Daily Earnings</h3>
            <div className="text-2xl font-semibold text-[#52c41a]">$2.74</div>
          </div>
          <div className="bg-[#52c41a]/10 p-2 rounded-lg">
            <HeartIcon className="w-6 h-6 text-[#52c41a]" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">+5.2% from last week</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm text-gray-500 mb-2">Average APY</h3>
            <div className="text-2xl font-semibold text-[#722ed1]">5.06%</div>
          </div>
          <div className="bg-[#722ed1]/10 p-2 rounded-lg">
            <PieChartIcon className="w-6 h-6 text-[#722ed1]" />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Weighted average across all pools
        </div>
      </div>
    </div>
  );
}
