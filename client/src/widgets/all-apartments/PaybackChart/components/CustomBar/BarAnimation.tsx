import * as React from 'react';
import { BAR_ANIMATION_DURATION, BAR_FILL_OPACITY } from '../../utils/payback.utils';

export const BarAnimation: React.FC = () => (
  <animate
    attributeName="opacity"
    values={`${BAR_FILL_OPACITY};1;${BAR_FILL_OPACITY}`}
    dur={BAR_ANIMATION_DURATION}
    repeatCount="indefinite"
  />
);
