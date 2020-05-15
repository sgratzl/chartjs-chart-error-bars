export * from './elements';
export * from './controllers';

import { BarWithErrorBars, HorizontalBarWithErrorBars } from './controllers';
import { controllers, defaults } from 'chart.js';

Object.assign(controllers, {
  [BarWithErrorBars.id]: BarWithErrorBars,
  [HorizontalBarWithErrorBars.id]: HorizontalBarWithErrorBars,
});
defaults.set(BarWithErrorBars.id, BarWithErrorBars.defaults);
defaults.set(HorizontalBarWithErrorBars.id, HorizontalBarWithErrorBars.defaults);
