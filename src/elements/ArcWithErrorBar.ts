import { Arc } from 'chart.js';
import { renderErrorBarArc, errorBarDefaults } from './render';

export class ArcWithErrorBar extends Arc {
  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx);

    renderErrorBarArc(this, ctx);
  }
}
ArcWithErrorBar.id = 'arcWithErrorBar';
ArcWithErrorBar.defaults = /*#__PURE__*/ Object.assign({}, Arc.defaults, errorBarDefaults);
ArcWithErrorBar.defaultRoutes = Arc.defaultRoutes;
