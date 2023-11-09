import { paintRect } from './canvas'
import { rgbTupleToStr } from './colors'

export function computeRgb(
  t: number,
  luminance: number,
  mode: 'original' | 'vivid' | 'bw' = 'original'
): [number, number, number] {
  if (mode === 'vivid') {
    const r = t * luminance * (Math.sin((t - 85) / 20) + 1)
    const g = t * luminance * (Math.sin((t - 170) / 20) + 1)
    const b = t * luminance * (Math.sin((t - 255) / 20) + 1)

    return [r, g, b]
  }
  if (mode === 'bw') {
    return [t * luminance, t * luminance, t * luminance]
  }

  // original
  return [t * 3, t, t * 0.5]
}

export function drawMandelbrot(
  canvasEl: HTMLCanvasElement,
  SIZE: number,
  zoom: number,
  translateX: number,
  translateY: number,
  iterations: number,
  luminance: number,
  blocksize: number
) {
  if (!canvasEl) return
  const context = canvasEl.getContext('2d')

  if (!context) return

  context.clearRect(0, 0, SIZE, SIZE)

  for (let y = 1; y < SIZE; y++) {
    for (let x = 1; x < SIZE; x++) {
      const dx = (x - SIZE / 2) / (SIZE * zoom) - translateX
      const dy = (y - SIZE / 2) / (SIZE * zoom) - translateY
      let a = dx
      let b = dy

      for (let t = 1; t < iterations; t++) {
        const d = a * a - b * b + dx
        b = 2 * (a * b) + dy
        a = d

        const H = d > iterations
        if (H) {
          const rgbTuple = computeRgb(t, luminance, 'vivid')
          const str = rgbTupleToStr(rgbTuple)
          if (context) paintRect(context, x, y, blocksize, str)
          break
        }
      }
    }
  }
}
