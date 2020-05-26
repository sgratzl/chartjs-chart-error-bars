import matchChart from '../__tests__/matchChart';
import { HorizontalBarWithErrorBarsController } from './HorizontalBarWithErrorBarsController';

describe('bar', () => {
  beforeAll(() => {
    HorizontalBarWithErrorBarsController.register();
  });
  test('default', () => {
    return matchChart({
      type: HorizontalBarWithErrorBarsController.id,
      data: {
        labels: ['A', 'B'],
        datasets: [
          {
            data: [
              {
                x: 4,
                xMin: 1,
                xMax: 6,
              },
              {
                x: 2,
                xMin: 1,
                xMax: 4,
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
