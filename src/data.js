
export const allModelKeys = ['xMin', 'xMax', 'yMin', 'yMax'];

export function modelKeys(horizontal) {
  return horizontal ? allModelKeys.slice(0, 2) : allModelKeys.slice(2);
}

export function isSameArray(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
