import {
  BarWithErrorBarsController,
  LineWithErrorBarsController,
  PolarAreaWithErrorBarsController,
  ScatterWithErrorBarsController,
} from './controllers';
import { registry } from 'chart.js';
import { BarWithErrorBar, ArcWithErrorBar, PointWithErrorBar } from './elements';

export * from '.';

registry.addControllers(
  BarWithErrorBarsController,
  LineWithErrorBarsController,
  PolarAreaWithErrorBarsController,
  ScatterWithErrorBarsController
);
registry.addElements(BarWithErrorBar, ArcWithErrorBar, LineWithErrorBarsController, PointWithErrorBar);
