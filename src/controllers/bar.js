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
BarWithErrorBars.prototype.dataElementType = RectangleWithErrorBar.register();
BarWithErrorBars.prototype.dataElementOptions = controllers.bar.prototype.dataElementOptions.concat(styleKeys);

BarWithErrorBars.id = 'barWithErrorBars';
BarWithErrorBars.register = () => {
  controllers[BarWithErrorBars.id] = BarWithErrorBars;
  defaults.set(BarWithErrorBars.id, helpers.merge({}, [defaults.bar, verticalTooltipDefaults, animationHints]));
  return BarWithErrorBars;
};

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

HorizontalBarWithErrorBars.prototype.dataElementType = RectangleWithErrorBar.register();
HorizontalBarWithErrorBars.prototype.dataElementOptions = controllers.horizontalBar.prototype.dataElementOptions.concat(
  styleKeys
);
HorizontalBarWithErrorBars.id = 'horizontalBarWithErrorBars';
HorizontalBarWithErrorBars.register = () => {
  controllers[HorizontalBarWithErrorBars.id] = HorizontalBarWithErrorBars;
  defaults.set(
    HorizontalBarWithErrorBars.id,
    helpers.merge({}, [defaults.horizontalBar, horizontalTooltipDefaults, animationHints])
  );
  return HorizontalBarWithErrorBars;
};
