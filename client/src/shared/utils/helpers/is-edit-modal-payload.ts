// export function isEditModalPayload<K extends string, T>(
//   payload: object | null,
//   key: K,
// ): payload is { [P in K]?: T } {
//   return typeof payload === 'object' && payload !== null && key in payload;
// }

export function isEditModalPayload<Key extends string, ValueType>(
  payload: object | null,
  key: Key,
): payload is { [Property in Key]?: ValueType } {
  return typeof payload === 'object' && payload !== null && key in payload;
}
