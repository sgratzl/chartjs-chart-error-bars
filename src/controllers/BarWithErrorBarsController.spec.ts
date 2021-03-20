import { registry, LinearScale, CategoryScale } from 'chart.js';
import createChart from '../__tests__/createChart';
import { BarWithErrorBarsController } from './BarWithErrorBarsController';
import { BarWithErrorBar } from '../elements';

describe('bar', () => {
  beforeAll(() => {
    registry.addControllers(BarWithErrorBarsController);
    registry.addElements(BarWithErrorBar);
    registry.addScales(LinearScale, CategoryScale);
  });
  test('default', () => {
    return createChart({
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
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
      },
    }).toMatchImageSnapshot();
  });
});
