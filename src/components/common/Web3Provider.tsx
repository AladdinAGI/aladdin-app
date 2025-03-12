'use client';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

// 定义配置
const config = createConfig(
  getDefaultConfig({
    // 支持的链：ETH主网和Sepolia测试网
    chains: [mainnet, sepolia],
    transports: {
      // 各链的RPC URL
      [mainnet.id]: http(
        `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
      ),
      [sepolia.id]: http(
        `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`
      ),
    },

    // 必需的API密钥
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',

    // 项目信息
    appName: 'Aladin',
    ssr: true,
    appDescription:
      'Aladdin is an AI chat interface powered by coordinated learning agents through algorithmic contracts to solve complex tasks. Each principal acts as a domain-specific expert, handling complex workflows like research, trading, and data analysis-automating from DeFi to every industry.',
    appUrl: 'https://aladdinagi.xyz/',
    appIcon: 'https://aladdinagi.xyz/favicon.ico',
  })
);

const queryClient = new QueryClient();

import { ReactNode } from 'react';

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="nouns"
          mode="light"
          options={{
            initialChainId: 11155111,
            hideNoWalletCTA: false,
            embedGoogleFonts: true,
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
