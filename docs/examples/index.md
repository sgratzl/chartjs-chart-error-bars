---
title: Examples
---

# Examples

<script setup>
import {config as bar} from './bar';
import {config as line} from './line';
import {config as scatter} from './scatter';
import {config as polarArea} from './polarArea';
</script>

## Bar With Error Bars

<BarWithErrorBarsChart
  :options="bar.options"
  :data="bar.data"
/>

### Code

<<< ./bar.ts#config

## Line With Error Bars

<LineWithErrorBarsChart
  :options="line.options"
  :data="line.data"
/>

### Code

<<< ./line.ts#config

## Scatter With Error Bars

<ScatterWithErrorBarsChart
  :options="scatter.options"
  :data="scatter.data"
/>

### Code

<<< ./scatter.ts#config

## Polar Area With Error Bars

<PolarAreaWithErrorBarsChart
  :options="polarArea.options"
  :data="polarArea.data"
/>

### Code

<<< ./polarArea.ts#config
