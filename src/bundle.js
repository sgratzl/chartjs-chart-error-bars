export * from '.';

import {
  BarWithErrorBars,
  HorizontalBarWithErrorBars,
  LineWithErrorBars,
  PolarAreaWithErrorBars,
  ScatterWithErrorBars,
} from './controllers';

BarWithErrorBars.register();
HorizontalBarWithErrorBars.register();
LineWithErrorBars.register();
PolarAreaWithErrorBars.register();
ScatterWithErrorBars.register();
