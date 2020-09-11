import { Point } from 'chart.js';
import { renderErrorBar, errorBarDefaults } from './render';

export class PointWithErrorBar extends Point {
  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);

    renderErrorBar(this as any, ctx);
  }

  static readonly id = 'pointWithErrorBar';
  static readonly defaults: any = /*#__PURE__*/ Object.assign({}, Point.defaults, errorBarDefaults);
  static readonly defaultRoutes = Point.defaultRoutes;
}
