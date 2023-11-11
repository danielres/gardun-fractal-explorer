<script lang="ts">
  import Resizer from '$lib/components/Resizer.svelte'
  import { cycleCanvasHue } from '$lib/utils/canvas'
  import { debounce } from '$lib/utils/event'
  import { drawMandelbrot } from '$lib/utils/mandelbrot'
  import { onMount, tick } from 'svelte'
  import Aside from './Aside.svelte'
  import { getStore } from './getStore'

  let canvasEl: HTMLCanvasElement

  const m = getStore()

  let redrawTrigger = 0
  let width = 500
  let height = 500

  const controls = [
    { keys: ['h', 'ArrowUp', '8'], fn: m.move.up },
    { keys: ['j', 'ArrowDown', '2'], fn: m.move.down },
    { keys: ['k', 'ArrowLeft', '4'], fn: m.move.left },
    { keys: ['l', 'ArrowRight', '6'], fn: m.move.right },
    { keys: ['a', '5'], fn: m.zoom.inc },
    { keys: ['s', '0'], fn: m.zoom.dec },
  ]

  const debouncedRedrawMandelbrot = debounce(redrawMandelbrot, 200)

  async function redrawMandelbrot() {
    width = canvasEl.clientWidth
    height = canvasEl.clientHeight
    await tick()
    redrawTrigger++
  }

  function animate() {
    cycleCanvasHue(canvasEl, $m.hueShiftRate)
    window.requestAnimationFrame(animate)
  }

  onMount(async () => {
    const ratio = window.innerWidth / window.innerHeight
    height = width / ratio

    await tick()
    redrawMandelbrot()
    animate()
  })

  $: if (canvasEl) {
    redrawTrigger
    drawMandelbrot(canvasEl, $m)
  }
</script>

<svelte:window
  on:keydown={({ key }) => controls.forEach(({ keys, fn }) => keys.includes(key) && fn())}
/>

<div class="fixed top-0 left-0 text-xs opacity-40">
  {redrawTrigger}

  <pre>{JSON.stringify($m, null, 2)}</pre>
  <button class="btn" on:click={() => {}}>aaa</button>
</div>

<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg">
  <Resizer
    {width}
    {height}
    centeredX={true}
    centeredY={true}
    class="ring-black ring-4"
    on:resize={(e) => {
      width = e.detail.width
      height = e.detail.height
      debouncedRedrawMandelbrot()
    }}
  >
    <canvas
      class="w-full h-full absolute bg-black/20"
      bind:this={canvasEl}
      width={width / 1}
      height={height / 1}
    />
  </Resizer>
</div>

<Aside store={m} />
