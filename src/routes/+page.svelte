<script lang="ts">
  import Chevron from '$lib/components/icons/Chevron.svelte'
  import { cycleCanvasHue } from '$lib/utils/canvas'
  import { drawMandelbrot } from '$lib/utils/mandelbrot'
  import { onMount } from 'svelte'

  let canvasEl: HTMLCanvasElement

  const SIZE = 500
  let blocksize = 1.75
  let translateX = 0.8
  let translateY = 0
  let zoom = 0.35
  let hueShift = 2
  $: luminance = 7 / Math.log(zoom * 10)
  $: iterations = Math.max(40, Math.log(zoom) * 30)

  $: if (canvasEl)
    drawMandelbrot(canvasEl, SIZE, zoom, translateX, translateY, iterations, luminance, blocksize)

  const left = () => (translateX += 0.2 / zoom)
  const right = () => (translateX -= 0.2 / zoom)
  const down = () => (translateY -= 0.2 / zoom)
  const up = () => (translateY += 0.2 / zoom)
  const zoomIn = () => (zoom = zoom * 1.5)
  const zoomOut = () => (zoom = zoom / 1.5)

  function animate() {
    cycleCanvasHue(canvasEl, hueShift)
    window.requestAnimationFrame(animate)
  }

  onMount(animate)

  const controls = { h: 'left', j: 'down', k: 'up', l: 'right', a: 'zoomOut', s: 'zoomIn' }
</script>

<svelte:window
  on:keydown={({ key }) => {
    if (key === 'h') left()
    if (key === 'j') down()
    if (key === 'k') up()
    if (key === 'l') right()
    if (key === 'a') zoomOut()
    if (key === 's') zoomIn()
  }}
/>

<div class="mt-16">
  <div class="w-fit mx-auto grid justify-items-center gap-2">
    <div>
      <button on:click={zoomOut}>-</button>
      <button on:click={zoomIn}>+</button>
    </div>

    <div class="grid grid-cols-[auto_1fr_auto] items-center justify-items-center gap-2">
      <div />

      <div>
        <button class="-rotate-90" on:click={up}><Chevron /></button>
      </div>

      <div />

      <div>
        <button class="rotate-180" on:click={left}><Chevron /></button>
      </div>

      <div style:width="{SIZE}px" style:height="{SIZE}px" class="border border-black">
        <canvas class="bg-black/100" bind:this={canvasEl} width={SIZE} height={SIZE} />
      </div>

      <div>
        <button on:click={right}><Chevron /></button>
      </div>

      <div />

      <div>
        <button class="rotate-90" on:click={down}><Chevron /></button>
      </div>

      <div />
    </div>
  </div>
</div>

<div
  class="card top-1/2 -translate-y-1/2 grid grid-cols-[auto_auto] gap-x-2 gap-y-1 fixed variant-glass-surface right-8 p-4 text-xs font-mono items-center"
>
  <div class="text-right">x:</div>
  <div>{Math.floor(translateX * 1_000_000) / 1000}</div>
  <div class="text-right">y:</div>
  <div>{Math.floor(translateY * 1_000_000) / 1000}</div>
  <div class="text-right self-start">zoom:</div>
  <div class="grid grid-cols-[auto_auto] gap-x-2">
    <div class="text-right">{Math.floor(Math.log(zoom) * 1000)}</div>
    <div>(log)</div>
    <div class="text-right">{zoom.toFixed(2)}</div>
    <div>(actual)</div>
  </div>
  <div class="text-right">iterations:</div>
  <div class="flex items-center justify-between">
    <span>{iterations.toFixed(2)}</span>
    <div class="flex items-center gap-1">
      <button class="!p-1" on:click={() => (iterations /= 2)}>-</button>
      <button class="!p-1" on:click={() => (iterations *= 2)}>+</button>
    </div>
  </div>
  <div class="text-right">Luminance:</div>
  <div class="flex items-center justify-between">
    <span>{luminance.toFixed(2)}</span>
    <div class="flex items-center gap-1">
      <button class="!p-1" on:click={() => (luminance /= 2)}>-</button>
      <button class="!p-1" on:click={() => (luminance *= 2)}>+</button>
    </div>
  </div>
  <div class="text-right">Blocksize:</div>
  <div class="flex items-center justify-between">
    <span>{blocksize.toFixed(2)}</span>
    <div class="flex items-center gap-1">
      <button class="!p-1" on:click={() => (blocksize -= 0.25)}>-</button>
      <button class="!p-1" on:click={() => (blocksize += 0.25)}>+</button>
    </div>
  </div>
  <div class="text-right">Hue shift:</div>
  <div class="flex items-center justify-between">
    <span>{hueShift}</span>
    <div class="flex items-center gap-1">
      <button class="!p-1" on:click={() => (hueShift -= 0.5)}>-</button>
      <button class="!p-1" on:click={() => (hueShift += 0.5)}>+</button>
    </div>
  </div>

  <hr class="col-span-2 my-4" />
  {#each Object.entries(controls) as [key, text]}
    <div class="text-right">
      <kbd class="kbd">{key}</kbd>
      :
    </div>
    <div class="">{text}</div>
  {/each}
</div>

<style lang="postcss">
  .grid button {
    @apply btn variant-glass-surface aspect-square rounded-full p-2;
  }
</style>
