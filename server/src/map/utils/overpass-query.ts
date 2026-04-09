import { RADIUS_METERS } from '../constants/map.constants'

function aroundBlock(lat: number, lng: number): string {
  const a = `(around:${RADIUS_METERS},${lat},${lng})`
  return `
  nwr${a}[shop];
  nwr${a}[amenity~"^(bus_stop|pharmacy|hospital|clinic|doctors|cafe|restaurant|fast_food|food_court|bank|atm|supermarket|fuel|post_office|police|kindergarten|school)$"];
  node${a}[highway="bus_stop"];
  node${a}[public_transport="stop_position"];
  node${a}[public_transport="platform"];`
}

export function buildQuery(lat: number, lng: number): string {
  return `[out:json][timeout:40];(\n${aroundBlock(lat, lng)}\n);\nout center tags;`.trim()
}

export function buildBulkQuery(points: { lat: number; lng: number }[]): string {
  const inner = points.map((p) => aroundBlock(p.lat, p.lng)).join('\n')
  return `[out:json][timeout:75];(\n${inner}\n);\nout center tags;`.trim()
}
