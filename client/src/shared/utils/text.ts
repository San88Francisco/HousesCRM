const MAX_NAME_LENGTH = 15;

export const truncateText = (text: string, maxLength: number = MAX_NAME_LENGTH): string =>
  text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`;
