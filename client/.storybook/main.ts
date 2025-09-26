import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async config => {
    // Підтримка Tailwind CSS
    return {
      ...config,
      css: {
        ...config.css,
        postcss: {
          plugins: [require('tailwindcss'), require('autoprefixer')],
        },
      },
    };
  },
};

export default config;
