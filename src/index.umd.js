export * from '.';

import {
  BarWithErrorBarsController,
  LineWithErrorBarsController,
  PolarAreaWithErrorBarsController,
  ScatterWithErrorBarsController,
} from './controllers';
import { registry } from '@sgratzl/chartjs-esm-facade';
import { RectangleWithErrorBar, ArcWithErrorBar, PointWithErrorBar } from './elements';

registry.addControllers(
  BarWithErrorBarsController,
  LineWithErrorBarsController,
  PolarAreaWithErrorBarsController,
  ScatterWithErrorBarsController
);
registry.addElements(RectangleWithErrorBar, ArcWithErrorBar, LineWithErrorBarsController, PointWithErrorBar);
