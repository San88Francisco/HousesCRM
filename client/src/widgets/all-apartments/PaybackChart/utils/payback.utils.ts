export const LOADING_DELAY = 500;
export const MIN_CHART_WIDTH = 800;
export const CHART_WIDTH_MULTIPLIER = 80;
export const Y_AXIS_ROUNDING = 100000;
export const CHART_HEIGHT = 400;

export const MILLION = 1_000_000;
export const THOUSAND = 1_000;
export const ONE_DECIMAL = 1;
export const ZERO_DECIMAL = 0;

export const BAR_BORDER_RADIUS = 4;
export const BAR_BACKGROUND_OPACITY = 0.25;
export const BAR_FILL_OPACITY = 0.9;
export const BAR_ANIMATION_DURATION = '2s';

export const TOOLTIP_MAX_NAME_LENGTH = 16;
export const TOOLTIP_PRICE_DIVIDER = 1000;
export const TOOLTIP_DECIMAL_PLACES = 0;
export const TOOLTIP_DATE_LOCALE = 'uk-UA';

export const TICK_MAX_TEXT_LENGTH = 12;

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
};

export const generateRoundedRectPath = (
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): string => {
  return `
    M ${x + radius} ${y}
    L ${x + width - radius} ${y}
    Q ${x + width} ${y} ${x + width} ${y + radius}
    L ${x + width} ${y + height}
    L ${x} ${y + height}
    L ${x} ${y + radius}
    Q ${x} ${y} ${x + radius} ${y}
    Z
  `;
};
