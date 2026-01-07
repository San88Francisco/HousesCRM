export const contractDuration = (occupied: string, vacated: string) => {
  const startDate = new Date(occupied);
  const endDate = vacated ? new Date(vacated) : new Date();
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const months = Math.floor(diffDays / 30);
  const weeks = Math.floor((diffDays % 30) / 7);
  const days = diffDays % 30;

  if (months > 0) {
    return `${months} міс`;
  }
  if (weeks > 0) {
    return `${weeks} тиж.`;
  }
  return `${days} дн.`;
};
