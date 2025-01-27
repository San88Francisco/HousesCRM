export const formatNumber = (value: number) => {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 })
}