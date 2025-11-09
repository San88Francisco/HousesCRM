import { ChartConfig } from '@/widgets/all-apartments/pie-chart-revenue-distribution/PieChart';

export const chartConfig = {
  0: {
    label: 'вул. Соборна 338',
    theme: { light: 'var(--purple)', dark: 'var(--purple-light)' },
  },
  1: {
    label: 'Григорія Сковороди (Бахарєва) 23',
    theme: { light: 'var(--blue)', dark: 'var(--blue-medium)' },
  },
  2: {
    label: 'вул. Вербова 24',
    theme: { light: 'var(--green-light)', dark: 'var(--green)' },
  },
  3: {
    label: 'вул. Кулика і Гудачека 23',
    theme: { light: 'var(--yellow)', dark: 'var(--info)' },
  },
  4: {
    label: 'вул. Степана Бандери 8',
    theme: { light: 'var(--red)', dark: 'var(--gray-medium)' },
  },
  5: {
    label: 'вул. Київська 12',
    theme: { light: 'var(--dark-light)', dark: 'var(--white-light)' },
  },
  6: {
    label: 'вул. Шевченка 45',
    theme: { light: 'var(--purple-medium)', dark: 'var(--purple-lightest)' },
  },
  7: {
    label: 'вул. Грушевського 7',
    theme: { light: 'var(--green)', dark: 'var(--green-light)' },
  },
} satisfies ChartConfig;
