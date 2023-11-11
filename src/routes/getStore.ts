import { derived, writable } from 'svelte/store'

export type Store = ReturnType<typeof getStore>

export const getStore = () => {
  const base = writable({
    ...{
      blocksize: 2,
      translateX: 0.8,
      translateY: 0,
      zoom: 0.5,
      hueShiftRate: -1,
      iterationsMultiplier: 2,
      luminanceMultiplier: 1,
    },
    // ...{
    //   blocksize: 2,
    //   translateX: 0.8207927225471086,
    //   translateY: -0.2105263157894737,
    //   zoom: 28.856249999999996,
    //   hueShiftRate: -2,
    //   iterationsMultiplier: 2,
    //   luminanceMultiplier: 1.2,
    //   luminance: 1.235676806695825,
    // },
  })

  const luminance = derived(base, ($b) => ({
    luminance: (7 / Math.log($b.zoom * 10)) * $b.luminanceMultiplier,
  }))

  const iterations = {
    ...derived(base, ($b) => ({
      iterations: Math.max(40, Math.log($b.zoom) * 30) * $b.iterationsMultiplier,
    })),
  }
  const all = derived([base, luminance, iterations], ([$b, $l, $i]) => ({ ...$b, ...$l, ...$i }))

  return {
    ...all,

    move: {
      left: () => base.update((s) => ({ ...s, translateX: s.translateX + 0.2 / s.zoom })),
      right: () => base.update((s) => ({ ...s, translateX: s.translateX - 0.2 / s.zoom })),
      down: () => base.update((s) => ({ ...s, translateY: s.translateY - 0.2 / s.zoom })),
      up: () => base.update((s) => ({ ...s, translateY: s.translateY + 0.2 / s.zoom })),
    },

    zoom: {
      inc: () => base.update((s) => ({ ...s, zoom: s.zoom * 1.5 })),
      dec: () => base.update((s) => ({ ...s, zoom: s.zoom / 1.5 })),
    },

    iterations: {
      inc: () => base.update((s) => ({ ...s, iterationsMultiplier: s.iterationsMultiplier * 2 })),
      dec: () => base.update((s) => ({ ...s, iterationsMultiplier: s.iterationsMultiplier / 2 })),
    },

    luminance: {
      inc: () => base.update((s) => ({ ...s, luminanceMultiplier: s.luminanceMultiplier * 2 })),
      dec: () => base.update((s) => ({ ...s, luminanceMultiplier: s.luminanceMultiplier / 2 })),
    },

    blocksize: {
      inc: () => base.update((s) => ({ ...s, blocksize: s.blocksize * 1.5 })),
      dec: () => base.update((s) => ({ ...s, blocksize: s.blocksize / 1.5 })),
    },

    hueShiftRate: {
      inc: () =>
        base.update((s) => ({ ...s, hueShiftRate: s.hueShiftRate ? s.hueShiftRate * 1.5 : 0.3 })),
      dec: () =>
        base.update((s) => ({
          ...s,
          hueShiftRate: s.hueShiftRate < 0.3 ? 0 : s.hueShiftRate / 1.5,
        })),
    },
  }
}
