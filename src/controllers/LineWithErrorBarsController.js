import { Chart, LineController, merge } from '@sgratzl/chartjs-esm-facade';
import { calculateScale } from './utils';
import { styleObjectKeys } from '../elements/render';
import { PointWithErrorBar } from '../elements';
import { generateBarTooltip } from './tooltip';
import { animationHints } from '../animate';
import { getMinMax, parseErrorNumberData, parseErrorLabelData } from './base';
import patchController from './patchController';

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

LineWithErrorBarsController.id = 'lineWithErrorBars';
LineWithErrorBarsController.defaults = /*#__PURE__*/ merge({}, [
  LineController.defaults,
  animationHints,
  {
    tooltips: {
      callbacks: {
        label: generateBarTooltip,
      },
    },
    dataElementType: PointWithErrorBar.id,
    dataElementOptions: Object.assign({}, LineController.defaults.dataElementOptions, styleObjectKeys),
  },
]);
export class LineWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchController(config, LineWithErrorBarsController, PointWithErrorBar));
  }
}
LineWithErrorBarsChart.id = LineWithErrorBarsController.id;
