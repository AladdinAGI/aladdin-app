export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'zh'],
} as const;

export type Locale = (typeof i18n.locales)[number];

const dictionaries = {
  en: () => import('./locales/en.json').then((module) => module.default),
  zh: () => import('./locales/zh.json').then((module) => module.default),
} as const;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
