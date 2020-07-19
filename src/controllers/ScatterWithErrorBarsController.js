import { Chart, ScatterController, merge } from '@sgratzl/chartjs-esm-facade';
import { calculateScale } from './utils';
import { getMinMax, parseErrorNumberData } from './base';
import { generateTooltipScatter } from './tooltip';
import { animationHints } from '../animate';
import { PointWithErrorBar } from '../elements';
import { styleObjectKeys } from '../elements/render';
import patchController from './patchController';

export class ScatterWithErrorBarsController extends ScatterController {
  getMinMax(scale, canStack) {
    return getMinMax(scale, canStack, (scale, canStack) => super.getMinMax(scale, canStack));
  }

  parseObjectData(meta, data, start, count) {
    const parsed = super.parseObjectData(meta, data, start, count);
    parseErrorNumberData(parsed, meta.xScale, data, start, count);
    parseErrorNumberData(parsed, meta.yScale, data, start, count);
    return parsed;
  }

  updateElement(element, index, properties, mode) {
    if (element instanceof PointWithErrorBar) {
      // inject the other error bar related properties
      calculateScale(properties, this.getParsed(index), this._cachedMeta.xScale, mode === 'reset');
      calculateScale(properties, this.getParsed(index), this._cachedMeta.yScale, mode === 'reset');
    }
    super.updateElement(element, index, properties, mode);
  }
}

ScatterWithErrorBarsController.id = 'scatterWithErrorBars';
ScatterWithErrorBarsController.defaults = /*#__PURE__*/ merge({}, [
  ScatterController.defaults,
  animationHints,
  {
    tooltips: {
      callbacks: {
        label: generateTooltipScatter,
      },
    },
    dataElementType: PointWithErrorBar.id,
    dataElementOptions: Object.assign({}, ScatterController.prototype.dataElementOptions, styleObjectKeys),
  },
]);

export class ScatterWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchController(config, ScatterWithErrorBarsController, PointWithErrorBar));
  }
}
ScatterWithErrorBarsChart.id = ScatterWithErrorBarsController.id;
