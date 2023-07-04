---
title: Line With Error Bars
---

# Lien With Error Bars

<script setup>
import {config as line} from './line';
</script>

<LineWithErrorBarsChart
  :options="line.options"
  :data="line.data"
/>

### Code

<<< ./line.ts#config
