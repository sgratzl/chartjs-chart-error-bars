---
title: Horizontal Bar With Error Bars
---

# Horizontal Bar With Error Bars

<script setup>
import {config as bar} from './horizontalBar';
</script>

<BarWithErrorBarsChart
  :options="bar.options"
  :data="bar.data"
/>

### Code

<<< ./horizontalBar.ts#config
