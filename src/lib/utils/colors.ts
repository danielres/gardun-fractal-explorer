export function rgbTupleToStr([r, g, b]: [number, number, number]) {
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    h =
      max === r
        ? ((g - b) / d + (g < b ? 6 : 0)) / 6
        : max === g
        ? ((b - r) / d + 2) / 6
        : ((r - g) / d + 4) / 6
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}
export function hslToRgb(h: number, s: number, l: number) {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}
