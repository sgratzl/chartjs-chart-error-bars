import ChartNS from 'chart.js';

export const Chart = ChartNS;
export const defaults = ChartNS.defaults;

// export const DatasetController = ChartNS.DatasetController;
export const BarController = ChartNS.controllers.bar;
export const HorizontalBarController = ChartNS.controllers.horizontalBar;
export const LineController = ChartNS.controllers.line;
export const PolarAreaController = ChartNS.controllers.polarArea;
export const ScatterController = ChartNS.controllers.scatter;

export function registerController(controller) {
  ChartNS.controllers[controller.id] = controller;
  ChartNS.defaults.set(controller.id, controller.defaults);
  return controller;
}

// export const Element = ChartNS.Element;
export const Rectangle = ChartNS.elements.Rectangle;
export const Point = ChartNS.elements.Point;
// export const Line = ChartNS.elements.Line;
export const Arc = ChartNS.elements.Arc;

export function registerElement(element) {
  ChartNS.defaults.set('elements', {
    [element.id]: element.defaults,
  });
  return element;
}

export const merge = ChartNS.helpers.merge;
// export const drawPoint = ChartNS.helpers.canvas.drawPoint;
export const resolve = ChartNS.helpers.options.resolve;
export const color = ChartNS.helpers.color;

export function patchControllerConfig(config, controller) {
  controller.register();
  config.type = controller.id;
  return config;
}
