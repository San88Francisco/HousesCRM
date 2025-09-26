// import type { Meta, StoryObj } from '@storybook/nextjs-vite';

// import { fn } from 'storybook/test';

// import { Button } from './Button';

// // Базова конфігурація (мета-інформація) для Storybook
// // `meta` описує: назву сторі, компонент, параметри, аргументи та документацію
// const meta = {
//   title: 'Приклад/Button', // Назва розділу та сторі у Storybook
//   component: Button, // Компонент, для якого створюємо сторі
//   parameters: {
//     // Параметри — додаткові налаштування для сторі
//     // `layout: 'centered'` — центрує компонент у Canvas (робочій області Storybook)
//     layout: 'centered',
//   },
//   // Теги використовуються для автодокументації (Autodocs)
//   // Storybook згенерує документацію автоматично
//   tags: ['autodocs'],
//   // Аргументи (argTypes) дозволяють змінювати властивості компонентів у UI Storybook
//   // Тут ми додаємо можливість керувати кольором backgroundColor
//   argTypes: {
//     backgroundColor: { control: 'color' },
//   },
//   // args — значення аргументів за замовчуванням для історій
//   // `fn()` — створює "шпигунську" функцію (spy) для onClick,
//   // яка буде відображатися у вкладці Actions (панель подій Storybook)
//   args: { onClick: fn() },
// } satisfies Meta<typeof Button>; // `satisfies` перевіряє, що meta відповідає типу Meta
// // це зручно для автодопомоги й безпеки типів

// export default meta;

// // Тип Story використовується для окремих історій
// type Story = StoryObj<typeof meta>;

// // === Історії (Stories) ===
// // Кожна історія — це варіант відображення компонента з різними аргументами (props)

// // Primary — кнопка з головним стилем
// export const Primary: Story = {
//   args: {
//     primary: true, // Властивість primary вмикає основний (головний) стиль кнопки
//     label: 'Кнопка', // Текст кнопки
//   },
// };

// // Secondary — кнопка зі звичайним (неосновним) стилем
// export const Secondary: Story = {
//   args: {
//     label: 'Кнопка', // Тільки текст без "primary"
//   },
// };

// // Large — кнопка великого розміру
// export const Large: Story = {
//   args: {
//     size: 'large', // Властивість size задає розмір
//     label: 'Кнопка',
//   },
// };

// // Small — кнопка маленького розміру
// export const Small: Story = {
//   args: {
//     size: 'small',
//     label: 'Кнопка',
//   },
// };

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

import type { Meta, StoryObj } from '@storybook/react';
// import { Button } from './Button';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'shadcn/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['default', 'secondary', 'outline', 'destructive', 'icon'],
    },
    size: {
      control: { type: 'radio' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    children: {
      control: { type: 'text' },
    },
    disabled: {
      control: 'boolean',
    },
    onClick: {
      action: 'clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: 'Button',
    disabled: false,
  },
};
