'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon,
} from '@radix-ui/react-icons';
import { getDictionary } from '@/app/i18n/config';
import { Locale } from '@/app/i18n/config';
import { Dictionary } from '@/types';
import CryptoTickerFooter from '@/components/common/CryptoTickerFooter';
// import CryptoTickerFooter from '@/components/common/CryptoTickerFooter';

// 增强字典类型以包含登录页面所需的翻译
interface LoginDictionary extends Dictionary {
  login: {
    title: string;
    register_title: string;
    email_placeholder: string;
    password_placeholder: string;
    confirm_password: string;
    username_placeholder: string;
    login_button: string;
    register_button: string;
    processing: string;
    show_password: string;
    hide_password: string;
    google_login: string;
    google_register: string;
    no_account: string;
    has_account: string;
    register_now: string;
    go_to_login: string;
    forgot_password: string;
    error_required_fields: string;
    error_passwords_mismatch: string;
    error_invalid_credentials: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as Locale) || 'en';

  const [loginMode, setLoginMode] = useState(true); // true for login, false for register
  const [formData, setFormData] = useState({
    email: 'zhijia@aladdin.build',
    password: 'zhijia@aladdin.buildxx',
    confirmPassword: '',
    username: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dictionary, setDictionary] = useState<LoginDictionary | null>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      const dict = (await getDictionary(lang)) as LoginDictionary;
      setDictionary(dict);
    };
    loadDictionary();
  }, [lang]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!dictionary) return;

    // 模拟验证和API调用
    try {
      if (loginMode) {
        // 登录流程
        if (
          formData.email === 'zhijia@aladdin.build' &&
          formData.password === 'zhijia@aladdin.buildxx'
        ) {
          // 登录成功
          setTimeout(() => {
            setLoading(false);
            router.push(`/${lang}`); // 跳转到首页
          }, 1000);
        } else {
          throw new Error(dictionary.login.error_invalid_credentials);
        }
      } else {
        // 注册流程
        if (!formData.email || !formData.password || !formData.username) {
          throw new Error(dictionary.login.error_required_fields);
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error(dictionary.login.error_passwords_mismatch);
        }
        // 模拟注册成功
        setTimeout(() => {
          setLoading(false);
          setLoginMode(true); // 切换回登录模式
          setError('');
        }, 1000);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };

  const toggleMode = () => {
    setLoginMode(!loginMode);
    setError('');
  };

  const switchLanguage = () => {
    const newLang = lang === 'en' ? 'zh' : 'en';
    router.push(`/${newLang}/login`);
  };

  if (!dictionary) return null;

  return (
    <>
      <div className="min-h-screen bg-[#f0f2f5] flex flex-col justify-center items-center px-4 py-8">
        {/* 语言切换按钮 */}
        <div className="absolute top-4 right-4">
          <button
            onClick={switchLanguage}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-sm font-medium hover:bg-gray-50 transition-colors"
            aria-label={`Switch to ${lang === 'en' ? '中文' : 'English'}`}
          >
            {lang === 'en' ? '中' : 'EN'}
          </button>
        </div>

        <div className="w-full max-w-md bg-white rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.1)] overflow-hidden">
          {/* Logo 区域 */}
          <div className="flex justify-center mt-8 mb-4">
            <div className="relative w-40 sm:w-48 h-12">
              <Image
                src="/logo.svg"
                alt="Logo"
                fill
                sizes="(max-width: 640px) 160px, 192px"
                priority
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
              />
            </div>
          </div>

          <div className="px-6 pt-2 pb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-6">
              {loginMode
                ? dictionary.login.title
                : dictionary.login.register_title}
            </h1>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* 注册模式下额外显示用户名输入框 */}
              {!loginMode && (
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <PersonIcon className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder={dictionary.login.username_placeholder}
                      className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1890ff] focus:border-[#1890ff]"
                    />
                  </div>
                </div>
              )}

              {/* 邮箱输入框 */}
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <EnvelopeClosedIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={dictionary.login.email_placeholder}
                    className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1890ff] focus:border-[#1890ff]"
                  />
                </div>
              </div>

              {/* 密码输入框 */}
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <LockClosedIcon className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={dictionary.login.password_placeholder}
                    className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1890ff] focus:border-[#1890ff]"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword
                      ? dictionary.login.hide_password
                      : dictionary.login.show_password}
                  </button>
                </div>
              </div>

              {/* 注册模式下的确认密码输入框 */}
              {!loginMode && (
                <div className="mb-4">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <LockClosedIcon className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={dictionary.login.confirm_password}
                      className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1890ff] focus:border-[#1890ff]"
                    />
                  </div>
                </div>
              )}

              {/* 登录/注册按钮 */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#1890ff] text-white py-2 rounded-md font-medium mt-2 transition-opacity ${
                  loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                {loading
                  ? dictionary.login.processing
                  : loginMode
                  ? dictionary.login.login_button
                  : dictionary.login.register_button}
              </button>

              {/* 谷歌登录/注册按钮 */}
              <button
                type="button"
                className="w-full mt-3 bg-white border border-gray-300 text-gray-700 py-2 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {loginMode
                  ? dictionary.login.google_login
                  : dictionary.login.google_register}
              </button>
            </form>

            {/* 模式切换链接 */}
            <div className="text-center mt-4 text-sm">
              {loginMode
                ? dictionary.login.no_account
                : dictionary.login.has_account}
              <button
                type="button"
                onClick={toggleMode}
                className="text-[#1890ff] hover:underline ml-1"
              >
                {loginMode
                  ? dictionary.login.register_now
                  : dictionary.login.go_to_login}
              </button>
            </div>

            {/* 忘记密码链接 - 仅在登录模式显示 */}
            {loginMode && (
              <div className="text-center mt-2 text-sm">
                <Link
                  href={`/${lang}/forgot-password`}
                  className="text-[#1890ff] hover:underline"
                >
                  {dictionary.login.forgot_password}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 底部版权信息 */}
        <p className="mt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Aladdin Build. All rights reserved.
        </p>
      </div>
      <CryptoTickerFooter />
    </>
  );
}
