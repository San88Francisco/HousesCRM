export const isActiveItem = (currentPathname: string, itemUrl?: string) => {
  if (!itemUrl) return false;

  const currentSegment = currentPathname.split('/').pop() || '';

  const itemSegment = itemUrl.split('/').pop() || '';

  return currentSegment === itemSegment;
};
