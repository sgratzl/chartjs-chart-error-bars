﻿import { Chart, registerController, BarController, defaults, merge, patchControllerConfig } from '../chart';
import { calculateScale } from './utils';
import { styleKeys } from '../elements/render';
import { RectangleWithErrorBar } from '../elements';
import { verticalTooltipDefaults } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData } from './base';

export class BarWithErrorBarsController extends BarController {
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
    // inject the other error bar related properties
    calculateScale(properties, this.getParsed(index), this._cachedMeta.vScale, mode === 'reset');
    super.updateElement(element, index, properties, mode);
  }
}
BarWithErrorBarsController.id = 'barWithErrorBars';
BarWithErrorBarsController.defaults = /*#__PURE__*/ merge({}, [defaults.bar, verticalTooltipDefaults, animationHints]);
BarWithErrorBarsController.register = () => {
  BarWithErrorBarsController.prototype.dataElementOptions = BarController.prototype.dataElementOptions.concat(
    styleKeys
  );
  BarWithErrorBarsController.prototype.dataElementType = RectangleWithErrorBar.register();
  return registerController(BarWithErrorBarsController);
};

export class BarWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, BarWithErrorBarsController));
  }
}
BarWithErrorBarsChart.id = BarWithErrorBarsController.id;