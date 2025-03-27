// AaveStaking.tsx
import React, { useState, useEffect, useRef } from 'react';
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
import { parseUnits, formatUnits, getAddress } from 'viem';
import { useAtom } from 'jotai';
import { stakingParamsAtom } from '@/store';
import { USDC_ABI, AAVE_POOL_ABI } from './StakingTypes';
import AlertDialogComponent from '../ui/AlertDialog';

interface AaveStakingProps {
  onComplete?: () => void;
}

export const AaveStaking: React.FC<AaveStakingProps> = ({ onComplete }) => {
  // 用于防止重复处理的ref
  const hasCompletedRef = useRef<boolean>(false);
  // 用于防止多次显示成功弹窗
  const successAlertShownRef = useRef<boolean>(false);

  // Sepolia上的Aave v3池合约地址
  const poolAddress = '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951';
  // Sepolia上的USDC合约地址
  const usdcAddress = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8';

  const formattedPoolAddress = getAddress(poolAddress);
  const formattedUsdcAddress = getAddress(usdcAddress);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [stakingParams] = useAtom(stakingParamsAtom);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processComplete, setProcessComplete] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [walletRequestTimeout, setWalletRequestTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    type: 'info' as 'info' | 'error' | 'warning' | 'success',
    title: '',
    message: '',
  });

  const isOnSepolia = chainId === 11155111;

  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: formattedUsdcAddress as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: formattedUsdcAddress as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: address
      ? [address as `0x${string}`, formattedPoolAddress as `0x${string}`]
      : undefined,
    query: {
      enabled: Boolean(address),
    },
  });

  const {
    data: approveHash,
    isPending: isApproving,
    writeContractAsync: approveUSDC,
    error: approveError,
  } = useWriteContract();

  const {
    data: depositHash,
    writeContractAsync: depositToAave,
    error: depositError,
  } = useWriteContract();

  const {
    isLoading: isApproveLoading,
    isSuccess: isApproveSuccess,
    isError: isApproveError,
  } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isSuccess: isDepositSuccess, isError: isDepositError } =
    useWaitForTransactionReceipt({
      hash: depositHash,
    });

  // 清理timeout
  useEffect(() => {
    return () => {
      if (walletRequestTimeout) clearTimeout(walletRequestTimeout);
    };
  }, [walletRequestTimeout]);

  // 监听approve错误
  useEffect(() => {
    if (approveError) {
      console.error('Approve error:', approveError);
      setTxError(`Approval error: ${approveError.message}`);
      setIsProcessing(false);
      showAlert('error', 'Approval Failed', `Error: ${approveError.message}`);
    }
  }, [approveError]);

  // 监听deposit错误
  useEffect(() => {
    if (depositError) {
      console.error('Deposit error:', depositError);
      setTxError(`Deposit error: ${depositError.message}`);
      setIsProcessing(false);
      showAlert('error', 'Deposit Failed', `Error: ${depositError.message}`);
    }
  }, [depositError]);

  // 监听approve交易错误
  useEffect(() => {
    if (isApproveError && approveHash) {
      console.error('Approve transaction failed');
      setTxError('USDC approval transaction failed. Please try again.');
      setIsProcessing(false);
      showAlert(
        'error',
        'Transaction Failed',
        'USDC approval transaction failed. Please try again.'
      );
    }
  }, [isApproveError, approveHash]);

  // 监听deposit交易错误
  useEffect(() => {
    if (isDepositError && depositHash) {
      console.error('Deposit transaction failed');
      setTxError('Deposit transaction failed. Please try again.');
      setIsProcessing(false);
      showAlert(
        'error',
        'Transaction Failed',
        'Deposit transaction failed. Please try again.'
      );
    }
  }, [isDepositError, depositHash]);

  // 更新余额
  useEffect(() => {
    if (balanceData) {
      const newBalance = formatUnits(balanceData as bigint, 6);
      console.log('Updated USDC balance:', newBalance);
      setUsdcBalance(newBalance);
    }
  }, [balanceData]);

  // 授权后进行质押
  const processStakingAfterApproval = React.useCallback(async () => {
    try {
      if (!address) {
        setIsProcessing(false);
        return;
      }

      console.log('Processing deposit to Aave...');
      const amountToStake = parseUnits(stakingParams.amount.toString(), 6);

      const timeoutId = setTimeout(() => {
        console.log('Deposit request timed out');
        setIsProcessing(false);
        setTxError('Wallet request timed out. Please try again.');
        showAlert(
          'error',
          'Timeout',
          'Wallet request timed out. Please check if your wallet is responding.'
        );
      }, 30000);

      setWalletRequestTimeout(timeoutId);

      await depositToAave({
        address: formattedPoolAddress as `0x${string}`,
        abi: AAVE_POOL_ABI,
        functionName: 'supply',
        args: [
          formattedUsdcAddress as `0x${string}`,
          amountToStake,
          address,
          0,
        ],
      });

      clearTimeout(timeoutId);
      console.log('Deposit transaction submitted:', depositHash);
    } catch (error) {
      console.error('Error depositing to Aave:', error);
      setTxError((error as Error)?.message || 'Failed to deposit to Aave');
      setIsProcessing(false);
      showAlert(
        'error',
        'Deposit Failed',
        (error as Error)?.message || 'Failed to deposit to Aave'
      );
      if (walletRequestTimeout) clearTimeout(walletRequestTimeout);
    }
  }, [
    address,
    depositHash,
    depositToAave,
    formattedPoolAddress,
    formattedUsdcAddress,
    stakingParams.amount,
    walletRequestTimeout,
  ]);

  // 更新Allowance状态
  useEffect(() => {
    if (allowanceData && stakingParams.amount) {
      try {
        const amountToStake = parseUnits(stakingParams.amount.toString(), 6);
        const approved = (allowanceData as bigint) >= amountToStake;
        console.log('Allowance updated:', {
          allowance: allowanceData.toString(),
          required: amountToStake.toString(),
          approved,
        });
        setIsApproved(approved);
      } catch (error) {
        console.error('Error checking allowance:', error);
      }
    }
  }, [allowanceData, stakingParams.amount]);

  // 授权成功后处理
  useEffect(() => {
    if (isApproveSuccess && approveHash) {
      console.log('USDC approval successful:', approveHash);

      // 等待区块确认后更新授权状态
      setTimeout(async () => {
        await refetchAllowance();
        showAlert(
          'success',
          'Approval Successful',
          'Approval successful. Now starting to deposit USDC to Aave.'
        );

        // 延迟执行下一步，确保用户能看到授权成功的通知
        setTimeout(() => {
          processStakingAfterApproval();
        }, 2000);
      }, 2000);
    }
  }, [
    isApproveSuccess,
    approveHash,
    refetchAllowance,
    processStakingAfterApproval,
  ]);

  // 质押成功后处理 - 使用ref防止重复处理
  useEffect(() => {
    if (isDepositSuccess && depositHash && !hasCompletedRef.current) {
      console.log('Deposit successful:', depositHash);
      setTxHash(depositHash);
      setIsProcessing(false);
      setProcessComplete(true);

      // 标记为已完成，防止重复触发
      hasCompletedRef.current = true;

      // 强制刷新余额
      setTimeout(() => {
        refetchBalance();
      }, 2000);

      // 只显示一次成功提示
      if (!successAlertShownRef.current) {
        successAlertShownRef.current = true;
        showAlert(
          'success',
          'Deposit Successful',
          'Your funds have been successfully deposited to Aave. Please add the aUSDC token to your wallet to see your deposit.'
        );
      }
    }
  }, [isDepositSuccess, depositHash, refetchBalance]);

  // 连接钱包
  const handleConnectWallet = () => {
    if (isConnected) {
      disconnect();
      console.log('Wallet disconnected');
    } else {
      connect({ connector: injected() });
      console.log('Attempting to connect wallet');
    }
  };

  // 切换到Sepolia网络
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
      showAlert(
        'error',
        'Network Error',
        'Failed to switch to Sepolia network. Please try manually in your wallet.'
      );
    }
  };

  // 显示提示框，添加防重复显示逻辑
  const showAlert = (
    type: 'info' | 'error' | 'warning' | 'success',
    title: string,
    message: string
  ) => {
    // 如果已经显示了成功弹窗，且这是另一个成功弹窗，则不再显示
    if (
      type === 'success' &&
      successAlertShownRef.current &&
      title === 'Deposit Successful'
    ) {
      return;
    }

    // 确保关闭任何可能已经打开的弹窗
    setAlertDialog({
      isOpen: false,
      type,
      title,
      message,
    });

    // 延迟一下再打开新弹窗，确保旧弹窗已经关闭
    setTimeout(() => {
      setAlertDialog({
        isOpen: true,
        type,
        title,
        message,
      });
    }, 100);
  };

  // 检查USDC余额是否足够
  const hasEnoughUSDC =
    parseFloat(usdcBalance) >= parseFloat(stakingParams.amount.toString());

  // 授权USDC
  const handleApproveUSDC = async () => {
    if (isProcessing) return;
    setTxError(null);
    setIsProcessing(true);

    try {
      if (!address) {
        console.error('No wallet address found');
        setIsProcessing(false);
        showAlert(
          'error',
          'Wallet Error',
          'No wallet address found. Please reconnect your wallet.'
        );
        return;
      }

      console.log('Approving USDC...');
      // 授权数量增加20%，避免精度问题
      const amountToStake = parseUnits(
        (parseFloat(stakingParams.amount.toString()) * 1.2).toString(),
        6
      );

      const timeoutId = setTimeout(() => {
        console.log('Approval request timed out');
        setIsProcessing(false);
        setTxError('Wallet request timed out. Please try again.');
        showAlert(
          'error',
          'Timeout',
          'Wallet request timed out. Please check if your wallet is responding.'
        );
      }, 30000);

      setWalletRequestTimeout(timeoutId);

      await approveUSDC({
        address: formattedUsdcAddress as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [formattedPoolAddress as `0x${string}`, amountToStake],
      });

      clearTimeout(timeoutId);
      console.log('Approval transaction submitted');
    } catch (error) {
      console.error('Error approving USDC:', error);
      setTxError((error as Error)?.message || 'Failed to approve USDC');
      setIsProcessing(false);
      showAlert(
        'error',
        'Approval Failed',
        (error as Error)?.message || 'Failed to approve USDC'
      );
      if (walletRequestTimeout) clearTimeout(walletRequestTimeout);
    }
  };

  // 处理质押
  const handleStake = () => {
    if (isProcessing) return;
    if (!hasEnoughUSDC) {
      showAlert(
        'error',
        'Insufficient Balance',
        `You need at least ${stakingParams.amount} USDC to proceed with staking.`
      );
      return;
    }

    setTxError(null);
    console.log('Staking initiated...');
    if (isApproved) {
      setIsProcessing(true);
      processStakingAfterApproval();
    } else {
      handleApproveUSDC();
    }
  };

  // 重置流程
  const handleReset = () => {
    setProcessComplete(false);
    setTxHash(null);
    setTxError(null);
    // 重置完成标记
    hasCompletedRef.current = false;
    // 重置成功弹窗显示标记
    successAlertShownRef.current = false;

    // 关闭任何可能打开的弹窗
    setAlertDialog((prev) => ({
      ...prev,
      isOpen: false,
    }));

    if (onComplete) {
      // 使用延迟调用onComplete，确保状态已经完全重置
      setTimeout(() => {
        onComplete();
      }, 100);
    }
  };

  // 处理弹窗关闭
  const handleAlertClose = () => {
    setAlertDialog((prev) => ({ ...prev, isOpen: false }));

    // 如果是完成后的成功弹窗关闭，允许再次显示成功弹窗
    if (
      alertDialog.type === 'success' &&
      alertDialog.title === 'Deposit Successful'
    ) {
      successAlertShownRef.current = true;
    }
  };

  // 需要切换到Sepolia网络
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

  // 未连接钱包
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

  // 处理完成
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
            {formattedPoolAddress}
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
      {!isApproved && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
          <div className="font-medium mb-2">
            ⚠️ USDC Authorization Required:
          </div>
          <p className="text-sm mb-3">
            Before depositing to Aave, the contract will need approval to use
            your USDC tokens. This will be done automatically as part of the
            process.
          </p>
        </div>
      )}
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
      <button
        onClick={handleStake}
        disabled={isProcessing || !hasEnoughUSDC}
        className={`
          w-full py-2.5 px-5 rounded-lg font-medium transition-colors
          ${
            isProcessing
              ? 'bg-gray-400 text-white'
              : !hasEnoughUSDC
              ? 'bg-gray-300 text-gray-500'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
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
              ? 'Authorizing USDC...'
              : 'Depositing to Aave...'}
          </span>
        ) : (
          'Deposit to Aave Pool'
        )}
      </button>
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
