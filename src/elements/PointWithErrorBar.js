import { Point } from '@sgratzl/chartjs-esm-facade';
import { renderErrorBar, errorBarDefaults } from './render';

export class PointWithErrorBar extends Point {
  draw(ctx) {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }
}
PointWithErrorBar.id = 'pointWithErrorBar';
PointWithErrorBar.defaults = /*#__PURE__*/ Object.assign({}, Point.defaults, errorBarDefaults);
PointWithErrorBar.defaultRoutes = Point.defaultRoutes;
