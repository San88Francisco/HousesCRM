import { ChartConfig } from '@/widgets/all-apartments/pie-chart-revenue-distribution/type';

export function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }
  const payloadObj = payload as Record<string, unknown>;
  const configLabelKey = extractConfigLabelKey(payloadObj, key);
  return config[configLabelKey] || config[key as keyof typeof config];
}

function extractConfigLabelKey(payload: Record<string, unknown>, key: string): string {
  if (isStringValue(payload[key])) {
    return payload[key] as string;
  }
  const nestedPayload = getNestedPayload(payload);
  if (nestedPayload && isStringValue(nestedPayload[key])) {
    return nestedPayload[key] as string;
  }
  return key;
}

function getNestedPayload(payload: Record<string, unknown>): Record<string, unknown> | null {
  const nested = payload.payload;
  return nested && typeof nested === 'object' && nested !== null
    ? (nested as Record<string, unknown>)
    : null;
}

function isStringValue(value: unknown): value is string {
  return typeof value === 'string';
}
