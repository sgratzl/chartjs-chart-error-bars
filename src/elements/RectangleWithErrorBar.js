import { defaults, Rectangle, registerElement } from '../chart';
import { renderErrorBar, errorBarDefaults } from './render';

export class RectangleWithErrorBar extends Rectangle {
  draw(ctx) {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }
}
RectangleWithErrorBar.id = 'rectangleWithErrorBar';
RectangleWithErrorBar.defaults = /*#__PURE__*/ Object.assign({}, defaults.elements.rectangle, errorBarDefaults);
RectangleWithErrorBar.register = () => registerElement(RectangleWithErrorBar);
