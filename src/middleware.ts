import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n, Locale } from './app/i18n/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 检查请求路径是否已包含语言代码
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 处理不是多语言资源的路径
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('/api/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (pathnameIsMissingLocale) {
    // 从 URL 获取当前语言
    const currentLang = pathname.split('/')[1];
    // 从 cookie 获取用户的语言偏好
    let locale = request.cookies.get('NEXT_LOCALE')?.value;

    // 如果 cookie 不存在，使用当前语言或默认语言
    if (!locale) {
      locale = i18n.locales.includes(currentLang as Locale)
        ? (currentLang as Locale)
        : i18n.defaultLocale;
    }

    // 设置新的 URL
    const newUrl = new URL(`/${locale}${pathname}`, request.url);

    // 创建响应
    const response = NextResponse.redirect(newUrl);

    // 保存语言偏好到 cookie
    response.cookies.set('NEXT_LOCALE', locale);

    return response;
  }

  // 如果路径已包含语言代码，更新 cookie
  const locale = pathname.split('/')[1];
  if (i18n.locales.includes(locale as Locale)) {
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', locale);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
