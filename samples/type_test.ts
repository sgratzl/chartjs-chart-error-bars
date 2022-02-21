import { Chart, LinearScale, CategoryScale } from 'chart.js';
import { BarWithErrorBarsController, BarWithErrorBar } from '../build';

// register controller in chart.js and ensure the defaults are set
Chart.register(BarWithErrorBarsController, BarWithErrorBar, LinearScale, CategoryScale);

const ctx = document.querySelector('canvas').getContext('2d');

const myBar = new Chart(ctx, {
  type: 'barWithErrorBars',
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
    elements: {
      barWithErrorBar: {
        errorBarLineWidth: 5,
      },
    },
  },
});

const myScatter = new Chart(ctx, {
  type: 'scatterWithErrorBars',
  data: {
    labels: ['A', 'B'],
    datasets: [
      {
        data: [
          {
            y: 4,
            yMin: 1,
            yMax: 6,
            x: 4,
            xMin: 4,
            xMax: 5,
          },
          {
            y: 2,
            yMin: 1,
            yMax: 4,
            x: 4,
            xMin: 4,
            xMax: 5,
          },
        ],
      },
    ],
  },
  options: {
    elements: {
      pointWithErrorBar: {
        errorBarLineWidth: 5,
      },
    },
  },
});

const myArc = new Chart(ctx, {
  type: 'polarAreaWithErrorBars',
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
    elements: {
      arcWithErrorBar: {
        errorBarLineWidth: 5,
      },
    },
  },
});
