// useWalletInfo.ts
import { useAccount, useEnsName, useEnsAvatar, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';

/**
 * 自定义Hook，获取钱包信息并提供备用头像
 */
export function useWalletInfo() {
  // 获取当前连接的钱包信息
  const { address, isConnected, isConnecting, isDisconnected, status } =
    useAccount();

  // 头像URL状态
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  // 是否使用备用头像
  const [isUsingFallbackAvatar, setIsUsingFallbackAvatar] = useState(false);

  // 获取ENS名称
  const {
    data: ensNameData,
    isLoading: isEnsNameLoading,
    error: ensNameError,
  } = useEnsName({
    address,
    query: {
      enabled: Boolean(address),
    },
  });
  const ensName = ensNameData ?? undefined;

  // 获取ENS头像
  const {
    data: ensAvatarData,
    isLoading: isEnsAvatarLoading,
    error: ensAvatarError,
  } = useEnsAvatar({
    name: ensName,
    query: {
      enabled: Boolean(ensName),
    },
  });
  const ensAvatar = ensAvatarData ?? undefined;

  // 获取钱包ETH余额
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
    query: {
      enabled: Boolean(address),
    },
  });

  // 显示调试信息
  useEffect(() => {
    console.log('钱包信息状态:', {
      address,
      isConnected,
      ensName,
      ensNameLoading: isEnsNameLoading,
      ensNameError,
      ensAvatar,
      ensAvatarLoading: isEnsAvatarLoading,
      ensAvatarError,
    });
  }, [
    address,
    isConnected,
    ensName,
    isEnsNameLoading,
    ensNameError,
    ensAvatar,
    isEnsAvatarLoading,
    ensAvatarError,
  ]);

  // 设置头像，优先使用ENS头像，如果没有则使用effigy.im
  useEffect(() => {
    if (!isConnected || !address) {
      setAvatarUrl(undefined);
      setIsUsingFallbackAvatar(false);
      return;
    }

    // 如果ENS头像正在加载，不更新
    if (isEnsAvatarLoading) return;

    // 如果有ENS头像，使用它
    if (ensAvatar) {
      setAvatarUrl(ensAvatar);
      setIsUsingFallbackAvatar(false);
      console.log('使用ENS头像:', ensAvatar);
    }
    // 否则使用effigy.im的头像
    else {
      const fallbackAvatar = `https://effigy.im/a/${address}.svg`;
      setAvatarUrl(fallbackAvatar);
      setIsUsingFallbackAvatar(true);
      console.log('使用备用头像:', fallbackAvatar);
    }
  }, [address, ensAvatar, isConnected, isEnsAvatarLoading]);

  // 处理加载状态
  const isLoading = isEnsNameLoading || isEnsAvatarLoading || isBalanceLoading;

  return {
    // 钱包基础信息
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    status,

    // ENS信息
    ensName,
    ensAvatar,
    avatarUrl, // 可能是ENS头像或备用头像
    isUsingFallbackAvatar,

    // 余额信息
    balance: balanceData?.formatted,
    balanceSymbol: balanceData?.symbol,
    balanceValue: balanceData?.value,

    // 加载状态
    isLoading,
    isEnsNameLoading,
    isEnsAvatarLoading,

    // 错误信息
    ensNameError,
    ensAvatarError,
  };
}

export default useWalletInfo;
