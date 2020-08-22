import matchChart from '../__tests__/matchChart';
import { registry, LinearScale, CategoryScale } from '@sgratzl/chartjs-esm-facade';
import { BarWithErrorBarsController } from './BarWithErrorBarsController';
import { RectangleWithErrorBar } from '../elements';

describe('bar', () => {
  beforeAll(() => {
    registry.addControllers(BarWithErrorBarsController);
    registry.addElements(RectangleWithErrorBar);
    registry.addScales(LinearScale, CategoryScale);
  });
  test('default', () => {
    return matchChart({
      type: BarWithErrorBarsController.id,
      data: {
        labels: ['A', 'B'],
        datasets: [
          {
            data: [
              {
                y: 4,
                yMin: 1,
                yMax: 6,
              },
              {
                y: 2,
                yMin: 1,
                yMax: 4,
              },
            ],
          },
        ],
      },
      options: {
        legend: false,
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      },
    });
  });
});
