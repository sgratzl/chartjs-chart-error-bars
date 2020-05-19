import { Chart, registerController, BarController, HorizontalBarController, defaults, merge, patchControllerConfig} from '../chart';
import { calculateScale } from './utils';
import { styleKeys } from '../elements/render';
import { RectangleWithErrorBar } from '../elements';
import { verticalTooltipDefaults, horizontalTooltipDefaults } from './tooltip';
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
BarWithErrorBarsController.prototype.dataElementOptions = BarController.prototype.dataElementOptions.concat(styleKeys);

BarWithErrorBarsController.id = 'barWithErrorBars';
BarWithErrorBarsController.register = () => {
  BarWithErrorBarsController.prototype.dataElementType = RectangleWithErrorBar.register();
  BarWithErrorBarsController.defaults = merge({}, [defaults.bar, verticalTooltipDefaults, animationHints]);
  return registerController(BarWithErrorBarsController);
};

export class BarWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, BarWithErrorBarsController));
  }
}
BarWithErrorBarsChart.id = BarWithErrorBarsController.id;

export class HorizontalBarWithErrorBarsController extends HorizontalBarController {
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

HorizontalBarWithErrorBarsController.prototype.dataElementOptions = HorizontalBarController.prototype.dataElementOptions.concat(
  styleKeys
);
HorizontalBarWithErrorBarsController.id = 'horizontalBarWithErrorBars';
HorizontalBarWithErrorBarsController.register = () => {
  HorizontalBarWithErrorBarsController.prototype.dataElementType = RectangleWithErrorBar.register();
  HorizontalBarWithErrorBarsController.defaults = merge({}, [defaults.horizontalBar, horizontalTooltipDefaults, animationHints]);
  return registerController(HorizontalBarWithErrorBarsController);
};

export class HorizontalBarWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, HorizontalBarWithErrorBarsController));
  }
}
HorizontalBarWithErrorBarsChart.id = HorizontalBarWithErrorBarsController.id;
