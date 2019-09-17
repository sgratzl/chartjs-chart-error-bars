
export function modelKeys(horizontal) {
  return horizontal ? ['xMin', 'xMax'] : ['yMin', 'yMax'];
}

export function isSameArray(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
