<script lang="ts">
  import Resizer from '$lib/components/Resizer.svelte'
  import Fullscreen from '$lib/components/icons/Fullscreen.svelte'
  import { cycleCanvasHue } from '$lib/utils/canvas'
  import { debounce } from '$lib/utils/event'
  import { fullscreen } from '$lib/utils/fullscreen'
  import { drawMandelbrot } from '$lib/utils/mandelbrot'
  import { onMount, tick } from 'svelte'
  import { swipe, pinch as untypedPinch } from 'svelte-gestures'
  import FullscreenExit from './../lib/components/icons/FullscreenExit.svelte'
  import { getStore } from './getStore'

  const pinch: any = untypedPinch // hack for types issues (https://github.com/Rezi/svelte-gestures/issues/18#issuecomment-1563648761)

  let canvasEl: HTMLCanvasElement
  let canvasWithUiEl: HTMLElement

  let width = 500
  let height = 500
  let redrawTrigger = 1
  const ui = { hidden: false }

  const m = getStore()

  const controls = [
    { keys: ['h', 'ArrowUp', '8'], fn: m.move.up },
    { keys: ['j', 'ArrowDown', '2'], fn: m.move.down },
    { keys: ['k', 'ArrowLeft', '4'], fn: m.move.left },
    { keys: ['l', 'ArrowRight', '6'], fn: m.move.right },
    { keys: ['a', '5'], fn: m.zoom.inc },
    { keys: ['s', '0'], fn: m.zoom.dec },
    { keys: ['f'], fn: () => fullscreen.toggle(canvasWithUiEl) },
  ]

  async function redrawMandelbrot() {
    width = canvasEl.clientWidth
    height = canvasEl.clientHeight
    await tick()
    redrawTrigger++
  }

  const debouncedRedrawMandelbrot = debounce(redrawMandelbrot, 200)

  function animate() {
    cycleCanvasHue(canvasEl, $m.hueShiftRate)
    window.requestAnimationFrame(animate)
  }

  function setSafeDimensions() {
    const ratio = window.innerWidth / window.innerHeight
    width = window.innerWidth / 1.5
    if (width > 1000) width = 1000
    if (width < 100) width = 100
    height = width / ratio
  }

  onMount(async () => {
    setSafeDimensions()
    await tick()
    redrawMandelbrot()
    animate()
  })

  $: if (canvasEl && redrawTrigger) drawMandelbrot(canvasEl, $m)

  function onPinch(e: CustomEvent & { detail: { scale: number } }) {
    e.detail.scale < 1 ? m.zoom.dec() : m.zoom.inc()
  }

  function onKeyDown(e: KeyboardEvent) {
    controls.forEach(({ keys, fn }) => keys.includes(e.key) && fn())
  }

  function onWindowResize() {
    setSafeDimensions()
    debouncedRedrawMandelbrot()
  }

  function onFullScreenChange() {
    fullscreen.onChange(
      () => {
        fullscreen.originalDimensions.width = width
        fullscreen.originalDimensions.height = height
        debouncedRedrawMandelbrot()
      },
      () => {
        width = fullscreen.originalDimensions.width
        height = fullscreen.originalDimensions.height
        debouncedRedrawMandelbrot()
      }
    )
  }

  function onSwipe(e: CustomEvent & { detail: { direction: string } }) {
    switch (e.detail.direction) {
      case 'top':
        m.move.down()
        break
      case 'bottom':
        m.move.up()
        //
        break
      case 'left':
        m.move.right()
        break
      case 'right':
        m.move.left()
        break
    }
  }
</script>

<svelte:window
  on:keydown={onKeyDown}
  on:resize={onWindowResize}
  on:fullscreenchange={onFullScreenChange}
/>

<div class="fixed top-0 left-0 text-xs opacity-40">
  <pre>{JSON.stringify($m, null, 2)}</pre>
</div>

<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg">
  <Resizer
    {width}
    {height}
    showHandle={!ui.hidden}
    centeredX={true}
    centeredY={true}
    class="ring-black ring-4"
    on:resize={(e) => {
      width = e.detail.width
      height = e.detail.height
      debouncedRedrawMandelbrot()
    }}
  >
    <div bind:this={canvasWithUiEl}>
      <canvas
        bind:this={canvasEl}
        use:pinch
        on:swipe={onSwipe}
        use:swipe={{ timeframe: 300, minSwipeDistance: 100 }}
        on:pinch={onPinch}
        on:click={() => (ui.hidden = !ui.hidden)}
        class="w-full h-full absolute bg-black/20 cursor-pointer"
        width={width / 1}
        height={height / 1}
      />
      <div class:hidden={ui.hidden}>
        <button
          on:click={() => fullscreen.toggle(canvasWithUiEl)}
          class="absolute right-1 top-1 w-6 h-6 text-white bg-black/25 p-1"
        >
          {#if fullscreen.status}<FullscreenExit />{:else}<Fullscreen />{/if}
        </button>
      </div>
    </div>
  </Resizer>
</div>

{#if !ui.hidden}
  <!-- <Aside store={m} /> -->
{/if}
