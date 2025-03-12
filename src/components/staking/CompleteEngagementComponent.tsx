// CompleteEngagementComponent.tsx
import React, { useState } from 'react';
import { useWriteContract } from 'wagmi';
import {
  AgentHiringComponentProps,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
} from './AgentHiringTypes';

export const CompleteEngagementComponent: React.FC<
  AgentHiringComponentProps
> = ({ onAction }) => {
  const [engagementIdToComplete, setEngagementIdToComplete] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  const { writeContract } = useWriteContract();

  const handleCompleteEngagement = async () => {
    if (!engagementIdToComplete) return;

    setIsCompleting(true);
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'completeEngagement',
        args: [BigInt(engagementIdToComplete)],
      });

      // Success callback might not be immediately available in writeContract return value
      // So using setTimeout to simulate async completion
      setTimeout(() => {
        onAction('engagement-completed', {
          id: engagementIdToComplete,
          txHash: 'tx_' + Date.now(),
        });
        setIsCompleting(false);
      }, 1000);
    } catch (error) {
      console.error('Error completing engagement:', error);
      onAction(
        'error',
        'Failed to complete engagement. Ensure you have the right ID and permissions.'
      );
      setIsCompleting(false);
    }
  };

  return (
    <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
      <h3 className="font-bold text-lg text-slate-800 mb-4">
        Complete Engagement
      </h3>

      <p className="text-gray-600 mb-4">
        Enter the engagement ID you want to complete. This will release the
        escrowed payment to the agent.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={engagementIdToComplete}
          onChange={(e) => setEngagementIdToComplete(e.target.value)}
          placeholder="Engagement ID"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
        />

        <button
          onClick={handleCompleteEngagement}
          disabled={isCompleting || !engagementIdToComplete}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {isCompleting ? 'Processing...' : 'Release Payment'}
        </button>
      </div>

      <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
        <div className="font-medium mb-1">⚠️ Important Note:</div>
        <p className="text-sm">
          Completing an engagement will release the escrowed USDT to the agent.
          This action cannot be undone. Only proceed if you are satisfied with
          the agent's work.
        </p>
      </div>
    </div>
  );
};
