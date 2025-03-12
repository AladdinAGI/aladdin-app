// AgentHiringStep2.tsx
import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import {
  AgentHiringComponentProps,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  USDT_ABI,
  USDT_ADDRESS,
} from './AgentHiringTypes';

export const AgentHiringStep2: React.FC<AgentHiringComponentProps> = ({
  hiringData,
  agentAddress,
  onAction,
}) => {
  const { address } = useAccount();
  const chainId = useChainId();

  // State management
  const [approvalStatus, setApprovalStatus] = useState<
    'pending' | 'approved' | 'error' | null
  >(null);
  const [usdtBalance, setUsdtBalance] = useState<string>('0');
  const [txError, setTxError] = useState<string | null>(null);
  const [isCreatingEngagement, setIsCreatingEngagement] =
    useState<boolean>(false);

  // Use wagmi hooks for contract interaction
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: 'allowance',
    args: address && [address, CONTRACT_ADDRESS],
    query: {
      enabled: Boolean(address),
    },
  });

  // Read USDT balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: USDT_ADDRESS,
    abi: USDT_ABI,
    functionName: 'balanceOf',
    args: address && [address],
    query: {
      enabled: Boolean(address),
    },
  });

  // Authorize USDT
  const {
    data: approveHash,
    isPending: isApproving,
    writeContract: approveUSDT,
  } = useWriteContract();

  // Create hiring contract
  const {
    data: createEngagementHash,
    isPending: isContractWritePending,
    writeContract: createEngagement,
  } = useWriteContract();

  // Monitor transaction completion
  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  const { isLoading: isCreateLoading, isSuccess: isCreateSuccess } =
    useWaitForTransactionReceipt({
      hash: createEngagementHash,
    });

  // Combine all loading states into a unified isCreating state
  useEffect(() => {
    setIsCreatingEngagement(isContractWritePending || isCreateLoading);
  }, [isContractWritePending, isCreateLoading]);

  // Monitor USDT balance changes
  useEffect(() => {
    if (balanceData) {
      setUsdtBalance(formatUnits(balanceData as bigint, 6)); // USDT typically has 6 decimal places
    }
  }, [balanceData]);

  // Monitor USDT authorization status changes
  useEffect(() => {
    if (allowanceData && hiringData.totalCost) {
      try {
        const totalCostWei = parseUnits(hiringData.totalCost, 6); // USDT typically has 6 decimal places
        if ((allowanceData as bigint) >= totalCostWei) {
          setApprovalStatus('approved');
        } else {
          setApprovalStatus('pending');
        }
      } catch (error) {
        console.error('Error checking allowance:', error);
        setApprovalStatus('error');
      }
    }
  }, [allowanceData, hiringData.totalCost]);

  // Monitor authorization transaction success
  useEffect(() => {
    if (isApproveSuccess) {
      console.log('USDT approval successful, checking updated allowance');
      setTimeout(() => {
        refetchAllowance();
      }, 2000);
    }
  }, [isApproveSuccess, refetchAllowance]);

  // Monitor create contract transaction success
  useEffect(() => {
    if (isCreateSuccess && createEngagementHash) {
      console.log('Engagement created successfully:', createEngagementHash);
      // Save transaction hash to local storage
      window.localStorage.setItem(
        'latestEngagementTxHash',
        createEngagementHash
      );

      // Set a random engagement ID as a mock (in a real project this should be obtained from contract events)
      const mockEngagementId = `ENG-${Math.floor(Math.random() * 1000000)}`;
      window.localStorage.setItem('latestEngagementId', mockEngagementId);

      // Reset creation state
      setIsCreatingEngagement(false);

      // Wait a short time to ensure state is fully updated before switching steps
      setTimeout(() => {
        // Notify parent component
        onAction('engagement-created', {
          txHash: createEngagementHash,
          engagementId: mockEngagementId,
        });
      }, 500);
    }
  }, [isCreateSuccess, createEngagementHash, onAction]);

  // Handle USDT authorization
  const handleApproveUSDT = () => {
    setTxError(null);
    try {
      if (!address) return;

      const totalCostWei = parseUnits(hiringData.totalCost, 6);

      console.log('Approving USDT:', {
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, totalCostWei],
      });

      // Use writeContract to trigger wallet interaction
      approveUSDT({
        address: USDT_ADDRESS,
        abi: USDT_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, totalCostWei],
      });
    } catch (error) {
      console.error('Error approving USDT:', error);
      setTxError((error as Error)?.message || 'Failed to approve USDT');
      setApprovalStatus('error');
    }
  };

  // Handle creating the hiring contract
  const handleCreateEngagement = () => {
    if (isCreatingEngagement) return; // Prevent duplicate clicks

    setTxError(null);
    try {
      if (!agentAddress || !address) return;

      // Explicitly set creation state to true
      setIsCreatingEngagement(true);

      // If approval status is not approved, we try to authorize first
      if (approvalStatus !== 'approved') {
        handleApproveUSDT();
        // Short delay before continuing creation
        setTimeout(() => {
          createEngagementAction();
        }, 2000);
        return;
      }

      createEngagementAction();
    } catch (error) {
      console.error('Error creating engagement:', error);
      setTxError((error as Error)?.message || 'Failed to create engagement');
      setIsCreatingEngagement(false);
      onAction('error', 'Failed to create engagement. Please try again.');
    }
  };

  // Actual create hiring contract operation
  const createEngagementAction = () => {
    console.log('Creating engagement:', {
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'createEngagement',
      args: [agentAddress, BigInt(hiringData.duration)],
    });

    // Use writeContract to trigger wallet interaction
    createEngagement({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'createEngagement',
      args: [agentAddress, BigInt(hiringData.duration)],
    });
  };

  // Check if on Sepolia testnet
  const isOnSepolia = chainId === 11155111;
  const hasEnoughUSDT =
    parseFloat(usdtBalance) >= parseFloat(hiringData.totalCost);

  // Switch to Sepolia network
  const switchToSepolia = () => {
    try {
      if (window.ethereum) {
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
        });
      }
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  if (!isOnSepolia) {
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

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-slate-800 text-center">
        Create Hiring Contract (Step 2/{hiringData.totalSteps})
      </h3>

      <p className="text-gray-500 mb-4">
        You are about to hire a <strong>{hiringData.agentType}</strong> agent
        for a duration of <strong>{hiringData.duration} days</strong> at a cost
        of <strong>{hiringData.totalCost} USDT</strong>.
      </p>

      <div className="mb-5">
        <div className="text-sm font-medium text-gray-600 mb-2">
          Smart Contract Address:
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 font-mono text-sm text-blue-800 break-all">
          {CONTRACT_ADDRESS}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-sm font-medium text-gray-600 mb-2">
          Agent Wallet Address:
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 font-mono text-sm text-green-800 break-all">
          {agentAddress}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        <div className="text-sm font-medium text-gray-900 mb-3">
          Contract Terms:
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <div className="text-gray-500">Agent Type:</div>
          <div className="font-medium">{hiringData.agentType}</div>

          <div className="text-gray-500">Daily Rate:</div>
          <div className="font-medium text-blue-600">
            {hiringData.amount} USDT
          </div>

          <div className="text-gray-500">Duration:</div>
          <div className="font-medium">{hiringData.duration} days</div>

          <div className="text-gray-500">Total Payment:</div>
          <div className="font-medium text-green-600">
            {hiringData.totalCost} USDT
          </div>
        </div>
      </div>

      {/* USDT balance display */}
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
            Insufficient balance! You need {hiringData.totalCost} USDT to
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

      {/* Authorization status and button */}
      {approvalStatus === 'pending' && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
          <div className="font-medium mb-2">
            ⚠️ USDT Authorization Required:
          </div>
          <p className="text-sm mb-3">
            Before creating the hiring relationship, you need to approve the
            contract to use your USDT tokens.
          </p>
          <button
            onClick={handleApproveUSDT}
            disabled={isApproving || isApproveLoading}
            className={`
              bg-amber-600 text-white px-4 py-2 rounded-lg font-medium 
              hover:bg-amber-700 transition-colors disabled:bg-gray-400
              flex items-center
            `}
          >
            {isApproving || isApproveLoading ? (
              <>
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
                Authorizing...
              </>
            ) : (
              'Authorize USDT'
            )}
          </button>
        </div>
      )}

      {approvalStatus === 'approved' && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-100">
          <div className="font-medium text-green-800 mb-1 flex items-center">
            <CheckCircledIcon className="w-5 h-5 mr-1" />
            USDT Authorized
          </div>
          <p className="text-sm text-green-700">
            You have authorized the contract to use your USDT. You can now
            create the hiring relationship.
          </p>
        </div>
      )}

      {approvalStatus === 'error' && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-100">
          <div className="font-medium text-red-800 mb-1 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-1" />
            Authorization Error
          </div>
          <p className="text-sm text-red-700">
            Error checking or authorizing USDT. Please try again.
          </p>
          {txError && (
            <p className="mt-2 text-xs text-red-600 font-mono bg-red-50 p-2 rounded">
              {txError}
            </p>
          )}
        </div>
      )}

      <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
        <div className="font-medium mb-1">⚠️ Important Notice:</div>
        <p className="text-sm">
          By creating this hiring relationship, you authorize a transfer of{' '}
          {hiringData.totalCost} USDT from your wallet to the contract. The
          payment will be held in escrow until the hiring relationship is
          completed.
        </p>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => onAction('back')}
          disabled={isCreatingEngagement}
          className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2 disabled:bg-gray-100 disabled:text-gray-400"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleCreateEngagement}
          disabled={isCreatingEngagement}
          className={`
            ${
              isCreatingEngagement
                ? 'bg-indigo-400'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } 
            text-white px-5 py-2.5 rounded-lg font-medium 
            transition-colors
            flex items-center
          `}
        >
          {isCreatingEngagement ? (
            <>
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
              Creating...
            </>
          ) : (
            'Create Hiring Relationship'
          )}
        </button>
      </div>
    </div>
  );
};
