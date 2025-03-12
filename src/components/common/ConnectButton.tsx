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
          <a href={isConnected ? undefined : '#'} onClick={show}>
            {isConnected ? truncatedAddress : connectText}
          </a>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
