'use client';

import { ConnectKitButton } from 'connectkit';

interface ConnectButtonProps {
  connectText?: string;
}

export function ConnectButton({
  connectText = 'Connect Wallet',
}: ConnectButtonProps) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress }) => {
        return (
          <button
            onClick={show}
            type="button"
            className="px-5 py-2 rounded-full bg-[#1890ff] text-white hover:bg-[#40a9ff] transition-colors text-sm"
          >
            {isConnected ? truncatedAddress : connectText}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
