---
title: Scatter With Error Bars
---

# Scatter With Error Bars

<script setup>
import {config as scatter} from './scatter';
</script>

<ScatterWithErrorBarsChart
  :options="scatter.options"
  :data="scatter.data"
/>

### Code

<<< ./scatter.ts#config
