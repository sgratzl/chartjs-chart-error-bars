export * from './elements';
export * from './controllers';

import { BarWithErrorBars, HorizontalBarWithErrorBars, LineWithErrorBars } from './controllers';
import { controllers, defaults } from 'chart.js';

Object.assign(controllers, {
  [BarWithErrorBars.id]: BarWithErrorBars,
  [HorizontalBarWithErrorBars.id]: HorizontalBarWithErrorBars,
  [LineWithErrorBars.id]: LineWithErrorBars,
});
defaults.set(BarWithErrorBars.id, BarWithErrorBars.defaults);
defaults.set(HorizontalBarWithErrorBars.id, HorizontalBarWithErrorBars.defaults);
defaults.set(LineWithErrorBars.id, LineWithErrorBars.defaults);
