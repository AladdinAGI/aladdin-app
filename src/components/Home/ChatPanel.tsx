'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { QuickQuestions } from './QuickQuestions';
import { MastraClient } from '@mastra/client-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useAtom } from 'jotai';
import { stakingParamsAtom, stakingStateAtom } from '@/store';
import AlertDialogComponent, { AlertDialogProps } from '../ui/AlertDialog';
import { StakingButton } from '../staking/StakingButton';
import DeFiPieChart from '@/components/dashboard/DeFiPieChart';
import PriceHistoryChart from '@/components/dashboard/PriceHistoryChart';
import Image from 'next/image';
import useWalletInfo from '@/hooks/useWalletInfo';
import { useHistory } from '@/hooks/useHistory';
//checkForStakingCommand
import { parseInvestmentInfo } from '@/utils/idnex';
// import { HistoryEventBus } from './HistoryPanel';
// DeFi Chart data interface
interface DeFiChartData {
  type: string;
  data: {
    name: string;
    value: number;
  }[];
}

// Price History Chart data interface
interface PriceHistoryData {
  type: string;
  data: {
    date: string;
    price: number;
  }[];
}

// 消息接口
interface Message {
  type: 'user' | 'ai';
  content: string;
  showTips?: boolean;
  id?: string;
  isLoading?: boolean;
  stakingParams?: {
    amount: string;
    apy: string;
    riskTolerance: string;
  };
  defiChartData?: DeFiChartData | null; // Allow null for DeFi chart data
  priceHistoryData?: PriceHistoryData | null; // Added price history data
}

