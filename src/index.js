export * from './elements';
export * from './controllers';

import { BarWithErrorBars, HorizontalBarWithErrorBars, LineWithErrorBars, ScatterWithErrorBars } from './controllers';
import { controllers, defaults } from 'chart.js';

Object.assign(controllers, {
  [BarWithErrorBars.id]: BarWithErrorBars,
  [HorizontalBarWithErrorBars.id]: HorizontalBarWithErrorBars,
  [LineWithErrorBars.id]: LineWithErrorBars,
  [ScatterWithErrorBars.id]: ScatterWithErrorBars,
});
defaults.set(BarWithErrorBars.id, BarWithErrorBars.defaults);
defaults.set(HorizontalBarWithErrorBars.id, HorizontalBarWithErrorBars.defaults);
defaults.set(LineWithErrorBars.id, LineWithErrorBars.defaults);
defaults.set(ScatterWithErrorBars.id, ScatterWithErrorBars.defaults);
