'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Locale } from '@/app/i18n/config';
import { getDictionary } from '@/app/i18n/config';
import { Dictionary } from '@/types';
import { ConnectButton } from './ConnectButton';

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
    href: '/staking',
    pathMatch: '/staking',
    label: t.nav.staking,
  },
  {
    href: '#',
    pathMatch: '/marketplace',
    label: t.nav.marketplace,
    comingSoon: true,
  },
];

interface HeaderProps {
  lang: Locale;
}

export default function Header({ lang }: HeaderProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const loadDictionary = async () => {
      const dict = await getDictionary(lang);
      setDictionary(dict);
      setNavLinks(createNavLinks(dict));
    };
    loadDictionary();
  }, [lang]);

  const handleNavClick = (link: NavLink, e: React.MouseEvent) => {
    if (link.comingSoon) {
      e.preventDefault();
      setShowComingSoon(true);
      setTimeout(() => setShowComingSoon(false), 3000);
    }
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
      <header className="h-16 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]">
        <div className="h-full mx-6 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="m-0">
              <Link href="/">
                <Image
                  src="/logo.svg"
                  alt="Logo"
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
                  onClick={(e) => handleNavClick(link, e)}
                  className={`px-4 py-2 rounded transition-colors ${
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

          <div className="flex items-center gap-5">
            <div className="flex items-center mr-5">
              <div
                className="relative h-7 bg-gray-100 rounded-full p-0.5 flex items-center w-[108px] cursor-pointer"
                onClick={switchLanguage}
              >
                <div
                  className={`
                    absolute w-[52px] h-6 bg-[#1890ff] rounded-full transition-all duration-200 ease-in-out
                    ${lang === 'en' ? 'left-0.5' : 'left-[52px]'}
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

            {/* <button className="px-5 py-2 rounded-full bg-[#1890ff] text-white hover:bg-[#40a9ff] transition-colors text-sm">
              {dictionary.button.connect_wallet}
            </button> */}

            <ConnectButton connectText={dictionary.button.connect_wallet} />
          </div>
        </div>
      </header>

      {showComingSoon && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <span>{dictionary.alert.coming_soon}</span>
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
