import {modelKeys} from '../data';

export function calculateErrorBarValuesPixels(controller, model, index, reset) {
  const data = controller.getDataset().data[index];
  if (!data) {
    return;
  }

  const scale = controller._getValueScale();
  const keys = modelKeys(scale.isHorizontal());
  const base = scale.getBasePixel();

  keys.forEach((key) => {
    const v = data[key];
    if (Array.isArray(v)) {
      model[key] = v.map((d) => reset ? base : scale.getPixelForValue(d));
    } else if (typeof v === 'number') {
      model[key] = reset ? base : scale.getPixelForValue(v);
    }
  });
}
