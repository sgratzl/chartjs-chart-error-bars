import { Chart, registerController, ScatterController, defaults, merge, patchControllerConfig } from '../chart';
import { calculateScale } from './utils';
import { getMinMax, parseErrorNumberData } from './base';
import { generateTooltipScatter } from './tooltip';
import { animationHints } from '../animate';
import { PointWithErrorBar } from '../elements';
import { styleObjectKeys } from '../elements/render';

const tooltipDefaults = {
  tooltips: {
    callbacks: {
      label: generateTooltipScatter,
    },
  },
};

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
ScatterWithErrorBarsController.defaults = /*#__PURE__*/ merge({}, [defaults.scatter, tooltipDefaults, animationHints]);
ScatterWithErrorBarsController.register = () => {
  ScatterWithErrorBarsController.prototype.dataElementType = PointWithErrorBar.register();
  ScatterWithErrorBarsController.prototype.dataElementOptions = Object.assign(
    {},
    ScatterController.prototype.dataElementOptions,
    styleObjectKeys
  );
  return registerController(ScatterWithErrorBarsController);
};

export class ScatterWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, ScatterWithErrorBarsController));
  }
}
ScatterWithErrorBarsChart.id = ScatterWithErrorBarsController.id;
