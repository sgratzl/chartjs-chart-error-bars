import { Rectangle } from 'chart.js';
import { renderErrorBar, errorBarDefaults } from './render';

export class RectangleWithErrorBar extends Rectangle {
  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }

  static readonly id = 'rectangleWithErrorBar';
  static readonly defaults: any = /*#__PURE__*/ Object.assign({}, Rectangle.defaults, errorBarDefaults);
  static readonly defaultRoutes = Rectangle.defaultRoutes;
}
