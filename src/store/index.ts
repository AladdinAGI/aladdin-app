import { atom } from 'jotai';

interface StakingOption {
  platform: string;
  apy: number;
  tvl?: number;
  minAmount?: number;
  lockPeriod?: string;
  tags: string[];
  risks: string[];
}

export interface StakingCommandResponse {
  type: string; // "standard" or "professional" or "error"
  amount: number; // User's staking amount
  targetAPY: number; // User's requested APY
  riskTolerance: number; // User's acceptable risk percentage
  options?: StakingOption[]; // Only for standard staking (APY ≤ 10%)
  message: string; // Response message to display
}
// Create jotai atoms for state management
export const stakingDataAtom = atom<StakingCommandResponse | null>(null);
export const showStakingModalAtom = atom<boolean>(false);
