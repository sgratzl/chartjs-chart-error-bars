import matchChart from '../__tests__/matchChart';
import { registry, RadialLinearScale } from '@sgratzl/chartjs-esm-facade';
import { PolarAreaWithErrorBarsController } from './PolarAreaWithErrorBarsController';
import { ArcWithErrorBar } from '../elements';

describe('bar', () => {
  beforeAll(() => {
    registry.addControllers(PolarAreaWithErrorBarsController);
    registry.addElements(ArcWithErrorBar);
    registry.addScales(RadialLinearScale);
  });
  test('default', () => {
    return matchChart({
      type: PolarAreaWithErrorBarsController.id,
      data: {
        labels: ['A', 'B'],
        datasets: [
          {
            data: [
              {
                r: 4,
                rMin: 1,
                rMax: 6,
              },
              {
                r: 2,
                rMin: 1,
                rMax: 4,
              },
            ],
          },
        ],
      },
      options: {
        legend: false,
        scales: {
          r: {
            display: false,
          },
        },
      },
    });
  });
});
