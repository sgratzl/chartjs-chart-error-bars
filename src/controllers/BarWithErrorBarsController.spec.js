import matchChart from '../__tests__/matchChart';
import { BarWithErrorBarsController } from './BarWithErrorBarsController';

describe('bar', () => {
  beforeAll(() => {
    BarWithErrorBarsController.register();
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
