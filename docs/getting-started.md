---
title: Getting Started
---

# Getting Started

Chart.js module for charting error bars plots. This plugin extends the several char types (`bar`, `line`, `scatter`, `polarArea`)
with their error bar equivalent (`barWithErrorBars`, `lineWithErrorBars`, `scatterWithErrorBars`, `polarAreaWithErrorBars`).

## Install

```sh
npm install chart.js chartjs-chart-error-bars
```

## Usage

see [Examples](./examples/)

and [CodePen](https://codepen.io/sgratzl/pen/ZEbqmqx)

## Configuration

### Data Structure

#### Chart types: `bar` and `line`

see TypeScript Interface: [IErrorBarXDataPoint](/api/interfaces/interface.IErrorBarXDataPoint.md)

#### Chart type: `bar` with `indexAxis: 'y'`

see [IErrorBarYDataPoint](/api/interfaces/interface.IErrorBarYDataPoint.md)

#### Chart type: `scatter`

a combination of the previous two ones [IErrorBarXDataPoint](/api/interfaces/interface.IErrorBarXDataPoint.md) and [IErrorBarYDataPoint](/api/interfaces/interface.IErrorBarYDataPoint.md)

#### Chart type: `polarArea`

see [IErrorBarRDataPoint](/api/interfaces/interface.IErrorBarRDataPoint.md)

### Styling

The styling options support different array version.

**Note**: as with other chart.js style options, using an array will be one value per dataset. Thus, to specify the values for different error bars, one needs to wrap it in an object with a `v` key having the value itself. The outer for the dataset, the inner for the error bars.

see TypeScript interface: [IErrorBarOptions](/api/interfaces/interface.IErrorBarOptions.md)
