const DAY_MAP: Record<string, string> = {
  Mo: 'Пн',
  Tu: 'Вт',
  We: 'Ср',
  Th: 'Чт',
  Fr: 'Пт',
  Sa: 'Сб',
  Su: 'Нд',
};

const DAY_PATTERN = new RegExp(`\\b(${Object.keys(DAY_MAP).join('|')})\\b`, 'g');

function replaceDays(segment: string): string {
  return segment.replace(DAY_PATTERN, match => DAY_MAP[match] ?? match);
}

function formatSegment(raw: string): string {
  const s = raw.trim();
  if (/^24\/7$/i.test(s)) return 'Цілодобово';
  if (/^off$/i.test(s)) return 'Зачинено';
  if (/^(closed|вихідний)$/i.test(s)) return 'Вихідний';
  return replaceDays(s);
}

export function formatOpeningHours(raw: string): string {
  if (!raw?.trim()) return '';
  return raw.split(';').map(formatSegment).join('; ');
}
