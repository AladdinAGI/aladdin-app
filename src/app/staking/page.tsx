import AgentContracts from '../../components/staking/AgentContracts';
import ApyComparisonChart from '../../components/staking/ApyComparisonChart';
import EarningsChart from '../../components/staking/EarningsChart';
import StakingDistribution from '../../components/staking/StakingDistribution';
import StakingStats from '../../components/staking/StakingStats';

export default function StakingPage() {
  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Overview Cards */}
        <StakingStats />

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6">
          <AgentContracts />
          <StakingDistribution />
        </div>

        {/* Agent Contracts and APY Comparison */}
        <div className="grid grid-cols-2 gap-6">
          <EarningsChart />
          <ApyComparisonChart />
        </div>
      </div>
    </div>
  );
}
