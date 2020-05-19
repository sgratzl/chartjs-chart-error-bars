import { defaults, Rectangle, registerElement } from '../chart';
import { renderErrorBar, errorBarDefaults } from './render';

export class RectangleWithErrorBar extends Rectangle {
  draw(ctx) {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }
}
RectangleWithErrorBar.id = RectangleWithErrorBar._type = 'rectangleWithErrorBar';
RectangleWithErrorBar.defaults = Object.assign({}, defaults.elements.rectangle, errorBarDefaults);
RectangleWithErrorBar.register = () => registerElement(RectangleWithErrorBar);
