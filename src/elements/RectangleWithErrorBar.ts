import { Rectangle } from '@sgratzl/chartjs-esm-facade';
import { renderErrorBar, errorBarDefaults } from './render';

export class RectangleWithErrorBar extends Rectangle {
  draw(ctx) {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }
}
RectangleWithErrorBar.id = 'rectangleWithErrorBar';
RectangleWithErrorBar.defaults = /*#__PURE__*/ Object.assign({}, Rectangle.defaults, errorBarDefaults);
RectangleWithErrorBar.defaultRoutes = Rectangle.defaultRoutes;
