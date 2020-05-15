import { controllers, helpers, defaults } from 'chart.js';
import { calculateScale } from './utils';
import { styleKeys } from '../elements/render';
import { RectangleWithErrorBar } from '../elements';
import { generateTooltip } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorBarData } from './base';

const verticalDefaults = {
  tooltips: {
    callbacks: {
      label: generateTooltip(false),
    },
  },
};

const horizontalDefaults = {
  tooltips: {
    callbacks: {
      label: generateTooltip(true),
    },
  },
};
// _updateElementGeometry(elem, index, reset, ...args) {
//   updateErrorBarElement(this, elem, index, reset);

//   Chart.controllers.bar.prototype._updateElementGeometry.call(this, elem, index, reset, ...args);
//   calculateErrorBarValuesPixels(this, elem._model, index, reset);
// },\

export class BarWithErrorBars extends controllers.bar {
  getMinMax(scale, canStack) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  parseObjectData(meta, data, start, count) {
    const parsed = super.parseObjectData(meta, data, start, count);
    return parseErrorBarData(parsed, meta, data, start, count);
  }

  updateElement(element, index, properties, mode) {
    // inject the other error bar related properties
    calculateScale(properties, this.getParsed(index), this._cachedMeta.vScale, mode === 'reset');
    super.updateElement(element, index, properties, mode);
  }
}
BarWithErrorBars.id = 'barWithErrorBars';
BarWithErrorBars.defaults = helpers.merge({}, [defaults.bar, verticalDefaults, animationHints]);
BarWithErrorBars.prototype.dataElementType = RectangleWithErrorBar;
BarWithErrorBars.prototype.dataElementOptions = controllers.bar.prototype.dataElementOptions.concat(styleKeys);

export class HorizontalBarWithErrorBars extends controllers.horizontalBar {
  getMinMax(scale, canStack) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  parseObjectData(meta, data, start, count) {
    const parsed = super.parseObjectData(meta, data, start, count);
    return parseErrorBarData(parsed, meta, data, start, count);
  }

  updateElement(element, index, properties, mode) {
    // inject the other error bar related properties
    calculateScale(properties, this.getParsed(index), this._cachedMeta.vScale, mode === 'reset');
    super.updateElement(element, index, properties, mode);
  }
}

HorizontalBarWithErrorBars.id = 'horizontalBarWithErrorBars';
HorizontalBarWithErrorBars.defaults = helpers.merge({}, [defaults.horizontalBar, horizontalDefaults, animationHints]);
HorizontalBarWithErrorBars.prototype.dataElementType = RectangleWithErrorBar;
HorizontalBarWithErrorBars.prototype.dataElementOptions = controllers.horizontalBar.prototype.dataElementOptions.concat(
  styleKeys
);
