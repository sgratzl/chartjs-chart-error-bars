import { defaults, Rectangle } from '../chart';
import { renderErrorBar, errorBarDefaults } from './render';

export class RectangleWithErrorBar extends Rectangle {
  draw(ctx) {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }
}
RectangleWithErrorBar._type = 'rectangleWithErrorBar';
RectangleWithErrorBar.register = () => {
  defaults.set('elements', {
    [RectangleWithErrorBar._type]: Object.assign({}, defaults.elements.rectangle, errorBarDefaults),
  });
  return RectangleWithErrorBar;
};
