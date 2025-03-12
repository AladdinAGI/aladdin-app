'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Locale } from '@/app/i18n/config';
import { getDictionary } from '@/app/i18n/config';
import { Dictionary } from '@/types';
import { ConnectKitButton } from 'connectkit';

export interface NavLink {
  href: string;
  pathMatch: string;
  label: string;
  comingSoon?: boolean;
}

const createNavLinks = (t: Dictionary): NavLink[] => [
  {
    href: '/',
    pathMatch: '/',
    label: t.nav.home,
  },
  {
    href: '/marketplace',
    pathMatch: '/marketplace',
    label: t.nav.marketplace,
    comingSoon: true,
  },
  {
    href: '/staking',
    pathMatch: '/staking',
    label: t.nav.staking,
  },
  {
    href: '/professional',
    pathMatch: '/professional',
    label: t.nav.professional,
  },
];

interface HeaderProps {
  lang: Locale;
}

export default function Header({ lang }: HeaderProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // useEffect(() => {
  //   const originalConsoleError = console.error;
  //   console.error = (...args) => {
  //     console.log('Intercepted console.error args:🐻', args);
  //     const errorMessage = args[0];

  //     if (typeof errorMessage === 'string') {
  //       // 匹配带 %s 的模板字符串
  //       if (
  //         errorMessage.includes(
  //           'An empty string ("") was passed to the %s attribute'
  //         )
  //       ) {
  //         return; // 屏蔽这个错误
  //       }
  //     }
  //     // 其他错误正常输出
  //     originalConsoleError.apply(console, args);
  //   };

  //   // 清理函数
  //   return () => {
  //     console.error = originalConsoleError;
  //   };
  // }, []);

  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
      setNavLinks(createNavLinks(dict));
    };
    loadDictionary();
  }, [lang]);

  // 当路由变化时关闭移动菜单
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleNavClick = (link: NavLink, e: React.MouseEvent) => {
    console.log(link, e);
    // if (link.comingSoon) {
    //   e.preventDefault();
    //   setShowComingSoon(true);
    //   setTimeout(() => setShowComingSoon(false), 3000);
    // }
  };

  const switchLanguage = () => {
    const newLang = lang === 'en' ? 'zh' : 'en';
    // 获取当前路径，并确保以 / 开头
    const currentPath = pathname.replace(`/${lang}`, '') || '/';
    router.push(`/${newLang}${currentPath}`);
  };

  const isActivePath = (pathMatch: string) => {
    const currentPath = pathname.replace(`/${lang}`, '') || '/';
    return pathMatch === currentPath;
  };

  if (!dictionary) return null;

  return (
    <>
      <header className="h-14 sm:h-16 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)] relative z-30">
        <div className="h-full mx-auto px-3 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="m-0">
              <Link href="/" className="flex items-center">
                <div className="relative w-28 sm:w-32 md:w-36 lg:w-40 h-7 sm:h-8">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    fill
                    sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, (max-width: 1024px) 144px, 160px"
                    priority
                    style={{
                      objectFit: 'contain',
                      objectPosition: 'left center',
                    }}
                  />
                </div>
              </Link>
            </h1>

            {/* 桌面导航 - 在中等屏幕及以上显示 */}
            <nav className="hidden md:flex ml-4 lg:ml-8 gap-2 lg:gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(link, e)}
                  className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded text-sm lg:text-base whitespace-nowrap transition-colors ${
                    isActivePath(link.pathMatch)
                      ? 'bg-[#1890ff] text-white'
                      : 'text-[#333] hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
            {/* 语言切换 - 桌面版使用滑块 */}
            <div className="hidden sm:flex items-center">
              <div
                className="relative h-7 bg-gray-100 rounded-full p-0.5 flex items-center w-[90px] lg:w-[108px] cursor-pointer"
                onClick={switchLanguage}
              >
                <div
                  className={`
                    absolute w-[43px] lg:w-[52px] h-6 bg-[#1890ff] rounded-full transition-all duration-200 ease-in-out
                    ${lang === 'en' ? 'left-0.5' : 'left-[43px] lg:left-[52px]'}
                  `}
                />
                <span
                  className={`relative z-10 flex-1 text-center text-xs font-medium transition-colors duration-200
                    ${lang === 'en' ? 'text-white' : 'text-gray-500'}`}
                >
                  EN
                </span>
                <span
                  className={`relative z-10 flex-1 text-center text-xs font-medium transition-colors duration-200
                    ${lang === 'zh' ? 'text-white' : 'text-gray-500'}`}
                >
                  中文
                </span>
              </div>
            </div>

            {/* 语言切换 - 移动端使用圆形图标 */}
            <div className="sm:hidden flex items-center">
              <button
                onClick={switchLanguage}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium hover:bg-gray-200 transition-colors"
                aria-label={`切换到${lang === 'en' ? '中文' : '英文'}`}
              >
                {lang === 'en' ? '中' : 'EN'}
              </button>
            </div>

            {/* 连接钱包按钮 - 响应式调整 */}
            <div className="hidden sm:block">
              <ConnectKitButton
                label={dictionary.button.connect_wallet}
                customTheme={{
                  // 自定义按钮样式，确保中英文显示合适
                  '--ck-connectbutton-font-size': '14px',
                  '--ck-connectbutton-border-radius': '6px',
                  '--ck-connectbutton-padding': '8px 12px',
                  '--ck-connectbutton-height': '36px',
                  // 可以根据需要添加更多样式
                }}
              />
            </div>

            {/* 简化的连接钱包按钮 - 仅在小屏幕上显示 */}
            <div className="sm:hidden">
              <ConnectKitButton
                customTheme={{
                  '--ck-connectbutton-height': '32px',
                  '--ck-connectbutton-font-size': '12px', // 移动端下文字小一点
                  '--ck-connectbutton-padding': '6px 12px', // 增加水平内边距使按钮更宽
                  '--ck-connectbutton-width': 'auto', // 确保按钮可以自适应文本宽度
                  '--ck-connectbutton-min-width': '120px', // 设置最小宽度
                }}
              />
            </div>

            {/* 汉堡菜单按钮 - 仅在中等屏幕以下显示 */}
            <button
              className="md:hidden p-1.5 text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="菜单"
            >
              <HamburgerMenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 移动导航抽屉背景遮罩 */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* 移动导航抽屉 */}
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-base font-medium">
              {lang === 'en' ? 'Menu' : '菜单'}
            </h2>
            <button
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="关闭菜单"
            >
              <Cross2Icon className="w-4 h-4" />
            </button>
          </div>

          <nav className="p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(link, e)}
                className={`px-4 py-2.5 rounded text-sm transition-colors ${
                  isActivePath(link.pathMatch)
                    ? 'bg-[#1890ff] text-white'
                    : 'text-[#333] hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Coming Soon 提示 */}
      {showComingSoon && (
        <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 z-50 text-sm sm:text-base max-w-[90%] sm:max-w-md">
          <span>{dictionary.alert.coming_soon}</span>
          <button
            onClick={() => setShowComingSoon(false)}
            className="text-white/60 hover:text-white transition-colors ml-auto"
            aria-label="关闭提示"
          >
            <Cross2Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}
    </>
  );
}
