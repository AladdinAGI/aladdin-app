'use client';

import { useState } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { QuickQuestions } from './QuickQuestions';

interface Message {
  type: 'user' | 'ai';
  content: string;
  showTips?: boolean; // 添加属性来控制是否显示提示词
}

export default function MainChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'ai',
      content:
        "👋 Hello! I'm Aladdin AI Assistant, I can help you: 👋 您好！我是 Aladdin AI 助手，可以帮您：",
      showTips: true, // 只在第一条消息显示提示词
    },
  ]);
  const [input, setInput] = useState('');
  const [currentLang] = useState<'en' | 'zh'>('en');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: 'user', content: input }]);
    setInput('');
    // 模拟AI回复
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          content: `I understand you're asking about...`,
        },
      ]);
    }, 1000);
  };

  const handleQuestionSelect = (question: string) => {
    setInput(question);
    handleSend();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-5 bg-[#f5f5f5]">
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
                  {message.content}
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
      </div>

      <div className="p-4 border-t border-[#e1e1e1] bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 px-4 py-2 rounded-full border border-[#e1e1e1] focus:outline-none focus:border-[#1890ff] focus:ring-2 focus:ring-[#1890ff]/10 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-5 py-2 rounded-full bg-[#1890ff] text-white hover:bg-[#40a9ff] transition-colors flex items-center gap-2 text-sm"
          >
            <span>Send</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
