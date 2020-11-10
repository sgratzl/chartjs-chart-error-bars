import { ArcElement } from 'chart.js';
import { renderErrorBarArc, errorBarDefaults } from './render';

export class ArcWithErrorBar extends ArcElement {
  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);

    renderErrorBarArc(this, ctx);
  }

  static readonly id = 'arcWithErrorBar';
  static readonly defaults: any = /*#__PURE__*/ Object.assign({}, ArcElement.defaults, errorBarDefaults);
  static readonly defaultRoutes = ArcElement.defaultRoutes;
}
