import { Chart, controllers, ScatterController, defaults, merge } from '../chart';
import { calculateScale, patchControllerConfig } from './utils';
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
ScatterWithErrorBarsController.prototype.dataElementOptions = Object.assign(
  {},
  ScatterController.prototype.dataElementOptions,
  styleObjectKeys
);

ScatterWithErrorBarsController.id = 'scatterWithErrorBars';
ScatterWithErrorBarsController.register = () => {
  ScatterWithErrorBarsController.prototype.dataElementType = PointWithErrorBar.register();
  controllers[ScatterWithErrorBarsController.id] = ScatterWithErrorBarsController;
  defaults.set(ScatterWithErrorBarsController.id, merge({}, [defaults.scatter, tooltipDefaults, animationHints]));
  return ScatterWithErrorBarsController;
};

export class ScatterWithErrorBarsChart extends Chart {
  constructor(item, config) {
    super(item, patchControllerConfig(config, ScatterWithErrorBarsController));
  }
}
ScatterWithErrorBarsChart.id = ScatterWithErrorBarsController.id;
