'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { QuickQuestions } from './QuickQuestions';
import { MastraClient } from '@mastra/client-js';
import ReactMarkdown from 'react-markdown';
import { useAccount } from 'wagmi';
import { AgentHiringFlow } from '../staking/AgentHiringFlow';
import { AgentHiringData } from '../staking/AgentHiringTypes';

// Staking data interface
interface StakingData {
  amount: string;
  apy: string;
  potentialLoss: string;
  currentStep: number;
  totalSteps: number;
}

interface Message {
  type: 'user' | 'ai';
  content: string;
  showTips?: boolean;
  id?: string;
  isLoading?: boolean;
  isStakingStep?: boolean;
  stakingStep?: number;
  stakingData?: {
    amount: string;
    apy: string;
    potentialLoss: string;
  };
  isHiringStep?: boolean;
  hiringStep?: number;
  hiringData?: {
    amount: string;
    duration: string;
    totalCost: string;
    agentType: string;
  };
}

export default function MainChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: `👋 Hello! I'm Aladdin AI Assistant, I can help you with cryptocurrency management and hiring AI agents. 
        
      Try saying '/stake amount[10000] APY[5] riskTolerance[15]' to stake your tokens!`,
      showTips: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [currentLang] = useState<'en' | 'zh'>('en');
  const [isLoading, setIsLoading] = useState(false);

  // Staking data state - now activated
  const [stakingData, setStakingData] = useState<StakingData>({
    amount: '1000',
    apy: '10',
    potentialLoss: '15',
    currentStep: 0,
    totalSteps: 3,
  });

  // Hiring data state
  const [hiringData, setHiringData] = useState<AgentHiringData>({
    amount: '1',
    duration: '7',
    totalCost: '700',
    agentType: 'DEFI',
    currentStep: 0,
    totalSteps: 3,
  });

  // Wagmi hooks
  const { address, isDisconnected } = useAccount();
  const isConnected = address && !isDisconnected;

  // Agent address (can be obtained from backend or contract)
  const agentAddress = '0x330136160d2008AbF5c24d0aFda688A1B5C11c53';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agentRef = useRef<any>(null);
  const threadIdRef = useRef<string>('thread-' + Date.now()); // Generate a unique thread ID
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize Mastra client
  useEffect(() => {
    try {
      // Initialize the Mastra client according to the documentation
      const client = new MastraClient({
        baseUrl:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4111'
            : 'https://api.aladdin.build',
        retries: 3,
        // headers: {
        //   // Include any necessary authentication headers
        //   Authorization: 'Bearer your-api-key', // Replace with your actual API key
        // },
      });

      clientRef.current = client;

      // Get the crypto agent
      const agent = client.getAgent('cryptoAgent'); // Replace with your actual agent ID
      console.log('Agent initialized:', agent);
      agentRef.current = agent;
    } catch (error) {
      console.error('Error initializing client:', error);
    }
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect agent hiring commands in user messages
  const checkForAgentHiringCommand = (message: string): boolean => {
    const trimmedMsg = message.trim().toLowerCase();
    return (
      trimmedMsg === '/hire' ||
      trimmedMsg === '/agent' ||
      trimmedMsg.includes('hire agent') ||
      trimmedMsg.includes('hire a crypto agent') ||
      trimmedMsg.includes('雇佣agent')
    );
  };

  // Detect staking commands in user messages
  const checkForStakingCommand = (message: string): boolean => {
    const trimmedMsg = message.trim().toLowerCase();
    return (
      trimmedMsg.startsWith('/stake') || trimmedMsg.includes('stake tokens')
    );
  };

  // Add staking flow message
  const addStakingMessage = (step: number) => {
    // Create a placeholder message
    const placeholderContent = `Loading staking step ${step}...`;

    // Add message placeholder
    setMessages((prev) => [
      ...prev,
      {
        type: 'ai',
        content: placeholderContent,
        isStakingStep: true,
        stakingStep: step,
        stakingData: {
          amount: stakingData.amount,
          apy: stakingData.apy,
          potentialLoss: stakingData.potentialLoss,
        },
      },
    ]);
  };

  // Agent hiring flow start
  const startAgentHiringFlow = async () => {
    console.log('Starting Agent hiring flow, current data:', hiringData);

    // Ensure default values
    setHiringData((prevData) => {
      const newData = {
        ...prevData,
        amount: prevData.amount || '100',
        duration: prevData.duration || '7',
        totalCost: (
          parseFloat(prevData.amount) * parseInt(prevData.duration, 10)
        ).toString(),
        agentType: prevData.agentType || 'DEFI',
        currentStep: 1,
      };
      console.log('Setting hiring data:', newData);
      return newData;
    });

    // Use setTimeout to ensure state update before adding the hiring message
    setTimeout(() => {
      addAgentHiringMessage(1);
    }, 100);
  };

  // 添加一个ref来跟踪已经添加过的步骤
  const addedHiringSteps = useRef<{ [key: number]: boolean }>({});

  // 修改函数
  const addAgentHiringMessage = (step: number) => {
    // 如果此步骤已添加过消息，则跳过
    if (addedHiringSteps.current[step]) {
      console.log(`步骤 ${step} 的消息已存在，跳过添加`);
      return;
    }

    // 标记这个步骤已被添加
    addedHiringSteps.current[step] = true;

    // 创建消息占位符
    const placeholderContent = `Loading agent hiring step ${step}...`;

    // 添加消息前再次检查是否已存在
    setMessages((prev) => {
      // 检查消息是否已存在
      if (prev.some((msg) => msg.isHiringStep && msg.hiringStep === step)) {
        return prev;
      }

      return [
        ...prev,
        {
          type: 'ai',
          content: placeholderContent,
          isHiringStep: true,
          hiringStep: step,
          hiringData: {
            amount: hiringData.amount,
            duration: hiringData.duration,
            totalCost: hiringData.totalCost,
            agentType: hiringData.agentType,
          },
        },
      ];
    });
  };

  // 更新 ChatPanel.tsx 中的 handleAgentHiringAction 函数
  // 找到 handleAgentHiringAction 函数并替换为以下代码

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAgentHiringAction = (action: string, data?: any) => {
    console.log(
      '处理雇佣操作:',
      action,
      '数据:',
      data,
      '当前状态:',
      hiringData
    );

    switch (action) {
      case 'connect-wallet':
        // ConnectKit will handle wallet connection
        // Just prompt the user
        addAIMessage(
          'Please connect your wallet using the button at the top of the page.'
        );
        break;

      case 'update-duration':
        // Update hiring duration
        if (data && !isNaN(parseInt(data, 10))) {
          setHiringData((prev) => ({
            ...prev,
            duration: data,
          }));
        }
        break;

      // 添加这些处理不同 action 的 case
      case 'update-agent-type':
        if (data) {
          setHiringData((prev) => ({
            ...prev,
            agentType: data,
          }));
        }
        break;

      case 'update-amount':
        if (data && !isNaN(parseFloat(data))) {
          setHiringData((prev) => ({
            ...prev,
            amount: data,
          }));
        }
        break;

      case 'update-total-cost':
        if (data && !isNaN(parseFloat(data))) {
          setHiringData((prev) => ({
            ...prev,
            totalCost: data,
          }));
        }
        break;

      case 'next-step':
        const nextStep = hiringData.currentStep + 1;
        setHiringData((prevData) => ({
          ...prevData,
          currentStep: nextStep,
        }));

        setTimeout(() => {
          addAgentHiringMessage(nextStep);
        }, 100);
        break;

      case 'back':
        const prevStep = hiringData.currentStep - 1;
        if (prevStep >= 1) {
          setHiringData((prevData) => ({
            ...prevData,
            currentStep: prevStep,
          }));

          setTimeout(() => {
            addAgentHiringMessage(prevStep);
          }, 100);
        }
        break;

      case 'engagement-created':
        // 检查是否已经在步骤3，避免重复更新
        if (hiringData.currentStep === 3) {
          console.log('已经在步骤3，跳过状态更新');
          return;
        }

        // 更新状态
        setHiringData((prevData) => ({
          ...prevData,
          currentStep: 3,
        }));

        // 使用状态跟踪变量防止多次添加消息
        const stepToAdd = 3;
        setTimeout(() => {
          // 检查该步骤的消息是否已存在
          const stepExists = messages.some(
            (msg) => msg.isHiringStep && msg.hiringStep === stepToAdd
          );

          if (!stepExists) {
            addAgentHiringMessage(stepToAdd);
          }
        }, 0);
        break;

      case 'engagement-completed':
        // Handle completion of specific ID engagement
        addAIMessage(
          `Engagement ${data.id} has been completed and payment of USDT has been released to the agent. Transaction hash: ${data.txHash}`
        );
        break;

      case 'error':
        // Handle error message
        addErrorMessage(data);
        break;

      case 'complete':
      case 'reset':
        // 清除完整的雇佣数据并结束流程
        setHiringData({
          amount: '100',
          duration: '7',
          totalCost: '700',
          agentType: 'DEFI',
          currentStep: 0,
          totalSteps: 3,
        });

        // 显示完成消息
        if (data && data.message) {
          addAIMessage(data.message);
        } else {
          const completedAmount = hiringData.amount;
          const completedDuration = hiringData.duration;
          const completedType = hiringData.agentType;

          addAIMessage(
            `Agent hiring process completed successfully! You have hired a ${completedType} agent for ${completedDuration} days at a rate of ${completedAmount} USDT per day. The agent will begin work immediately and you can monitor progress in the "My Engagements" section. Let me know if you need anything else.`
          );
        }

        // 清除相关的消息
        setMessages((prev) => prev.filter((msg) => !msg.isHiringStep));
        break;

      default:
        break;
    }
  };

  // Helper function to add AI message
  const addAIMessage = (content: string) => {
    setMessages((prev) => [...prev, { type: 'ai', content }]);
  };

  // Add error message
  const addErrorMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        type: 'ai',
        content: `⚠️ Error: ${content}`,
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    const userMessage = { type: 'user' as const, content: userInput };
    setMessages((prev) => [...prev, userMessage]);

    // Check for staking commands - redirect to agent hiring flow for now
    if (checkForStakingCommand(userInput)) {
      // Instead of starting staking flow, start agent hiring flow
      startAgentHiringFlow();
      setInput('');
      return;
    }

    // Check for agent hiring commands
    if (checkForAgentHiringCommand(userInput)) {
      // Start the agent hiring flow
      startAgentHiringFlow();
      setInput('');
      return;
    }

    // Check if agent is available
    if (!agentRef.current) {
      console.error('Agent not initialized');
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          content:
            'Sorry, the agent is not initialized. Please try again later.',
        },
      ]);
      return;
    }

    // Add a loading message from AI
    const loadingId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { type: 'ai', content: '', isLoading: true, id: loadingId },
    ]);

    setInput('');
    setIsLoading(true);

    try {
      console.log('Agent object:', agentRef.current);
      console.log(
        'Available methods:',
        Object.getOwnPropertyNames(Object.getPrototypeOf(agentRef.current))
      );

      // Try different method names - assuming there's a sendMessage method to replace generate
      const method =
        agentRef.current.sendMessage ||
        agentRef.current.chatCompletion ||
        agentRef.current.complete ||
        agentRef.current.generate;

      if (!method) {
        throw new Error('No suitable method found in agent');
      }

      const response = await method.call(agentRef.current, {
        messages: [
          // Add the new user message
          { role: 'user', content: userInput },
        ],
        threadId: threadIdRef.current,
        temperature: 0, // Add temperature parameter for consistent responses
      });

      console.log('API Response:', response.text);

      try {
        const data = JSON.parse(response.text);
        if (data.type === 'agent_hire' || data.type === 'hire_agent') {
          console.log('Received hiring data:', data);

          // Set default values, ensure data is valid
          const agentType = data.agentType || 'DEFI';
          const ratePerDay = data.ratePerDay || '100';
          const duration = data.duration || '7';

          // Update messages first to avoid state update delay
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingId
                ? {
                    type: 'ai',
                    content:
                      data.message ||
                      `I've prepared an agent hiring proposal for you. You can hire a ${agentType} agent at a rate of ${ratePerDay} USDT per day for ${duration} days. Please review the details and proceed.`,
                    id: response.id,
                    isLoading: false,
                  }
                : msg
            )
          );

          // Then update hiring data
          setHiringData({
            amount: ratePerDay,
            duration: duration,
            totalCost: (
              parseFloat(ratePerDay) * parseInt(duration, 10)
            ).toString(),
            agentType: agentType,
            currentStep: 1,
            totalSteps: 3,
          });

          // Ensure state updates before starting hiring flow
          setTimeout(() => {
            addAgentHiringMessage(1);
          }, 500);
        } else if (data.type === 'stake' || data.type === 'staking') {
          console.log('Received staking data:', data);

          // Set default values for staking
          const amount = data.amount || '1000';
          const apy = data.apy || '10';
          const potentialLoss = data.potentialLoss || '15';

          // Update messages first
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingId
                ? {
                    type: 'ai',
                    content:
                      data.message ||
                      `I've prepared a staking proposal for you. You can stake ${amount} tokens with an expected APY of ${apy}%. Please review the details and proceed.`,
                    id: response.id,
                    isLoading: false,
                  }
                : msg
            )
          );

          // Then update staking data
          setStakingData({
            amount: amount,
            apy: apy,
            potentialLoss: potentialLoss,
            currentStep: 1,
            totalSteps: 3,
          });

          // Ensure state updates before starting staking flow
          setTimeout(() => {
            addStakingMessage(1);
          }, 500);
        } else {
          // Regular message response
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === loadingId
                ? {
                    type: 'ai',
                    content:
                      response.text ||
                      "I'm sorry, I couldn't process that request.",
                    id: response.id,
                    isLoading: false,
                  }
                : msg
            )
          );
        }
      } catch {
        // Not JSON or other error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingId
              ? {
                  type: 'ai',
                  content:
                    response.text ||
                    "I'm sorry, I couldn't process that request.",
                  id: response.id,
                  isLoading: false,
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Replace the loading message with an error message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                type: 'ai',
                content:
                  'Sorry, there was an error processing your request. Please try again.',
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionSelect = (question: string) => {
    setInput(question);
    handleSend();
  };

  // Render message content function
  const renderMessageContent = (message: Message) => {
    if (message.isLoading) {
      return (
        <div className="flex items-center">
          <div className="animate-pulse flex space-x-1">
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      );
    }

    if (message.isHiringStep && message.hiringStep) {
      return (
        <AgentHiringFlow
          hiringData={{
            ...hiringData,
            currentStep: message.hiringStep,
          }}
          isConnected={isConnected}
          address={address}
          agentAddress={agentAddress}
          onAction={handleAgentHiringAction}
        />
      );
    }

    return (
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col relative">
      <div
        ref={chatContainerRef}
        className="absolute inset-x-0 top-0 bottom-16 overflow-y-auto p-5 bg-[#f5f5f5]"
      >
        {messages.map((message, index) => (
          <div key={index}>
            <div
              className={`flex items-start mb-5 ${
                message.type === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`
                w-10 h-10 rounded flex-shrink-0
                ${message.type === 'user' ? 'bg-[#95ec69]' : 'bg-[#1890ff]'}
                flex items-center justify-center text-white text-sm
              `}
              >
                {message.type === 'user' ? '👨🏻' : 'AI'}
              </div>
              <div
                className={`
                relative max-w-[70%] px-4 py-3 mx-3
                ${
                  message.type === 'user'
                    ? 'bg-[#95ec69] rounded-[12px]'
                    : 'bg-white rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]'
                }
              `}
              >
                <div
                  className={`
                  absolute top-[13px] w-0 h-0
                  ${
                    message.type === 'user'
                      ? 'right-[-8px] border-l-[8px] border-l-[#95ec69] border-y-[5px] border-y-transparent'
                      : 'left-[-8px] border-r-[8px] border-r-white border-y-[5px] border-y-transparent'
                  }
                `}
                ></div>
                <div
                  className={`text-[14px] leading-[1.5] ${
                    message.type === 'user' ? 'text-black' : 'text-[#333]'
                  }`}
                >
                  {renderMessageContent(message)}
                </div>
              </div>
            </div>
            {message.showTips && (
              <div className="mt-4 mb-5">
                <QuickQuestions
                  currentLang={currentLang}
                  onSelect={handleQuestionSelect}
                />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 border-t border-[#e1e1e1] bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              currentLang === 'en' ? 'Type your question...' : '输入您的问题...'
            }
            className="flex-1 px-4 py-2 rounded-full border border-[#e1e1e1] focus:outline-none focus:border-[#1890ff] focus:ring-2 focus:ring-[#1890ff]/10 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className={`px-5 py-2 rounded-full ${
              isLoading ? 'bg-[#ccc]' : 'bg-[#1890ff] hover:bg-[#40a9ff]'
            } text-white transition-colors flex items-center gap-2 text-sm`}
            disabled={isLoading}
          >
            <span>
              {isLoading
                ? currentLang === 'en'
                  ? 'Sending...'
                  : '发送中...'
                : currentLang === 'en'
                ? 'Send'
                : '发送'}
            </span>
            {!isLoading && <ArrowRightIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
