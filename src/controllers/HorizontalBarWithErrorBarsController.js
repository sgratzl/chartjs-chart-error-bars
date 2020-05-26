import { Chart, registerController, HorizontalBarController, defaults, merge, patchControllerConfig } from '../chart';
import { calculateScale } from './utils';
import { styleKeys } from '../elements/render';
import { RectangleWithErrorBar } from '../elements';
import { horizontalTooltipDefaults } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData } from './base';

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

HorizontalBarWithErrorBarsController.id = 'horizontalBarWithErrorBars';
HorizontalBarWithErrorBarsController.defaults = /*#__PURE__*/ merge({}, [
  defaults.horizontalBar,
  horizontalTooltipDefaults,
  animationHints,
]);
HorizontalBarWithErrorBarsController.register = () => {
  HorizontalBarWithErrorBarsController.prototype.dataElementType = RectangleWithErrorBar.register();
  HorizontalBarWithErrorBarsController.prototype.dataElementOptions = HorizontalBarController.prototype.dataElementOptions.concat(
    styleKeys
  );
  return registerController(HorizontalBarWithErrorBarsController);
};

export class HorizontalBarWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, HorizontalBarWithErrorBarsController));
  }
}
HorizontalBarWithErrorBarsChart.id = HorizontalBarWithErrorBarsController.id;
