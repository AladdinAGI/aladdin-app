import {
  Component1Icon,
  LockClosedIcon,
  ArrowRightIcon,
} from '@radix-ui/react-icons';

export default function AgentContracts() {
  const contracts = [
    {
      agent: 'Stability Agent',
      type: 'USDC Pool',
      apy: '5.2%',
      staked: '$2,000',
      status: 'Active',
      lastInteraction: '2024-02-15',
      icon: Component1Icon,
    },
    {
      agent: 'Yield Agent',
      type: 'USDT Pool',
      apy: '4.8%',
      staked: '$1,500',
      status: 'Active',
      lastInteraction: '2024-02-14',
      icon: LockClosedIcon,
    },
    {
      agent: 'Safety Agent',
      type: 'DAI Pool',
      apy: '5.1%',
      staked: '$1,500',
      status: 'Active',
      lastInteraction: '2024-02-13',
      icon: Component1Icon,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-6">
      <h2 className="text-lg font-medium mb-4">Agent Contracts</h2>
      <div className="space-y-4">
        {contracts.map((contract, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <contract.icon className="w-4 h-4 text-[#1890ff]" />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {contract.agent}
                  </h3>
                  <p className="text-sm text-gray-500">{contract.type}</p>
                </div>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600">
                {contract.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500">APY</div>
                <div className="font-medium text-[#1890ff]">{contract.apy}</div>
              </div>
              <div>
                <div className="text-gray-500">Staked</div>
                <div className="font-medium">{contract.staked}</div>
              </div>
              <div>
                <div className="text-gray-500">Last Interaction</div>
                <div className="font-medium">{contract.lastInteraction}</div>
              </div>
            </div>
            <button className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-[#1890ff] hover:text-[#40a9ff] transition-colors">
              View Details <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
