'use client';

import { useState } from 'react';
// 导入MergedAgentHiring组件
import MergedAgentHiring from '@/components/staking/MergedAgentHiring';

export default function ContractPanel() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [depositComplete, setDepositComplete] = useState(false);
  const [showAgentHiring, setShowAgentHiring] = useState(false);

  const contractAddress = '0x90E51BD7e0F5347b07D0e383e739cE5da292d725';
  const aavePoolAddress = '0x87870BCa3F3FD6335C3F4ce8392d69350B4F4e2b';
  const agentAddress = '0x330136160d2008AbF5c24d0aFda688A1B5C11c53'; // 模拟代理地址

  // 处理Deposit Funds点击
  const handleDepositClick = () => {
    setDepositComplete(true);
    setCurrentStep(2);
    setShowAgentHiring(true);
  };

  // 正常的存款按钮处理
  const handleDeposit = () => {
    setIsDepositing(true);
    // 模拟存款过程
    setTimeout(() => {
      setIsDepositing(false);
      setDepositComplete(true);
      setCurrentStep(2);
      setShowAgentHiring(true); // 显示Agent雇佣流程
    }, 2000);
  };

  const handleAgentHiringComplete = () => {
    setShowAgentHiring(false);
    // 在这里可以添加成功完成后的逻辑
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 relative">
      <h2 className="text-base font-medium text-gray-900 mb-4">
        Staking Process
      </h2>

      {/* Steps indicator */}
      <div className="mb-6">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 1
                ? 'bg-blue-500 text-white'
                : depositComplete
                ? 'bg-green-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            1
          </div>
          <div
            className={`h-1 flex-1 mx-2 ${
              depositComplete ? 'bg-green-500' : 'bg-gray-200'
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            2
          </div>
        </div>
        <div className="flex justify-between mt-2">
          {/* 点击"Deposit Funds"文本可以直接跳到Agent雇佣流程 - 扩大点击区域 */}
          <div
            className="text-xs font-medium text-gray-600 cursor-pointer hover:text-blue-600 px-4 py-2 -mx-4 -my-2"
            onClick={handleDepositClick}
          >
            Deposit Funds
          </div>
          <div className="text-xs font-medium text-gray-600 px-4 py-2 -mx-4 -my-2">
            Sign Contract
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* 当点击Deposit后，显示Agent雇佣流程 */}
        {showAgentHiring ? (
          <MergedAgentHiring
            agentAddress={agentAddress}
            onComplete={handleAgentHiringComplete}
          />
        ) : currentStep === 1 ? (
          <div className="p-4 border border-gray-100 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Step 1: Deposit to Aave Pool
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              To start the staking process, you need to deposit funds into the
              Aave V3 Pool contract.
            </p>

            <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-100">
              <div className="flex items-center mb-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mr-2">
                  Aave V3 Pool
                </span>
                <span className="text-sm font-mono text-gray-600 truncate">
                  {aavePoolAddress}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Make sure to approve the contract to use your USDT before
                depositing.
              </p>
            </div>

            <div className="p-3 bg-blue-50 rounded-md mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Deposit Details
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Amount:</div>
                <div className="text-sm text-gray-900 font-medium">
                  10,000 USDT
                </div>

                <div className="text-sm text-gray-500">Expected APY:</div>
                <div className="text-sm text-gray-900 font-medium">5.00%</div>

                <div className="text-sm text-gray-500">Duration:</div>
                <div className="text-sm text-gray-900 font-medium">
                  365 days
                </div>
              </div>
            </div>

            <button
              onClick={handleDeposit}
              disabled={isDepositing}
              className={`w-full py-2 px-4 rounded-lg transition-colors ${
                isDepositing
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isDepositing ? (
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
                  Depositing...
                </span>
              ) : (
                'Deposit Funds'
              )}
            </button>
          </div>
        ) : (
          <div className="p-4 border border-gray-100 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Step 2: Sign Staking Contract
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Now that you&apos;ve deposited funds, sign our smart contract to
              begin staking with your selected parameters.
            </p>

            <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-100">
              <div className="flex items-center mb-2">
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mr-2">
                  Staking Contract
                </span>
                <span className="text-sm font-mono text-gray-600 truncate">
                  {contractAddress}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                This contract will manage your staking position according to
                your risk tolerance.
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-md mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Staking Parameters
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500">Amount:</div>
                <div className="text-sm text-gray-900 font-medium">
                  10,000 USDT
                </div>

                <div className="text-sm text-gray-500">Target APY:</div>
                <div className="text-sm text-gray-900 font-medium">5.00%</div>

                <div className="text-sm text-gray-500">Risk Tolerance:</div>
                <div className="text-sm text-gray-900 font-medium">15%</div>

                <div className="text-sm text-gray-500">Duration:</div>
                <div className="text-sm text-gray-900 font-medium">
                  365 days
                </div>

                <div className="text-sm text-gray-500">Expected Return:</div>
                <div className="text-sm text-gray-900 font-medium">
                  500 USDT
                </div>
              </div>
            </div>

            {/* Signed Agents section */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Contract Agents
              </h4>
              <div className="space-y-3">
                <div className="p-3 border border-gray-100 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">Agent Alpha</div>
                    <div className="text-sm text-gray-500">DeFi Agent</div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                    Active
                  </span>
                </div>
                <div className="p-3 border border-gray-100 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">Agent Beta</div>
                    <div className="text-sm text-gray-500">Finance AI</div>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">
                    Pending
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSigning(true)}
              disabled={isSigning}
              className={`w-full py-2 px-4 rounded-lg transition-colors ${
                isSigning
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {isSigning ? (
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
                  Signing Contract...
                </span>
              ) : (
                'Sign Contract'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Background decorative elements */}
      <div className="fixed top-20 left-10 w-20 h-20 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
      <div className="fixed bottom-20 right-10 w-32 h-32 rounded-full bg-purple-500/20 blur-xl animate-pulse"></div>
      <div className="fixed top-1/3 right-1/4 w-16 h-16 rounded-full bg-pink-500/20 blur-xl animate-pulse"></div>

      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/5 animate-ping opacity-20"
        style={{ animationDelay: '0.5s' }}
      ></div>
    </div>
  );
}
