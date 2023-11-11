import { paintRect } from './canvas'
import { rgbTupleToStr } from './colors'

export const colorModes = ['original', 'vivid', 'bw'] as const

export function computeRgb(
  t: number,
  luminance: number,
  mode: typeof colorModes[number]
): [number, number, number] {
  if (mode === 'vivid') {
    const r = t * luminance * (Math.sin((t - 85) / 40) + 1)
    const g = t * luminance * (Math.sin((t - 170) / 40) + 0.25)
    const b = ((t * luminance) / 2) * (Math.sin((t - 255) / 40) + 1)

    return [r, g, b]
  }
  if (mode === 'bw') {
    return [t * luminance, t * luminance, t * luminance]
  }

  // original
  return [t * 3, t, t * 0.5]
}

type Options = {
  zoom: number
  translateX: number
  translateY: number
  iterations: number
  luminance: number
  blocksize: number
}

export function drawMandelbrot(canvasEl: HTMLCanvasElement, options: Options) {
  if (!canvasEl) return

  const width = canvasEl.width
  const height = canvasEl.height
  const aspectRatio = width / height

  const context = canvasEl.getContext('2d')
  if (!context) return

  context.clearRect(0, 0, width, height)

  const { zoom, translateX, translateY, iterations, luminance, blocksize } = options

  for (let y = 1; y < height; y++) {
    for (let x = 1; x < width; x++) {
      const dx = (aspectRatio * (x - width / 2)) / (width * zoom) - translateX
      const dy = (y - height / 2) / (height * zoom) - translateY
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
