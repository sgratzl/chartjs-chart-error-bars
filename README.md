# Chart.js Error Bars
[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

Chart.js module for charting error bars plots. This plugin extends the several char types (`bar`, `horizontalBar`, `line`, `scatter`, `polarArea`)
with their error bar equivalent (`barWithErrorBars`, `horizontalBarWithErrorBars`, `lineWithErrorBars`, `scatterWithErrorBars`, `polarAreaWithErrorBars`). In addition, it comes with equivalents for scales (`linearWithErrorBars`, `logarithmicWithErrorBars`, `radialLinearWithErrorBars`) that consider the error bars when computing the data limits.

**Works only with Chart.js >= 2.8.0**

Bar Chart

![bar char with error bars](https://user-images.githubusercontent.com/4129778/65203797-1a9e3b00-da5a-11e9-9de7-9cbcf75dfeda.png)

Horizontal Bar Chart

![horizontal bar chart with error bars](https://user-images.githubusercontent.com/4129778/65203796-1a9e3b00-da5a-11e9-9c43-db503679178c.png)

Line Chart

![line chart with error bars](https://user-images.githubusercontent.com/4129778/65203795-1a05a480-da5a-11e9-98fa-05440371485f.png)

Scatterplot

![scatter plot with error bars](https://user-images.githubusercontent.com/4129778/65203792-1a05a480-da5a-11e9-9073-6e849d42af64.png)

Polar Area plot

![polar area plot with error bars](https://user-images.githubusercontent.com/4129778/65203794-1a05a480-da5a-11e9-9b17-316ecc6ae0d9.png)


## Install

```bash
npm install --save chart.js chartjs-chart-error-bars
```

## Usage
see [Samples](https://github.com/sgratzl/chartjs-chart-error-bars/tree/master/samples) on Github

and [CodePen]()


## Styling
Several new styling keys are added to the indiviual chart types

```typescript
interface IErrorBarStyling {
  /**
   * line width of the center line
   * @default 1
   */
  errorBarLineWidth: number;
  /**
   * color of the center line
   * @default black
   */
  errorBarColor: string;
  /**
   * line width of the whisker lines
   * @default 1
   */
  errorBarWhiskerLineWidth: number;
  /**
   * width of the whiskers in relation to the bar width, use `0` to force a fixed with, see below
   * @default 0.2
   */
  errorBarWhiskerRatio: number;
  /**
   * pixel width of the whiskers for non bar chart cases
   * @default 20
   */
  errorBarWhiskerSize: number;
  /**
   * color of the whisker lines
   * @default black
   */
  errorBarWhiskerColor: string;
}
```

## Data structure

The data structure depends on the chart type. It uses the fact that chart.js is supporting scatterplot. Thus, it is already prepared for object values.

### Chart types: `bar`, `line`, `scatter`, `polarArea`

```typescript
interface IErrorBarItem {
  /**
   * the actual value
   */
  y: number;
  /**
   * the minimal absolute error bar value
   */
  yMin: number;
  /**
   * the maximal absolute error bar value
   */
  yMax: number;
}
```

### Chart type: `horizontalBar`

```typescript
interface IErrorBarItem {
  /**
   * the actual value
   */
  x: number;
  /**
   * the minimal absolute error bar value
   */
  xMin: number;
  /**
   * the maximal absolute error bar value
   */
  xMax: number;
}
```

### Chart type: `scatter`

```typescript
interface IErrorBarItem {
  /**
   * the actual x value
   */
  x: number;
  /**
   * the minimal absolute error bar x value
   */
  xMin: number;
  /**
   * the maximal absolute error bar x value
   */
  xMax: number;
  /**
   * the actual y value
   */
  y: number;
  /**
   * the minimal absolute error bar y value
   */
  yMin: number;
  /**
   * the maximal absolute error bar y value
   */
  yMax: number;
}
```

## Building

```sh
npm install
npm run build
```

[npm-image]: https://badge.fury.io/js/chartjs-chart-error-bars.svg
[npm-url]: https://npmjs.org/package/chartjs-chart-error-bars
[github-actions-image]: https://github.com/sgratzl/chartjs-chart-error-bars/workflows/nodeci/badge.svg
[github-actions-url]: https://github.com/sgratzl/chartjs-chart-error-bars/actions
