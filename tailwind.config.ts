import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1890ff',
          hover: '#40a9ff',
          light: '#e6f7ff',
        },
        success: {
          DEFAULT: '#52c41a',
          hover: '#73d13d',
          light: '#f6ffed',
        },
        warning: {
          DEFAULT: '#faad14',
          hover: '#ffc53d',
          light: '#fff7e6',
        },
        error: {
          DEFAULT: '#f5222d',
          hover: '#ff4d4f',
          light: '#fff1f0',
        },
        gray: {
          50: '#f8f9fa',
          100: '#f0f0f0',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'loading-dot': 'loading 1.4s infinite ease-in-out both',
      },
      keyframes: {
        loading: {
          '0%, 80%, 100%': {
            transform: 'scale(0.6)',
            opacity: '0.4',
          },
          '40%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
