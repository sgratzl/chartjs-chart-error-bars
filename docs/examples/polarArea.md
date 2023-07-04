---
title: Polar Area With Error Bars
---

# Polar Area With Error Bars

<script setup>
import {config as polarArea} from './polarArea';
</script>

<PolarAreaWithErrorBarsChart
  :options="polarArea.options"
  :data="polarArea.data"
/>

### Code

<<< ./polarArea.ts#config
