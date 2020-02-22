export function metersToUnit(v: any, unit: 'km') {
  let out = 0
  if (v) {
    out = Number(v)
  }

  if (unit === 'km') {
    out = out / 1000
  }

  if (isNaN(out)) {
    return 0
  }

  return out.toFixed(2)
}
