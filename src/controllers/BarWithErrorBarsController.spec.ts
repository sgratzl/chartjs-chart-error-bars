import createChart from '../__tests__/createChart';
import { registry, LinearScale, CategoryScale } from 'chart.js';
import { BarWithErrorBarsController, IBarWithErrorBarsControllerConfiguration } from './BarWithErrorBarsController';
import { RectangleWithErrorBar } from '../elements';
import { IErrorBarYDataPoint } from './base';

describe('bar', () => {
  beforeAll(() => {
    registry.addControllers(BarWithErrorBarsController);
    registry.addElements(RectangleWithErrorBar);
    registry.addScales(LinearScale, CategoryScale);
  });
  test('default', () => {
    return createChart<
      IErrorBarYDataPoint,
      string,
      IBarWithErrorBarsControllerConfiguration<IErrorBarYDataPoint, string>
    >({
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
