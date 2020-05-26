import matchChart from '../__tests__/matchChart';
import { PolarAreaWithErrorBarsController } from './PolarAreaWithErrorBarsController';

describe('bar', () => {
  beforeAll(() => {
    PolarAreaWithErrorBarsController.register();
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
