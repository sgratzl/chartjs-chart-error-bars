﻿import { defaults, elements } from 'chart.js';
import { renderErrorBar, errorBarDefaults } from './render';

export class RectangleWithErrorBar extends elements.Rectangle {
  draw(ctx) {
    super.draw(ctx);

    renderErrorBar(this, ctx);
  }
}
RectangleWithErrorBar._type = 'rectangleWithErrorBar';
defaults.set('elements', {
  [RectangleWithErrorBar._type]: Object.assign({}, defaults.elements.rectangle, errorBarDefaults),
});
