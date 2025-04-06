'use client';

import { useState } from 'react';
import MergedAgentHiring from '@/components/staking/MergedAgentHiring';
import AaveStaking from '@/components/staking/AaveStaking';
import { useAtom } from 'jotai';
import { stakingStateAtom } from '@/store';
import { agentAddress } from '@/constants/contractInfo';
import AlertDialogComponent from '../ui/AlertDialog';
import StakingOptionsTable from '../staking/StakingOptionsTable';

export default function ContractPanel() {
  const [currentStep, setCurrentStep] = useState(1);
  const [depositComplete, setDepositComplete] = useState(false);
  const [showAgentHiring, setShowAgentHiring] = useState(false);
  const [showAaveStaking, setShowAaveStaking] = useState(true);
  const [, setStakingState] = useAtom(stakingStateAtom);

  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    type: 'info' as 'info' | 'error' | 'warning' | 'success',
    title: '',
    message: '',
  });

  const handleDepositClick = () => {
    setShowAaveStaking(true);
    setShowAgentHiring(false);
    setCurrentStep(1);
  };

  const handleAaveStakingComplete = () => {
    setDepositComplete(true);
    setCurrentStep(2);
    setShowAaveStaking(false);
    setShowAgentHiring(true);
  };

  const handleAgentHiringComplete = () => {
    setShowAgentHiring(false);
    setAlertDialog({
      isOpen: true,
      type: 'success',
      title: 'Process Complete',
      message:
        'You have successfully completed the staking and agent hiring process!',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 relative h-[90vh] overflow-y-scroll scrollbar-stable">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Staking Process
      </h2>
      <StakingOptionsTable />
      <div className="mb-6 sticky top-0 bg-white pt-2 pb-4 z-10">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 1
                ? 'bg-blue-500 text-white'
                : depositComplete
                ? 'bg-green-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            1
          </div>
          <div
            className={`h-1 flex-1 mx-2 ${
              depositComplete ? 'bg-green-500' : 'bg-gray-200'
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            2
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <button
            className="text-xs font-medium text-gray-600 cursor-pointer hover:text-blue-600 px-4 py-2 bg-transparent border-none focus:outline-none"
            onClick={handleDepositClick}
          >
            Deposit Funds
          </button>
          <div className="text-xs font-medium text-gray-600 px-4 py-2">
            Sign Contract
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {showAaveStaking && currentStep === 1 && (
          <AaveStaking onComplete={handleAaveStakingComplete} />
        )}
        {showAgentHiring && currentStep === 2 && (
          <MergedAgentHiring
            agentAddress={agentAddress}
            onComplete={handleAgentHiringComplete}
          />
        )}
      </div>

      <div className="fixed top-20 left-10 w-20 h-20 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 rounded-full bg-purple-500/20 blur-xl animate-pulse"></div>
      <div className="fixed top-1/3 right-1/4 w-16 h-16 rounded-full bg-pink-500/20 blur-xl animate-pulse"></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/5 animate-ping opacity-20 -z-50"
        style={{ animationDelay: '0.5s' }}
      ></div>

      <AlertDialogComponent
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        confirmText="OK"
        showCancel={false}
        onConfirm={() => {
          setStakingState(false);
        }}
      />
    </div>
  );
}
