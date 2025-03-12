'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import { useParams } from 'next/navigation';
import { Locale } from '@/app/i18n/config';

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

// 多语言支持
const translations = {
  en: {
    title: 'Top Cryptocurrencies',
    dataSource: 'Data Source: CoinGecko',
    loading: 'Loading...',
  },
  zh: {
    title: '热门加密货币',
    dataSource: '数据来源: CoinGecko',
    loading: '加载中...',
  },
};

export default function CryptoTickerFooter() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // 获取当前语言
  const params = useParams();
  const lang = (params?.lang as Locale) || 'en';
  const t = translations[lang] || translations.en;

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/crypto');
        const data = await response.json();
        setCryptoData(data);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();

    // 设置5分钟刷新一次
    const intervalId = setInterval(fetchCryptoData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // 处理无缝滚动
  useEffect(() => {
    if (!scrollerRef.current || cryptoData.length === 0) return;

    const scrollerContent = scrollerRef.current;
    const scrollDuration = 60000; // 滚动周期增加到60秒，更慢

    // 创建一个CSS动画来处理无缝滚动
    const totalWidth = scrollerContent.scrollWidth / 2;

    // 动态创建滚动动画
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes tickerScroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-${totalWidth}px); }
      }
      
      .ticker-scroll {
        animation: tickerScroll ${scrollDuration}ms linear infinite;
      }
      
      .ticker-scroll:hover {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(styleSheet);

    // 应用动画到滚动容器的子元素
    const scrollContent = scrollerContent.firstElementChild as HTMLElement;
    if (scrollContent) {
      scrollContent.classList.add('ticker-scroll');
    }

    return () => {
      // 清理
      if (styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
      if (scrollContent) {
        scrollContent.classList.remove('ticker-scroll');
      }
    };
  }, [cryptoData]);

  // 格式化价格，添加千位分隔符
  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return price.toFixed(6);
    } else if (price < 1) {
      return price.toFixed(4);
    } else if (price < 10) {
      return price.toFixed(2);
    } else {
      return price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  if (loading && cryptoData.length === 0) {
    return (
      <footer className="sticky bottom-0 left-0 right-0 w-full h-10 bg-[#f0f2f5]/80 backdrop-blur-sm border-t border-gray-200 flex items-center justify-center text-gray-600">
        <div className="animate-pulse">{t.loading}</div>
      </footer>
    );
  }

  // 复制数据以实现无缝滚动效果
  const duplicatedData = [...cryptoData, ...cryptoData];

  return (
    <footer className="sticky bottom-0 left-0 right-0 w-full h-10 bg-[#f0f2f5]/80 backdrop-blur-sm border-t border-gray-200 overflow-hidden">
      <div className="flex items-center h-full">
        {/* 标题部分 */}
        <div className="bg-[#1890ff] h-full flex items-center px-3 text-xs font-medium whitespace-nowrap text-white">
          {t.title}
        </div>

        {/* 滚动价格部分 */}
        <div
          ref={scrollerRef}
          className="h-full flex-1 overflow-x-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          }}
        >
          <div className="inline-flex items-center h-full whitespace-nowrap py-2 px-4">
            {duplicatedData.map((crypto, index) => (
              <div
                key={`${crypto.id}-${index}`}
                className="flex items-center mx-2 first:ml-0"
              >
                <div className="w-4 h-4 relative mr-1">
                  <Image
                    src={crypto.image}
                    alt={crypto.name}
                    fill
                    sizes="16px"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <span className="font-medium text-xs mr-1 text-gray-700">
                  {crypto.symbol.toUpperCase()}
                </span>
                <span className="text-xs text-gray-600">
                  ${formatPrice(crypto.current_price)}
                </span>

                {/* 只保留右侧的价格变动趋势箭头 */}
                <div
                  className={`h-3 w-3 ml-1 flex items-center justify-center rounded-full ${
                    crypto.price_change_percentage_24h >= 0
                      ? 'bg-green-600/20'
                      : 'bg-red-600/20'
                  }`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <ArrowUpIcon className={`w-2 h-2 text-green-500`} />
                  ) : (
                    <ArrowDownIcon className={`w-2 h-2 text-red-500`} />
                  )}
                </div>

                {/* 分隔符，最后一个元素不显示 */}
                {index !== duplicatedData.length - 1 && (
                  <span className="mx-2 text-gray-400">•</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 数据来源 - 在小屏幕上隐藏 */}
        <div className="hidden sm:flex bg-[#f0f2f5]/80 h-full items-center px-4 text-xs text-gray-500 whitespace-nowrap border-l border-gray-200">
          {t.dataSource}
        </div>
      </div>
    </footer>
  );
}
