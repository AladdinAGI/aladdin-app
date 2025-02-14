'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cross2Icon } from '@radix-ui/react-icons';

export default function Header() {
  const [currentLang, setCurrentLang] = useState<'en' | 'zh'>('en');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: { en: 'Home', zh: '首页' } },
    { href: '/staking', label: { en: 'Staking', zh: '质押' } },
    {
      href: '#',
      label: { en: 'Marketplace', zh: '市场' },
      comingSoon: true,
    },
  ];

  const handleNavClick = (link: (typeof navLinks)[0]) => {
    if (link.comingSoon) {
      setShowComingSoon(true);
      setTimeout(() => setShowComingSoon(false), 3000);
      return;
    }
  };

  return (
    <>
      <header className="h-16 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
        <div className="h-full mx-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="m-0">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="Aladdin"
                  width={150}
                  height={29}
                  priority
                />
              </Link>
            </h1>
            <nav className="flex gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.comingSoon) {
                      e.preventDefault();
                      handleNavClick(link);
                    }
                  }}
                  className={`px-4 py-2 rounded transition-colors ${
                    pathname === link.href
                      ? 'bg-[#1890ff] text-white'
                      : 'text-[#333] hover:bg-gray-50'
                  }`}
                >
                  {currentLang === 'en' ? link.label.en : link.label.zh}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center mr-5">
              {/* iOS style language switch */}
              <div
                className="relative h-7 bg-gray-100 rounded-full p-0.5 flex items-center w-[108px] cursor-pointer"
                onClick={() =>
                  setCurrentLang(currentLang === 'en' ? 'zh' : 'en')
                }
              >
                {/* Sliding background */}
                <div
                  className={`
                  absolute w-[52px] h-6 bg-[#1890ff] rounded-full transition-all duration-200 ease-in-out
                  ${currentLang === 'en' ? 'left-0.5' : 'left-[52px]'}
                `}
                />
                {/* Text labels */}
                <span
                  className={`relative z-10 flex-1 text-center text-xs font-medium transition-colors duration-200
                      ${currentLang === 'en' ? 'text-white' : 'text-gray-500'}`}
                >
                  EN
                </span>
                <span
                  className={`relative z-10 flex-1 text-center text-xs font-medium transition-colors duration-200
                      ${currentLang === 'zh' ? 'text-white' : 'text-gray-500'}`}
                >
                  中文
                </span>
              </div>
            </div>
            <button className="px-5 py-2 rounded-full bg-[#1890ff] text-white hover:bg-[#40a9ff] transition-colors text-sm">
              {currentLang === 'en' ? 'Connect Wallet' : '连接钱包'}
            </button>
          </div>
        </div>
      </header>

      {/* Coming Soon Alert */}
      {showComingSoon && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <span>{currentLang === 'en' ? 'Coming Soon!' : '即将上线！'}</span>
          <button
            onClick={() => setShowComingSoon(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <Cross2Icon className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
