import { registry, LinearScale, CategoryScale, TimeScale } from 'chart.js';
import createChart from '../__tests__/createChart';
import { BarWithErrorBarsController } from './BarWithErrorBarsController';
import { BarWithErrorBar } from '../elements';
import 'chartjs-adapter-date-fns';

describe('bar', () => {
  beforeAll(() => {
    registry.addControllers(BarWithErrorBarsController);
    registry.addElements(BarWithErrorBar);
    registry.addScales(LinearScale, CategoryScale, TimeScale);
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
  test('time scale', () => {
    return createChart({
      type: BarWithErrorBarsController.id,
      data: {
        labels: ['A', 'B'],
        datasets: [
          {
            data: [
              {
                x: '2017-12-25',
                y: 4,
                yMin: 1,
                yMax: 6,
              },
              {
                x: '2018-12-25',
                y: 2,
                yMin: 1,
                yMax: 4,
              },
              {
                x: '2019-12-25',
                y: 3,
                yMin: 2,
                yMax: 5,
              },
            ],
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'time',
            display: false,
            min: '2017-01-01',
            max: '2020-01-01',
          },
          y: {
            display: false,
          },
        },
      },
    }).toMatchImageSnapshot();
  });
});
