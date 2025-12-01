export function getCssVariable(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function getPaletteColors(): string[] {
  const paletteNames = [
    '--active-border',
    '--red',
    '--positive',
    '--dark',
    '--purple',
    '--gold',
    '--info',
  ];

  return paletteNames.map(name => getCssVariable(name)).filter(color => color.length > 0);
}
