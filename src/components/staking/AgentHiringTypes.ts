// 合约地址
export const CONTRACT_ADDRESS = '0x90E51BD7e0F5347b07D0e383e739cE5da292d725';
export const USDT_ADDRESS = '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0';

// 合约ABI
export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'agentAddress', type: 'address' },
      { internalType: 'uint256', name: 'duration', type: 'uint256' },
    ],
    name: 'createEngagement',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'agentAddress', type: 'address' },
    ],
    name: 'getAgentDetails',
    outputs: [
      { internalType: 'string', name: 'agentType', type: 'string' },
      { internalType: 'uint256', name: 'ratePerDay', type: 'uint256' },
      { internalType: 'bool', name: 'isActive', type: 'bool' },
      { internalType: 'uint256', name: 'totalEarnings', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'engagementId', type: 'uint256' },
    ],
    name: 'completeEngagement',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// USDT ABI
export const USDT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export interface AgentHiringData {
  amount: string; // 每日费率（ratePerDay）
  duration: string; // 雇佣持续天数
  totalCost: string; // 总费用
  agentType: string; // Agent类型
  currentStep: number;
  totalSteps: number;
}

export interface AgentHiringComponentProps {
  hiringData: AgentHiringData;
  isConnected: boolean | undefined;
  address?: string;
  agentAddress?: string;
  onAction: (action: string, data?: unknown) => void;
}
