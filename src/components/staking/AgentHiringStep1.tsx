// AgentHiringStep1.tsx
import React, { useState, useEffect } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useConnect, useDisconnect, useReadContract } from 'wagmi';
import { injected } from 'wagmi/connectors';
import {
  AgentHiringComponentProps,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
} from './AgentHiringTypes';

export const AgentHiringStep1: React.FC<AgentHiringComponentProps> = ({
  hiringData,
  isConnected,
  address,
  agentAddress,
  onAction,
}) => {
  // Using wagmi hooks for wallet connection
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isLoadingAgentData, setIsLoadingAgentData] = useState(false);
  const [agentDataError, setAgentDataError] = useState<string | null>(null);
  // Flag to prevent duplicate updates
  const [hasUpdatedAgentData, setHasUpdatedAgentData] =
    useState<boolean>(false);

  // Read agent info
  const {
    data: agentData,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAgentDetails',
    args: agentAddress ? [agentAddress] : undefined,
    query: {
      enabled: Boolean(agentAddress && isConnected),
    },
  });

  // Update loading and error states
  useEffect(() => {
    setIsLoadingAgentData(isLoading);
    if (isError) {
      setAgentDataError(
        'Unable to fetch agent data. Please ensure the agent address is correct.'
      );
      setHasUpdatedAgentData(false); // Reset update flag on error
    } else {
      setAgentDataError(null);
    }
  }, [isLoading, isError]);

  // Handle agent data updates separately
  useEffect(() => {
    if (!agentData || hasUpdatedAgentData) return;

    try {
      const [agentType, ratePerDay, isActive] = agentData as [
        string,
        bigint,
        boolean,
        bigint
      ];

      // Update agent type and daily rate
      if (isActive) {
        onAction('update-agent-type', agentType);

        // Convert bigint to string and update rate
        const rateAsString = (Number(ratePerDay) / 1000000).toString(); // Assuming 6 decimal places
        onAction('update-amount', rateAsString);

        // Update total cost
        const totalCost = (
          Number(rateAsString) * Number(hiringData.duration)
        ).toString();
        onAction('update-total-cost', totalCost);

        // Mark as updated
        setHasUpdatedAgentData(true);
      } else {
        setAgentDataError(
          'This agent is currently inactive and cannot be hired.'
        );
      }
    } catch (error) {
      console.error('Error processing agent data:', error);
      setAgentDataError('Error processing agent data, please try again.');
    }
  }, [agentData, hiringData.duration, onAction, hasUpdatedAgentData]);

  // Reset update flag when duration changes to allow recalculation
  useEffect(() => {
    if (hasUpdatedAgentData) {
      setHasUpdatedAgentData(false);
    }
  }, [hiringData.duration]);

  // Handle wallet connection
  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect();
      console.log('Wallet disconnected');
    } else {
      // This triggers wallet interaction
      connect({ connector: injected() });
      console.log(
        'Attempting to connect wallet, injected connector:',
        injected()
      );
    }
  };

  // Update duration and recalculate total cost
  const handleDurationChange = (newDuration: string) => {
    onAction('update-duration', newDuration);
    const totalCost = (
      parseFloat(hiringData.amount) * parseInt(newDuration, 10)
    ).toString();
    onAction('update-total-cost', totalCost);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-slate-800">
        Agent Hiring Process (Step 1/{hiringData.totalSteps})
      </h3>

      {!isConnected ? (
        <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
          <p className="font-semibold text-blue-800 mb-3">
            Please connect your wallet to continue
          </p>
          <button
            onClick={handleConnectWallet}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <ArrowRightIcon className="w-4 h-4" />
            Connect Wallet
          </button>
        </div>
      ) : (
        <>
          <div className="p-5 rounded-xl bg-green-50 border border-green-100">
            <p className="font-semibold text-green-800 mb-2">
              Wallet Connected Successfully
            </p>
            <div className="bg-white p-2 rounded-lg border border-gray-200 font-mono text-sm text-gray-600 break-all">
              {address}
            </div>
            <button
              onClick={handleConnectWallet}
              className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <ArrowRightIcon className="w-3 h-3" />
              Disconnect
            </button>
          </div>

          <div className="p-5 rounded-xl bg-gray-50 border border-gray-100">
            <h3 className="font-medium text-lg text-gray-900 mb-4">
              Agent Details
            </h3>

            {isLoadingAgentData ? (
              <div className="flex items-center justify-center py-4">
                <svg
                  className="animate-spin h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-2">Loading agent information...</span>
              </div>
            ) : agentDataError ? (
              <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-700 mb-4">
                {agentDataError}
                <button
                  onClick={() => {
                    setHasUpdatedAgentData(false);
                    refetch();
                  }}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-y-3">
                <div className="text-gray-500">Agent Type:</div>
                <div className="font-medium">{hiringData.agentType}</div>

                <div className="text-gray-500">Agent Address:</div>
                <div className="font-medium text-blue-600 font-mono text-sm break-all">
                  {agentAddress}
                </div>

                <div className="text-gray-500">Daily Rate:</div>
                <div className="font-medium text-blue-600">
                  {hiringData.amount} USDT
                </div>

                <div className="text-gray-500">Hiring Duration:</div>
                <div className="font-medium">
                  <input
                    type="number"
                    min="1"
                    value={hiringData.duration}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                  />{' '}
                  days
                </div>

                <div className="text-gray-500">Total Cost:</div>
                <div className="font-medium text-green-600">
                  {hiringData.totalCost} USDT
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-5">
            <button
              onClick={() => onAction('next-step')}
              disabled={!!agentDataError || isLoadingAgentData}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
            >
              Continue to Next Step
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
