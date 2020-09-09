import {
  BarWithErrorBarsController,
  LineWithErrorBarsController,
  PolarAreaWithErrorBarsController,
  ScatterWithErrorBarsController,
} from './controllers';
import { registry } from 'chart.js';
import { RectangleWithErrorBar, ArcWithErrorBar, PointWithErrorBar } from './elements';

export * from '.';

registry.addControllers(
  BarWithErrorBarsController,
  LineWithErrorBarsController,
  PolarAreaWithErrorBarsController,
  ScatterWithErrorBarsController
);
registry.addElements(RectangleWithErrorBar, ArcWithErrorBar, LineWithErrorBarsController, PointWithErrorBar);
