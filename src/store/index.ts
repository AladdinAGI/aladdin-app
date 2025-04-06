import { atom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';

export const stakingStateAtom = atom<boolean>(true);

// 定义状态接口
interface StakingParams {
  amount: string;
  apy: string;
  riskTolerance: string;
}

// 初始状态，所有数值默认为"0"
const initialStakingState: StakingParams = {
  amount: '0',
  apy: '0',
  riskTolerance: '0',
};

// 使用 immer 创建 atom
export const stakingParamsAtom =
  atomWithImmer<StakingParams>(initialStakingState);