export default function MainChat() {
  const { address, isConnected, ensName, ensAvatar } = useWalletInfo();
  const [avatarUrl, setAvatarUrl] = useState('/images/metamask.png');
  const { addToHistory } = useHistory();
  // useEffect(() => {
  //   const unsubscribe = HistoryEventBus.onSelectQuestion((question) => {
  //     setInput(question);
  //     // Optional: Focus the input after selecting a history item
  //     const inputEl = document.querySelector(
  //       'input[type="text"]'
  //     ) as HTMLInputElement;
  //     if (inputEl) {
  //       inputEl.focus();
  //     }
  //   });

  //   return unsubscribe;
  // }, []);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content: `👋Hello! I'm Aladdin AI Assistant, I can help you with hiring AI agents for cryptocurrency management.`,
      showTips: true,
    },
  ]);
  const [, setStakingParams] = useAtom(stakingParamsAtom);
  // Alert dialog state
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  //setAlertProps
  const [alertProps] = useState<Omit<AlertDialogProps, 'isOpen' | 'onClose'>>({
    title: '',
    message: '',
    type: 'info',
    confirmText: 'OK',
    showCancel: false,
  });

  const [input, setInput] = useState('');
  const [currentLang] = useState<'en' | 'zh'>('en');
  const [isLoading, setIsLoading] = useState(false);
  // 使用 jotai 状态管理器
  const [, setStakingState] = useAtom(stakingStateAtom);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agentRef = useRef<any>(null);
  const threadIdRef = useRef<string>('thread-' + Date.now()); // 生成唯一线程ID
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    console.log('🐻🐻🐻🐻', ensName, ensAvatar);
    if (isConnected && address && ensName && ensAvatar) {
      setAvatarUrl(ensAvatar);
    }
  }, [address, ensAvatar, ensName, isConnected]);

  // 初始化 Mastra 客户端
  useEffect(() => {
    try {
      // 根据文档初始化 Mastra 客户端
      const client = new MastraClient({
        baseUrl:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:4111'
            : 'https://api.aladdin.build',
        retries: 3,
      });

      clientRef.current = client;

      // 获取加密代理
      const agent = client.getAgent('cryptoAgent'); // 替换为实际的代理ID
      console.log('Agent initialized:', agent);
      agentRef.current = agent;
    } catch (error) {
      console.error('Error initializing client:', error);
    }
  }, []);

  // 新消息自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check if the message is about DeFi Protocol Analysis
  const checkForDeFiAnalysisQuery = (message: string): boolean => {
    const trimmedMsg = message.trim().toLowerCase();
    return (
      trimmedMsg.includes('defi') ||
      trimmedMsg.includes('protocol') ||
      trimmedMsg.includes('tvl') ||
      trimmedMsg.includes('yield')
    );
  };

  // Check if the message is about Price History
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkForPriceHistoryQuery = (message: string): boolean => {
    // const trimmedMsg = message.trim().toLowerCase();
    // return (
    //   trimmedMsg.includes('price history') ||
    //   trimmedMsg.includes('historical price') ||
    //   trimmedMsg.includes('price chart') ||
    //   (trimmedMsg.includes('price') &&
    //     (trimmedMsg.includes('7 day') ||
    //       trimmedMsg.includes('30 day') ||
    //       trimmedMsg.includes('week') ||
    //       trimmedMsg.includes('month')))
    // );
    return true;
  };

  // const parseStakingCommand = (message: string) => {
  //   console.log('🐻🐻🐻🐻🐻', message);
  //   const amount = message.match(/amount\s*\[(\d+)\]/i)?.[1];
  //   const apy = message.match(/APY\s*\[(\d+(?:\.\d+)?)\]/i)?.[1];
  //   const riskTolerance = message.match(
  //     /riskTolerance\s*\[(\d+(?:\.\d+)?)\]/i
  //   )?.[1];

  //   if (!amount || !apy || !riskTolerance) {
  //     let errorMsg = 'Failed to parse command: ';
  //     const errorParams = [];

  //     if (!amount) errorParams.push('amount');
  //     if (!apy) errorParams.push('APY');
  //     if (!riskTolerance) errorParams.push('riskTolerance');

  //     errorMsg += errorParams.join(', ') + ' parameter(s) not found';

  //     // Show error dialog using component state
  //     setAlertProps({
  //       title: 'Error',
  //       message: errorMsg,
  //       type: 'error',
  //       confirmText: 'OK',
  //       showCancel: false,
  //     });
  //     setAlertOpen(true);
  //     console.log('🐻🐻🐻🐻🐻🐻', amount, apy, riskTolerance);

  //     return {
  //       amount,
  //       apy,
  //       riskTolerance,
  //       success: false,
  //     };
  //   }
  //   setStakingParams((draft) => {
  //     draft.amount = amount;
  //     draft.apy = apy;
  //     draft.riskTolerance = riskTolerance;
  //   });
  //   return {
  //     amount,
  //     apy,
  //     riskTolerance,
  //     success: true,
  //   };
  // };

  // Parse DeFi Chart data from AI response
  const parseDeFiChartData = (content: string): DeFiChartData | null => {
    try {
      // Look for JSON object between ```json and ```
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) return null;

      const jsonStr = jsonMatch[1];
      const chartData = JSON.parse(jsonStr);

      if (chartData.type === 'defi_chart' && Array.isArray(chartData.data)) {
        return chartData as DeFiChartData;
      }

      return null;
    } catch (error) {
      console.error('Error parsing DeFi chart data:', error);
      return null;
    }
  };

  // Parse Price History data from AI response
  const parsePriceHistoryData = (content: string): PriceHistoryData | null => {
    try {
      // Look for JSON object between ```json and ```
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) return null;

      const jsonStr = jsonMatch[1];
      const chartData = JSON.parse(jsonStr);

      if (chartData.type === 'price_chart' && Array.isArray(chartData.data)) {
        return chartData as PriceHistoryData;
      }

      return null;
    } catch (error) {
      console.error('Error parsing Price History chart data:', error);
      return null;
    }
  };

  // 处理质押命令
  // const handleStakingCommand = (message: string) => {
  //   const params = parseStakingCommand(message);

  //   if (params.success) {
  //     console.log('🐻--->: ', params);
  //     // 更新 jotai 状态
  //     // setStakingState(true);
  //     addAIMessage(
  //       `I've prepared a staking proposal for you. You can stake ${params.amount} USDT with an expected APY of ${params.apy}%. Please visit the Staking tab to complete the process.`
  //     );
  //     // 添加回复消息
  //     addAIMessage(
  //       `I've prepared a staking proposal for you. You can stake ${params.amount} USDT with an expected APY of ${params.apy}%. Please visit the Staking tab to complete the process.`
  //     );
  //   } else {
  //     addAIMessage(
  //       'Sorry, I could not process your request. Please try again.'
  //     );
  //   }
  // };

  // 处理质押按钮点击
  const handleStakingButton = (params: {
    amount: string;
    apy: string;
    riskTolerance: string;
  }) => {
    // 更新质押参数
    setStakingParams((draft) => {
      draft.amount = params.amount;
      draft.apy = params.apy;
      draft.riskTolerance = params.riskTolerance;
    });

    // 更新质押状态，激活质押UI
    setStakingState(true);

    // 添加确认消息
    addAIMessage(
      `Great! I'm setting up a staking plan for ${params.amount} USDT targeting a ${params.apy}% return with a risk tolerance of ${params.riskTolerance}%. Please check the Staking tab to complete the process.`
    );
  };

  const addAIMessage = (content: string, stakingParams = null) => {
    setMessages((prev) => [
      ...prev,
      {
        type: 'ai',
        content,
        stakingParams: stakingParams || undefined, // 添加质押参数
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();

    const userMessage = { type: 'user' as const, content: userInput };

    // Add to history
    addToHistory(userInput);

    setMessages((prev) => [...prev, userMessage]);

    // 检查质押命令格式 (/stake)
    // if (checkForStakingCommand(userInput)) {
    //   handleStakingCommand(userInput);
    //   setInput('');
    //   return;
    // }
    const params = parseInvestmentInfo(userInput);
    if (params) {
      setInput('');
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          content: 'Coming Soon',
        },
      ]);
      return;
    }
    // 检查代理是否可用
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

    // 添加AI的加载消息
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

      // 尝试不同的方法名 - 假设有一个sendMessage方法来替代generate
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
          // 添加新的用户消息
          { role: 'user', content: userInput },
        ],
        threadId: threadIdRef.current,
        temperature: 0, // 添加温度参数以获得一致的回复
      });

      console.log('API Response:', response.text);

      // Check if the response contains DeFi chart data or Price History data
      const isDeFiQuery = checkForDeFiAnalysisQuery(userInput);
      const isPriceHistoryQuery = checkForPriceHistoryQuery(userInput);

      let defiChartData = null;
      let priceHistoryData = null;

      if (isDeFiQuery) {
        defiChartData = parseDeFiChartData(response.text);
      }

      if (isPriceHistoryQuery) {
        priceHistoryData = parsePriceHistoryData(response.text);
      }

      try {
        const data = JSON.parse(response.text);
        if (data.type === 'stake' || data.type === 'staking') {
          //本地消息拦截
          console.log('Received staking data:', data);
        } else {
          // 常规消息响应
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
                    defiChartData: defiChartData,
                    priceHistoryData: priceHistoryData, // Add price history data
                  }
                : msg
            )
          );
        }
      } catch {
        // 非JSON或其他错误 - 更新消息并添加图表数据（如果有）
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
                  defiChartData: defiChartData,
                  priceHistoryData: priceHistoryData, // Add price history data
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // 将加载消息替换为错误消息
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
    setTimeout(() => {
      handleSend();
    }, 10);
  };

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

    // 获取消息前一条的内容
    const currentIndex = messages.findIndex((m) => m === message);
    const previousMessage =
      currentIndex > 0 ? messages[currentIndex - 1] : null;

    // 检查前一条消息是否是质押请求
    const isPreviousStakingRequest =
      previousMessage &&
      previousMessage.type === 'user' &&
      previousMessage.content.includes('USDT') &&
      previousMessage.content.includes('return') &&
      previousMessage.content.includes('risk tolerance');

    // 从质押请求中提取参数
    let stakingParams = null;
    if (isPreviousStakingRequest && previousMessage) {
      // 提取金额
      const amountMatch = previousMessage.content.match(
        /(\d{1,3}(,\d{3})*|\d+)\s*USDT/i
      );
      // 提取收益目标
      const returnMatch = previousMessage.content.match(
        /(\d+(?:\.\d+)?)%\s*(?:return|yield|apy)/i
      );
      // 提取风险容忍度
      const riskMatch = previousMessage.content.match(
        /risk\s+tolerance\s*(?:is|of)?\s*(\d+(?:\.\d+)?)%/i
      );

      const amount = amountMatch ? amountMatch[1].replace(/,/g, '') : '';
      const apy = returnMatch ? returnMatch[1] : '';
      const riskTolerance = riskMatch ? riskMatch[1] : '';

      if (amount && apy && riskTolerance) {
        stakingParams = { amount, apy, riskTolerance };
      }
    }

    // 只有当当前消息是AI回复，且前一条是质押请求，且成功提取参数时，才显示按钮
    // const showStakingButton =
    //   message.type === 'ai' &&
    //   !message.isLoading &&
    //   isPreviousStakingRequest &&
    //   stakingParams?.apy !== undefined &&
    //   Number(stakingParams.apy) < 10 &&
    //   stakingParams;
    const showStakingButton = false;

    // Check if we should display the DeFi chart
    const showDeFiChart =
      message.type === 'ai' && message.defiChartData && !message.isLoading;

    // Check if we should display the Price History chart
    const showPriceHistoryChart =
      message.type === 'ai' && message.priceHistoryData && !message.isLoading;

    // Prepare the content by removing the JSON data if present
    let displayContent = message.content;
    if (showDeFiChart || showPriceHistoryChart) {
      // Remove JSON code block from the content
      displayContent = displayContent.replace(/```json\n[\s\S]*?\n```/, '');
    }

    return (
      <div className="prose prose-sm max-w-none">
        {showPriceHistoryChart && message.priceHistoryData && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
            <PriceHistoryChart data={message.priceHistoryData.data} />
          </div>
        )}

        {showDeFiChart && message.defiChartData && (
          <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              DeFi Protocol Analysis
            </h3>
            <DeFiPieChart data={message.defiChartData.data} />
          </div>
        )}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            table: ({ ...props }) => (
              <table
                className="min-w-full border border-gray-300 text-sm text-center my-2 rounded"
                {...props}
              />
            ),
            hr: () => (
              <hr className="my-2 border-0 h-[1px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
            ),
            thead: ({ ...props }) => (
              <thead className="bg-gray-100 text-gray-700" {...props} />
            ),
            tr: ({ ...props }) => (
              <tr className="border-b hover:bg-gray-50" {...props} />
            ),
            th: ({ ...props }) => (
              <th className="px-4 py-2 font-medium border" {...props} />
            ),
            td: ({ ...props }) => (
              <td className="px-4 py-2 border" {...props} />
            ),
            img: ({ ...props }) => (
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img className="inline-block w-6 h-6 align-middle" {...props} />
            ),
          }}
        >
          {displayContent}
        </ReactMarkdown>
        {showStakingButton && stakingParams && (
          <StakingButton
            onClick={() => handleStakingButton(stakingParams)}
            amount={Number(stakingParams.amount)}
            apy={Number(stakingParams.apy)}
            riskTolerance={Number(stakingParams.riskTolerance)}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {' '}
      <div className="h-full flex flex-col relative">
        <div
          ref={chatContainerRef}
          className="absolute inset-x-0 top-0 bottom-16 overflow-y-auto p-5 bg-[#f5f5f5]"
          style={{ willChange: 'transform' }}
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

              ${
                message.type === 'user'
                  ? 'bg-[#95ec69] rounded-[6px]'
                  : 'bg-[#F4F2FF] rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]'
              }
              flex items-center justify-center text-white text-sm
            `}
                >
                  {/* ${message.type === 'user' ? 'bg-[#95ec69]' : 'bg-[#1890ff]'} */}
                  {message.type === 'user' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt="AI"
                      className="w-full h-full object-cover rounded-[6px]"
                      width={64}
                      height={64}
                    ></img>
                  ) : (
                    <Image
                      src="/images/aladdin.png"
                      alt="AI"
                      className="w-full h-full object-cover"
                      width={64}
                      height={64}
                    ></Image>
                  )}
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
                currentLang === 'en'
                  ? 'Type your question...'
                  : '输入您的问题...'
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
      <AlertDialogComponent
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        {...alertProps}
      />
    </>
  );
}
