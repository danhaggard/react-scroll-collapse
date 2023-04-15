import { presets } from 'react-motion';

export const MOTION_SPRINGS = {
  ...presets,
  default: { stiffness: 170, damping: 26, precision: 0.01 }, // react motion default
  snail: { stiffness: 17, damping: 40, precision: 0.01 },
  slow: { stiffness: 100, damping: 40, precision: 0.01 },
  fast: { stiffness: 400, damping: 50, precision: 0.01 },

};

export const DEFAULT_MOTION_SPRING = MOTION_SPRINGS.noWobble; // eslint-disable-line
