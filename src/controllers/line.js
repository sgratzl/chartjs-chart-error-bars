import { Chart, registerController, LineController, defaults, merge, patchControllerConfig } from '../chart';
import { calculateScale } from './utils';
import { styleObjectKeys } from '../elements/render';
import { PointWithErrorBar } from '../elements';
import { verticalTooltipDefaults } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData } from './base';

export class LineWithErrorBarsController extends LineController {
  getMinMax(scale, canStack) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  parseObjectData(meta, data, start, count) {
    const parsed = super.parseObjectData(meta, data, start, count);
    parseErrorNumberData(parsed, meta.vScale, data, start, count);
    parseErrorLabelData(parsed, meta.iScale, start, count);
    return parsed;
  }

  updateElement(element, index, properties, mode) {
    if (element instanceof PointWithErrorBar) {
      // inject the other error bar related properties
      calculateScale(properties, this.getParsed(index), this._cachedMeta.vScale, mode === 'reset');
    }
    super.updateElement(element, index, properties, mode);
  }
}

LineWithErrorBarsController.prototype.dataElementOptions = Object.assign(
  {},
  LineController.prototype.dataElementOptions,
  styleObjectKeys
);

LineWithErrorBarsController.id = 'lineWithErrorBars';
LineWithErrorBarsController.register = () => {
  LineWithErrorBarsController.prototype.dataElementType = PointWithErrorBar.register();
  LineWithErrorBarsController.defaults = merge({}, [defaults.line, verticalTooltipDefaults, animationHints]);
  return registerController(LineWithErrorBarsController);
};

export class LineWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, LineWithErrorBarsController));
  }
}
LineWithErrorBarsChart.id = LineWithErrorBarsController.id;
