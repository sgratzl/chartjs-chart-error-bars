export * from '.';

import {
  BarWithErrorBarsController,
  HorizontalBarWithErrorBarsController,
  LineWithErrorBarsController,
  PolarAreaWithErrorBarsController,
  ScatterWithErrorBarsController,
} from './controllers';

BarWithErrorBarsController.register();
HorizontalBarWithErrorBarsController.register();
LineWithErrorBarsController.register();
PolarAreaWithErrorBarsController.register();
ScatterWithErrorBarsController.register();
