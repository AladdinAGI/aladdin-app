// MergedAgentHiring.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from '@radix-ui/react-icons';
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseUnits, formatUnits } from 'viem';

import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  USDT_ABI,
  USDT_ADDRESS,
} from './AgentHiringTypes';
import AlertDialogComponent from '../ui/AlertDialog';

interface MergedAgentHiringProps {
  agentAddress?: string;
  onComplete?: () => void;
}

interface AgentMetadata {
  agentType: string;
  amount: string;
  duration: string;
  totalCost: string;
}

export const MergedAgentHiring: React.FC<MergedAgentHiringProps> = ({
  agentAddress,
  onComplete,
}) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processComplete, setProcessComplete] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [engagementId, setEngagementId] = useState<string | null>(null);
  const [agentDataError, setAgentDataError] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<string>('0');
  const [agentMetadata, setAgentMetadata] = useState<AgentMetadata>({
    agentType: '',
    amount: '1', // 固定每天1 USDT
    duration: '30',
    totalCost: '30', // 默认30天
  });

  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'error' | 'warning' | 'success',
    confirmText: 'OK',
    cancelText: 'Cancel',
    onConfirm: () => {},
    onCancel: () => {},
    showCancel: false,
  });

  const isOnSepolia = chainId === 11155111;

  const {
    data: agentData,
    isLoading: isLoadingAgentData,
    isError: isAgentDataError,
    refetch: refetchAgentData,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAgentDetails',
    args: agentAddress ? [agentAddress] : undefined,
    query: {
      enabled: Boolean(agentAddress && isConnected),
    },
  });

  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESS] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  const {
    data: approveHash,
    isPending: isApproving,
    writeContract: approveUSDT,
  } = useWriteContract();

  const { data: createEngagementHash, writeContract: createEngagement } =
    useWriteContract();

  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  const { isSuccess: isCreateSuccess } = useWaitForTransactionReceipt({
    hash: createEngagementHash,
  });

  const clearProcessingState = () => {
    setIsProcessing(false);
  };

  const processHiringAfterApproval = useCallback(() => {
    try {
      if (!agentAddress || !address) return;
      createEngagement({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'createEngagement',
        args: [agentAddress, BigInt(agentMetadata.duration)],
      });
    } catch (error) {
      console.error('Error creating engagement:', error);
      setTxError((error as Error)?.message || 'Failed to create engagement');
      setIsProcessing(false);
    }
  }, [agentAddress, address, agentMetadata.duration, createEngagement]);

  useEffect(() => {
    if (agentData && !isAgentDataError) {
      try {
        const [agentType, , isActive] = agentData as [string, bigint, boolean];
        if (isActive) {
          const dailyRate = 1; // 固定每天1 USDT
          const totalCost = (
            dailyRate * Number(agentMetadata.duration)
          ).toFixed(0);
          setAgentMetadata((prev) => ({
            ...prev,
            agentType,
            amount: dailyRate.toString(),
            totalCost,
          }));
          setAgentDataError(null);
        } else {
          setAgentDataError(
            'This agent is currently inactive and cannot be hired.'
          );
        }
      } catch (error) {
        console.error('Error processing agent data:', error);
        setAgentDataError('Error processing agent data, please try again.');
      }
    } else if (isAgentDataError) {
      setAgentDataError(
        'Unable to fetch agent data. Please ensure the agent address is correct.'
      );
    }
  }, [agentData, isAgentDataError, agentMetadata.duration]);

  useEffect(() => {
    if (balanceData) {
      setUsdtBalance(formatUnits(balanceData as bigint, 6));
    }
  }, [balanceData]);

  useEffect(() => {
    if (isApproveSuccess) {
      console.log('USDT approval successful, checking updated allowance');
      setTimeout(() => {
        refetchAllowance();
        processHiringAfterApproval();
      }, 2000);
    }
  }, [isApproveSuccess, processHiringAfterApproval, refetchAllowance]);

  useEffect(() => {
    if (isCreateSuccess && createEngagementHash) {
      console.log('Engagement created successfully:', createEngagementHash);
      const mockEngagementId = `ENG-${Math.floor(Math.random() * 1000000)}`;
      setTxHash(createEngagementHash);
      setEngagementId(mockEngagementId);
      setIsProcessing(false);
      setProcessComplete(true);
    }
  }, [isCreateSuccess, createEngagementHash]);

  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect();
      console.log('Wallet disconnected');
    } else {
      connect({ connector: injected() });
      console.log('Attempting to connect wallet');
    }
  };

  const handleDurationChange = (newDuration: string) => {
    const duration = newDuration || '30';
    const dailyRate = 1; // 固定每天1 USDT
    const totalCost = (dailyRate * parseInt(duration, 10)).toFixed(0);
    setAgentMetadata((prev) => ({
      ...prev,
      duration,
      totalCost,
    }));
  };

  const switchToSepolia = async () => {
    try {
      if (window.ethereum) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (window.ethereum as any).request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  const hasEnoughUSDT =
    parseFloat(usdtBalance) >= parseFloat(agentMetadata.totalCost);

  const isUsdtApproved = (): boolean => {
    if (!allowanceData || !agentMetadata.totalCost) return false;
    try {
      const totalCostWei = parseUnits(agentMetadata.totalCost, 6);
      return (allowanceData as bigint) >= totalCostWei;
    } catch (error) {
      console.error('Error checking allowance:', error);
      return false;
    }
  };

  const handleApproveUSDT = () => {
    setTxError(null);
    setIsProcessing(true);
    try {
      if (!address) return;
      const totalCostWei = parseUnits(agentMetadata.totalCost, 6);
      approveUSDT({
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, totalCostWei],
      });
    } catch (error) {
      console.error('Error approving USDT:', error);
      setTxError((error as Error)?.message || 'Failed to approve USDT');
      setIsProcessing(false);
    }
  };

  const handleHireAgent = () => {
    if (isProcessing) return;
    setTxError(null);
    setIsProcessing(true);
    setAlertDialog({
      isOpen: true,
      title: 'Confirm Agent Hiring',
      message: `Are you sure you want to hire this agent for ${agentMetadata.duration} days at a fixed rate of 1 USDT per day (total: ${agentMetadata.totalCost} USDT)?`,
      type: 'info',
      showCancel: true,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      onConfirm: () => {
        if (isUsdtApproved()) {
          processHiringAfterApproval();
        } else {
          handleApproveUSDT();
        }
      },
      onCancel: clearProcessingState,
    });
  };

  const handleReset = () => {
    setProcessComplete(false);
    setTxHash(null);
    setEngagementId(null);
    setTxError(null);
    if (onComplete) {
      onComplete();
    }
  };

  if (isConnected && !isOnSepolia) {
    return (
      <div className="p-5 rounded-xl bg-red-50 border border-red-100">
        <p className="font-semibold text-red-800 mb-3">
          Please switch to Sepolia testnet to continue
        </p>
        <p className="text-sm text-red-700 mb-4">
          This smart contract is deployed on the Sepolia testnet. Please switch
          networks in your wallet.
        </p>
        <button
          onClick={switchToSepolia}
          className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Switch to Sepolia
        </button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
        <p className="font-semibold text-blue-800 mb-3">
          Please connect your wallet to hire an agent
        </p>
        <button
          onClick={handleConnectWallet}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <ArrowRightIcon className="w-4 h-4" />
          Connect Wallet
        </button>
      </div>
    );
  }

  if (processComplete) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
          <CheckIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Hiring Created Successfully!
        </h3>
        <p className="text-gray-600 mb-4">
          You have successfully hired a{' '}
          <strong>{agentMetadata.agentType}</strong> agent for a period of{' '}
          <strong>{agentMetadata.duration} days</strong>. The agent will begin
          working immediately. Your{' '}
          <strong>{agentMetadata.totalCost} USDT</strong> has been held in
          escrow by the contract.
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
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Complete Process
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[70vh] pr-1">
      <h3 className="font-bold text-lg text-slate-800">Agent Hiring Process</h3>

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

      <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
        <div className="font-medium mb-1">ℹ️ Fee Information:</div>
        <p className="text-sm">
          The agent fee is fixed at 1 USDT per day. For {agentMetadata.duration}{' '}
          days, the total cost will be {agentMetadata.totalCost} USDT.
        </p>
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
              onClick={() => refetchAgentData()}
              className="ml-2 text-blue-600 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-y-3">
            <div className="text-gray-500">Agent Type:</div>
            <div className="font-medium">{agentMetadata.agentType}</div>
            <div className="text-gray-500">Agent Address:</div>
            <div className="font-medium text-blue-600 font-mono text-sm break-all">
              {agentAddress}
            </div>
            <div className="text-gray-500">Daily Rate:</div>
            <div className="font-medium text-blue-600">
              {agentMetadata.amount} USDT
            </div>
            <div className="text-gray-500">Hiring Duration:</div>
            <div className="font-medium">
              <input
                type="number"
                min="1"
                value={agentMetadata.duration}
                onChange={(e) => handleDurationChange(e.target.value)}
                className="w-20 px-2 py-1 border border-gray-300 rounded"
              />{' '}
              days
            </div>
            <div className="text-gray-500">Total Cost:</div>
            <div className="font-medium text-green-600">
              {agentMetadata.totalCost} USDT
            </div>
          </div>
        )}
      </div>

      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="font-medium mb-2">Your USDT Balance:</div>
        <p
          className={`text-lg font-bold ${
            !hasEnoughUSDT ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {usdtBalance} USDT
        </p>
        {!hasEnoughUSDT && (
          <div className="flex items-center mt-2 text-red-600 text-sm">
            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
            Insufficient balance! You need {agentMetadata.totalCost} USDT to
            complete this transaction
          </div>
        )}
        <button
          onClick={() => refetchBalance()}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Refresh Balance
        </button>
      </div>

      {!isUsdtApproved() && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
          <div className="font-medium mb-2">
            ⚠️ USDT Authorization Required:
          </div>
          <p className="text-sm mb-3">
            Before creating the hiring relationship, the contract will need
            approval to use your USDT tokens. This will be done automatically as
            part of the process.
          </p>
        </div>
      )}

      <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
        <div className="font-medium mb-1">⚠️ Important Notice:</div>
        <p className="text-sm">
          By creating this hiring relationship, you authorize a transfer of{' '}
          {agentMetadata.totalCost} USDT from your wallet to the contract at a
          fixed rate of 1 USDT per day. The payment will be held in escrow until
          the hiring relationship is completed.
        </p>
      </div>

      {txError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-100">
          <div className="font-medium text-red-800 mb-1 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-1" />
            Transaction Error
          </div>
          <p className="text-sm text-red-700">{txError}</p>
        </div>
      )}

      <button
        onClick={handleHireAgent}
        disabled={
          isProcessing ||
          !agentMetadata.agentType ||
          !hasEnoughUSDT ||
          !!agentDataError
        }
        className={`
          w-full py-2.5 px-5 rounded-lg font-medium transition-colors
          ${
            isProcessing
              ? 'bg-gray-400 text-white'
              : !agentMetadata.agentType || !hasEnoughUSDT || !!agentDataError
              ? 'bg-gray-300 text-gray-500'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }
        `}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
            {isApproving || isApproveLoading
              ? 'Authorizing USDT...'
              : 'Creating Hiring Contract...'}
          </span>
        ) : (
          'Hire Agent Now'
        )}
      </button>

      <AlertDialogComponent
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        confirmText={alertDialog.confirmText}
        cancelText={alertDialog.cancelText}
        onConfirm={alertDialog.onConfirm}
        onCancel={alertDialog.onCancel}
        showCancel={alertDialog.showCancel}
      />
    </div>
  );
};

export default MergedAgentHiring;
