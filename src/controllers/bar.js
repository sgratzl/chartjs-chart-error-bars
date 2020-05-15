import { controllers, helpers, defaults } from 'chart.js';
import { calculateScale } from './utils';
import { styleKeys } from '../elements/render';
import { RectangleWithErrorBar } from '../elements';
import { verticalTooltipDefaults, horizontalTooltipDefaults } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData } from './base';

export class BarWithErrorBars extends controllers.bar {
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
BarWithErrorBars.id = 'barWithErrorBars';
BarWithErrorBars.defaults = helpers.merge({}, [defaults.bar, verticalTooltipDefaults, animationHints]);
BarWithErrorBars.prototype.dataElementType = RectangleWithErrorBar;
BarWithErrorBars.prototype.dataElementOptions = controllers.bar.prototype.dataElementOptions.concat(styleKeys);

export class HorizontalBarWithErrorBars extends controllers.horizontalBar {
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

HorizontalBarWithErrorBars.id = 'horizontalBarWithErrorBars';
HorizontalBarWithErrorBars.defaults = helpers.merge({}, [
  defaults.horizontalBar,
  horizontalTooltipDefaults,
  animationHints,
]);
HorizontalBarWithErrorBars.prototype.dataElementType = RectangleWithErrorBar;
HorizontalBarWithErrorBars.prototype.dataElementOptions = controllers.horizontalBar.prototype.dataElementOptions.concat(
  styleKeys
);
