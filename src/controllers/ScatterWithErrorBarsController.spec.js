import matchChart from '../__tests__/matchChart';
import { ScatterWithErrorBarsController } from './ScatterWithErrorBarsController';

describe('bar', () => {
  beforeAll(() => {
    ScatterWithErrorBarsController.register();
  });
  test('default', () => {
    return matchChart({
      type: ScatterWithErrorBarsController.id,
      data: {
        labels: ['A', 'B'],
        datasets: [
          {
            data: [
              {
                x: 2,
                xMin: 1,
                xMax: 3,
                y: 4,
                yMin: 1,
                yMax: 6,
              },
              {
                x: 7,
                xMin: 6,
                xMax: 9,
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
