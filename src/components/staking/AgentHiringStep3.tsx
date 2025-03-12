// AgentHiringStep3.tsx - Fixed version
import React, { useState, useEffect, useRef } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { AgentHiringComponentProps } from './AgentHiringTypes';

export const AgentHiringStep3: React.FC<AgentHiringComponentProps> = ({
  hiringData,
  onAction,
}) => {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [engagementId, setEngagementId] = useState<string | null>(null);

  // Use refs instead of state to avoid re-renders
  const initializedRef = useRef<boolean>(false);
  const completedRef = useRef<boolean>(false);

  // Initialize - only run once
  useEffect(() => {
    // Only execute on first mount
    if (!initializedRef.current) {
      console.log('AgentHiringStep3 - Initializing');

      const storedTxHash = window.localStorage.getItem(
        'latestEngagementTxHash'
      );
      if (storedTxHash) {
        setTxHash(storedTxHash);
      }

      const storedEngagementId =
        window.localStorage.getItem('latestEngagementId');
      if (storedEngagementId) {
        setEngagementId(storedEngagementId);
      }

      // Mark as initialized
      initializedRef.current = true;
    }
  }, []); // Empty dependency array ensures it runs only once

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Only clean up localStorage if we completed the process
      if (completedRef.current) {
        console.log('AgentHiringStep3 - Unmounting, cleaning up localStorage');
        window.localStorage.removeItem('latestEngagementTxHash');
        window.localStorage.removeItem('latestEngagementId');
      }
    };
  }, []);

  // Handle complete button click
  const handleComplete = () => {
    if (completedRef.current) {
      console.log('Already completed, ignoring duplicate click');
      return; // Prevent duplicate triggers
    }

    console.log('AgentHiringStep3 - Completing operation');
    completedRef.current = true; // Set ref flag instead of state

    // Notify parent component that process is complete
    onAction('complete');
  };

  // For debugging in development
  console.log(
    `AgentHiringStep3 rendering - txHash: ${txHash}, engagementId: ${engagementId}`
  );

  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
        <CheckIcon className="w-8 h-8 text-green-600" />
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Hiring Created Successfully!
      </h3>

      <p className="text-gray-600 mb-4">
        You have successfully hired a <strong>{hiringData.agentType}</strong>{' '}
        agent for a period of <strong>{hiringData.duration} days</strong>. The
        agent will begin working immediately. Your{' '}
        <strong>{hiringData.totalCost} USDT</strong> has been held in escrow by
        the contract.
      </p>

      {engagementId && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 font-mono text-sm text-blue-800 mb-5">
          Engagement ID: {engagementId}
        </div>
      )}

      {txHash && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-5">
          <div className="font-medium text-gray-700 mb-1">
            Transaction Hash:
          </div>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-blue-800 break-all hover:underline"
          >
            {txHash}
          </a>
          <div className="mt-3">
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            >
              View on Etherscan
            </a>
          </div>
        </div>
      )}

      <button
        onClick={handleComplete}
        disabled={completedRef.current}
        className={`${
          completedRef.current ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        } text-white px-6 py-2.5 rounded-lg font-medium transition-colors`}
      >
        {completedRef.current ? 'Processing...' : 'Complete'}
      </button>
    </div>
  );
};
