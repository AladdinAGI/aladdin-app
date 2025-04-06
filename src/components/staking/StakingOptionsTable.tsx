import React, { useState } from 'react';

const StakingOptionsTable = () => {
  // Default select Aave V3
  const [selectedPlatform] = useState('Aave V3');

  // All available platform data
  const stakingOptions = [
    // OnChain Pools
    {
      type: 'OnChain',
      platform: 'Aave V3',
      apy: '3.80%',
      allocation: '40%',
      amount: '40 USDT',
      risks: ['Smart Contract Risk', 'Interest Rate Risk'],
    },
    {
      type: 'OnChain',
      platform: 'Compound V3',
      apy: '3.50%',
      allocation: '30%',
      amount: '30 USDT',
      risks: ['Smart Contract Risk', 'Interest Rate Risk'],
    },
    {
      type: 'OnChain',
      platform: 'Yearn Finance',
      apy: '7.20%',
      allocation: '30%',
      amount: '30 USDT',
      risks: ['Smart Contract Risk', 'Strategy Risk', 'Complex Dependencies'],
    },
    // DEX Platforms
    {
      type: 'DEX',
      platform: 'Uniswap V3',
      apy: '5.20%',
      allocation: '0%',
      amount: '0 USDT',
      risks: ['Smart Contract Risk', 'Impermanent Loss'],
    },
    {
      type: 'DEX',
      platform: 'Curve Finance',
      apy: '4.80%',
      allocation: '0%',
      amount: '0 USDT',
      risks: ['Smart Contract Risk', 'Pool Imbalance Risk'],
    },
    {
      type: 'DEX',
      platform: 'Balancer',
      apy: '4.50%',
      allocation: '0%',
      amount: '0 USDT',
      risks: ['Smart Contract Risk', 'Impermanent Loss'],
    },
  ];

  // Group by type
  const onChainOptions = stakingOptions.filter(
    (option) => option.type === 'OnChain'
  );
  const dexOptions = stakingOptions.filter((option) => option.type === 'DEX');

  // Calculate total expected APY
  const calculateTotalAPY = () => {
    let weightedAPY = 0;
    stakingOptions.forEach((option) => {
      const allocPercent = parseFloat(option.allocation) / 100;
      const apyValue = parseFloat(option.apy);
      weightedAPY += allocPercent * apyValue;
    });
    return weightedAPY.toFixed(2) + '%';
  };

  return (
    <div className="p-4">
      {/* Smart Position Info Component */}
      <div className="w-[100%] mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md p-3 text-white mb-4">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-white bg-opacity-20 p-1">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04c-.178.018-.35.038-.523.059C1.3 10.678 1 13.299 1 17c0 5 3.9 6 6 6h10c2.1 0 6-1 6-6 0-3.701-.3-6.322-.859-8.957a8.738 8.738 0 01-.523-.059"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-sm">
              Intelligent Position Management
            </h4>
            <p className="text-xs text-white text-opacity-90">
              Your positions are automatically managed by our AI agents. When
              market risks are detected, assets will be redeemed and reinvested
              automatically until your target KPI is achieved—all without
              requiring your intervention.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* OnChain Pools Section */}
        <div className="mb-4">
          <h3 className="px-6 py-3 bg-gray-50 text-sm font-medium text-gray-700">
            OnChain Pools
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Platform
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  APY
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Allocation
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Risks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {onChainOptions.map((option, index) => (
                <tr
                  key={index}
                  className={
                    option.platform === selectedPlatform ? 'bg-blue-50' : ''
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {option.platform}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      parseFloat(option.apy) >= 5
                        ? 'text-green-600 font-bold'
                        : 'text-gray-500'
                    }`}
                  >
                    {option.apy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {option.allocation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {option.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <ul className="list-disc pl-4">
                      {option.risks.map((risk, riskIndex) => (
                        <li key={riskIndex}>{risk}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DEX Platforms Section */}
        <div>
          <h3 className="px-6 py-3 bg-gray-50 text-sm font-medium text-gray-700">
            DEX Platforms
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Platform
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  APY
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Allocation
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Risks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dexOptions.map((option, index) => (
                <tr
                  key={index}
                  className={
                    option.platform === selectedPlatform ? 'bg-blue-50' : ''
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {option.platform}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      parseFloat(option.apy) >= 5
                        ? 'text-green-600 font-bold'
                        : 'text-gray-500'
                    }`}
                  >
                    {option.apy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {option.allocation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {option.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <ul className="list-disc pl-4">
                      {option.risks.map((risk, riskIndex) => (
                        <li key={riskIndex}>{risk}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t">
          <div className="w-full bg-blue-50 p-3 rounded-md">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-blue-100 p-1">
                <svg
                  className="h-4 w-4 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600">
                  Target: 5% return | Risk Tolerance: 15% | Expected APY:{' '}
                  {calculateTotalAPY()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingOptionsTable;
