'use client';

import React from 'react';

interface CompactMCPProps {
  language: string;
}

const MCPServiceInfo = ({ language = 'en' }: CompactMCPProps) => {
  const isZh = language === 'zh';

  return (
    <div className="w-[100%] mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md p-3 text-white mt-[0.5rem]">
      <div className="flex items-center space-x-2">
        <div className="rounded-full bg-white bg-opacity-20 p-1">
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 10V3L4 14h7v7l9-11h-7z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h4 className="font-medium text-sm">
            {isZh ? 'MCP服务' : 'MCP Services'}
          </h4>
          <p className="text-xs text-white text-opacity-90">
            {isZh
              ? '我们支持 MCP 服务，接入我们的稳定币质押代理（Agent），帮助用户通过我们的代理赚取更多收益。'
              : 'We support MCP services—connect with our stablecoin staking Agent and maximize your earnings effortlessly.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MCPServiceInfo;
