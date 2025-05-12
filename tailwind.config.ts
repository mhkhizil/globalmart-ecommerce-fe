import type { Config } from 'tailwindcss';
const { fontFamily } = require('tailwindcss/defaultTheme');

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/[lang]/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/webpages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'category-card': '0px 4px 24px 0px #1111110A',
        'product-preview-card': '6px 6px 60px 0px #0000000A',
        'cart-item-box': '6px 6px 60px 0px #0000000A',
        'order-card-box': '6px 6px 60px 0px #00000014',
      },
      fontFamily: {
        poppins: ['Poppins'],
        merienda: ['Merienda'],
        montserrat: ['Montserrat', ...fontFamily.sans],
      },
      scrollbar: {
        none: {
          '::-webkit-scrollbar': { display: 'none' },
          '-ms-overflow-style': 'none', // IE and Edge
          'scrollbar-width': 'none', // Firefox
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-15deg)' },
          '50%': { transform: 'rotate(15deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  darkMode: ['class', 'class'],
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar'),
  ],
} satisfies Config;
