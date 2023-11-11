import { hslToRgb, rgbToHsl } from './colors'

function cycleImageDataHue(
  data: Uint8ClampedArray,
  hueShift: number,
  saturation = 60,
  lightness = 50
) {
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]]

    const hsl = rgbToHsl(r, g, b)
    hsl[1] = saturation
    hsl[2] = lightness

    // Shift the hue value
    hsl[0] += hueShift
    if (hsl[0] > 360) hsl[0] -= 360

    const [newR, newG, newB] = hslToRgb(hsl[0], hsl[1], hsl[2])

    // Update the pixel data
    data[i] = newR
    data[i + 1] = newG
    data[i + 2] = newB
  }
}

export function cycleCanvasHue(canvas: HTMLCanvasElement, hueShift = 3) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  cycleImageDataHue(imageData.data, hueShift)
  ctx.putImageData(imageData, 0, 0)
}

export function paintRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rgb: string
) {
  context.fillStyle = rgb
  context.fillRect(x, y, size, size)
}
