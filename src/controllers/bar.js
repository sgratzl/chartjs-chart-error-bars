import { controllers, helpers, defaults } from 'chart.js';
import { calculateScale } from './utils';
import { styleKeys } from '../elements/render';
import { RectangleWithErrorBar } from '../elements';
import { generateTooltip } from './tooltip';
import { animationHints } from '../animate';

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

function mergerAnimations(key, target, source, options) {
  if (key === 'properties') {
    target[key] = (target[key] || []).concat(source[key]);
  } else {
    helpers._merger(key, target, source, options);
  }
}

export class BarWithErrorBars extends controllers.bar {
  getMinMax(scale, canStack) {
    const axis = scale.axis;
    scale.axis = `${axis}MinMin`;
    const min = super.getMinMax(scale, canStack).min;
    scale.axis = `${axis}MaxMax`;
    const max = super.getMinMax(scale, canStack).max;
    scale.axis = axis;
    return { min, max };
  }
  parseObjectData(meta, data, start, count) {
    const parsed = super.parseObjectData(meta, data, start, count);
    const iScale = meta.iScale;
    const vScale = meta.vScale;
    const vMin = `${vScale.axis}Min`;
    const vMax = `${vScale.axis}Max`;
    const vMinMin = `${vScale.axis}MinMin`;
    const vMaxMax = `${vScale.axis}MaxMax`;
    const labels = iScale.getLabels();

    const compute = (v, vm, op) => {
      if (Array.isArray(vm)) {
        return op(...vm);
      }
      if (typeof vm === 'number') {
        return vm;
      }
      v;
    };

    for (let i = 0; i < parsed.length; i++) {
      const p = parsed[i];
      p[iScale.axis] = iScale.parse(labels[i], i);
      p[vMin] = data[i][vMin];
      p[vMax] = data[i][vMax];
      p[vMinMin] = compute(p[vScale.axis], p[vMin], Math.min);
      p[vMaxMax] = compute(p[vScale.axis], p[vMax], Math.max);
    }
    return parsed;
  }
  updateElement(element, index, properties, mode) {
    // inject the other error bar related properties
    calculateScale(properties, this.getParsed(index), this._cachedMeta.vScale, mode === 'reset');
    super.updateElement(element, index, properties, mode);
  }
}
BarWithErrorBars.id = 'barWithErrorBars';
BarWithErrorBars.defaults = helpers.merge({}, [defaults.bar, verticalDefaults, animationHints], {
  merger: mergerAnimations,
});
BarWithErrorBars.prototype.dataElementType = RectangleWithErrorBar;
BarWithErrorBars.prototype.dataElementOptions = controllers.bar.prototype.dataElementOptions.concat(styleKeys);

export class HorizontalBarWithErrorBars extends controllers.horizontalBar {}
HorizontalBarWithErrorBars.id = 'horizontalBarWithErrorBars';
HorizontalBarWithErrorBars.defaults = helpers.merge({}, [defaults.horizontalBar, horizontalDefaults, animationHints]);
HorizontalBarWithErrorBars.prototype.dataElementType = RectangleWithErrorBar;
HorizontalBarWithErrorBars.prototype.dataElementOptions = controllers.horizontalBar.prototype.dataElementOptions.concat(
  styleKeys
);
