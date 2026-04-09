export function buildGeocodeQuery(street: string): string {
  const clean = street
    .replace(/,?\s*кв\.?\s*\d+.*$/i, '')
    .replace(/\bБОС\b/gi, '')
    .replace(/\bб\.?\s*\d+/gi, '')
    .trim()
    .replace(/^вул\.?\s*/i, '')

  const numMatch = clean.match(/(\d+[/-]?\d*)\s*$/)
  if (numMatch) {
    const streetName = clean.substring(0, numMatch.index).trim()
    return `вулиця ${streetName} ${numMatch[1]}, Рівне, Україна`
  }

  return `${clean}, Рівне, Україна`
}
