// AaveStaking.tsx
import React from 'react';
import {
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckIcon,
} from '@radix-ui/react-icons';
import { useAaveStaking, POOL_ADDRESS } from '@/hooks/useAaveStaking';
import AlertDialogComponent from '../ui/AlertDialog';

interface AaveStakingProps {
  onComplete?: () => void;
}

export const AaveStaking: React.FC<AaveStakingProps> = ({ onComplete }) => {
  const {
    // State
    isConnected,
    isOnSepolia,
    address,
    usdcBalance,
    hasEnoughUSDC,
    isApproved,
    isProcessing,
    isApprovingTx,
    isDepositingTx,
    processComplete,
    txHash,
    txError,
    alertDialog,
    stakingParams,

    // Actions
    handleConnectWallet,
    switchToSepolia,
    handleApproveUSDC,
    handleDeposit,
    handleReset,
    handleAlertClose,
    refetchBalance,
  } = useAaveStaking(onComplete);

  // If not on Sepolia network
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

  // If wallet not connected
  if (!isConnected) {
    return (
      <div className="p-5 rounded-xl bg-blue-50 border border-blue-100">
        <p className="font-semibold text-blue-800 mb-3">
          Please connect your wallet to stake on Aave
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

  // Process complete UI
  if (processComplete) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
          <CheckIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Deposit Successful!
        </h3>
        <p className="text-gray-600 mb-4">
          You have successfully deposited{' '}
          <strong>{stakingParams.amount} USDC</strong> to the Aave pool. Your
          funds are now earning interest at approximately{' '}
          <strong>{stakingParams.apy}%</strong> APY.
        </p>
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-5">
          <p className="font-medium text-gray-700 mb-1">
            Note: To view your deposited assets in MetaMask
          </p>
          <p className="text-sm text-gray-600 mb-2">
            You need to add the aUSDC token to your MetaMask. aUSDC represents
            your deposit in Aave.
          </p>
          <p className="text-sm font-medium text-gray-700">
            The aUSDC token address will appear in Etherscan transaction
            details.
          </p>
        </div>
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
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue to Sign Contract
          </button>
        </div>
      </div>
    );
  }

  // Main staking UI
  return (
    <div className="space-y-4 h-[70vh] overflow-y-scroll pr-1">
      <h3 className="font-bold text-lg text-slate-800">Aave Staking Process</h3>
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
          Staking Details
        </h3>
        <div className="grid grid-cols-2 gap-y-3">
          <div className="text-gray-500">Amount to Stake:</div>
          <div className="font-medium text-blue-600">
            {stakingParams.amount} USDC
          </div>
          <div className="text-gray-500">Expected APY:</div>
          <div className="font-medium text-green-600">{stakingParams.apy}%</div>
          <div className="text-gray-500">Duration:</div>
          <div className="font-medium">30 days</div>
          <div className="text-gray-500">Aave Pool Address:</div>
          <div className="font-medium text-blue-600 font-mono text-sm break-all">
            {POOL_ADDRESS}
          </div>
        </div>
      </div>
      <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
        <div className="font-medium mb-2">Your USDC Balance:</div>
        <p
          className={`text-lg font-bold ${
            !hasEnoughUSDC ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {usdcBalance} USDC
        </p>
        {!hasEnoughUSDC && (
          <div className="flex items-center mt-2 text-red-600 text-sm">
            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
            Insufficient balance! You need {stakingParams.amount} USDC to
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
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
        <div className="font-medium mb-2">
          {isApproved
            ? '✅ USDC Authorization Status:'
            : '⚠️ USDC Authorization Required:'}
        </div>
        <p className="text-sm mb-3">
          {isApproved
            ? 'Your USDC is successfully authorized. You can now proceed with the deposit.'
            : 'Before depositing to Aave, the contract will need approval to use your USDC tokens. Please click the "Authorize USDC" button below.'}
        </p>
        {!isApproved && (
          <button
            onClick={handleApproveUSDC}
            disabled={isProcessing || !hasEnoughUSDC}
            className={`
              w-full py-2.5 px-5 rounded-lg font-medium transition-colors
              ${
                isProcessing && isApprovingTx
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : !hasEnoughUSDC
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }
            `}
          >
            {isProcessing && isApprovingTx ? (
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
                Authorizing USDC...
              </span>
            ) : (
              'Authorize USDC'
            )}
          </button>
        )}
      </div>
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
        <div className="font-medium mb-1">ℹ️ Staking Information:</div>
        <p className="text-sm">
          You are about to deposit {stakingParams.amount} USDC into the Aave
          pool. Your funds will earn interest at approximately{' '}
          {stakingParams.apy}% APY. You can withdraw your funds at any time, but
          for maximum returns, we recommend keeping them deposited for the full
          duration.
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
      <div className="mt-8">
        <button
          onClick={handleDeposit}
          disabled={isProcessing || !hasEnoughUSDC || !isApproved}
          className={`
            w-full py-3 px-5 rounded-lg font-medium transition-colors text-lg
            ${
              isProcessing && isDepositingTx
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : !hasEnoughUSDC
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : !isApproved
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          {isProcessing && isDepositingTx ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
              Depositing to Aave...
            </span>
          ) : (
            'Deposit to Aave Pool'
          )}
        </button>

        {!isApproved && (
          <div className="mt-2 text-center text-amber-600 text-sm font-medium">
            Please complete USDC authorization first
          </div>
        )}
      </div>
      <AlertDialogComponent
        isOpen={alertDialog.isOpen}
        onClose={handleAlertClose}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        confirmText="OK"
        showCancel={false}
      />
    </div>
  );
};

export default AaveStaking;
