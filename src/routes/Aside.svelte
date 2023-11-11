<script lang="ts">
  import type { Store } from './getStore'

  const controls = { h: 'left', j: 'down', k: 'up', l: 'right', a: 'zoomOut', s: 'zoomIn' }
  export let store: Store
</script>

<div
  class="card stack fixed variant-glass-surface top-0 right-0 bottom-0 pointer-events-none text-xs font-mono p-4"
>
  <div>
    <div class="">
      <h2 class="font-normal text-center">Gardun fractal explorer</h2>
    </div>

    <div class="grid grid-cols-[auto_auto] gap-x-2 gap-y-1 p-4 items-center">
      <div class="text-right">x:</div>
      <div>{Math.floor($store.translateX * 1_000_000) / 1000}</div>

      <div class="text-right">y:</div>
      <div>{Math.floor($store.translateY * 1_000_000) / 1000}</div>

      <div class="text-right self-start">zoom:</div>
      <div class="grid grid-cols-[auto_auto] gap-x-2">
        <div class="text-right">{Math.floor(Math.log($store.zoom) * 1000)}</div>
        <div>(log)</div>
        <div class="text-right">{$store.zoom.toFixed(2)}</div>
        <div>(actual)</div>
      </div>

      <div class="text-right">iterations:</div>
      <div class="flex items-center justify-between">
        <span>{$store.iterations.toFixed(2)}</span>
        <div class="flex items-center gap-1">
          <button class="!p-1" on:click={store.iterations.dec}>-</button>
          <button class="!p-1" on:click={store.iterations.inc}>+</button>
        </div>
      </div>

      <div class="text-right">Luminance:</div>
      <div class="flex items-center justify-between">
        <span>{$store.luminance.toFixed(2)}</span>
        <div class="flex items-center gap-1">
          <button class="!p-1" on:click={store.luminance.dec}>-</button>
          <button class="!p-1" on:click={store.luminance.inc}>+</button>
        </div>
      </div>

      <div class="text-right">Blocksize:</div>
      <div class="flex items-center justify-between">
        <span>{$store.blocksize.toFixed(2)}</span>
        <div class="flex items-center gap-1">
          <button class="!p-1" on:click={store.blocksize.dec}>-</button>
          <button class="!p-1" on:click={store.blocksize.inc}>+</button>
        </div>
      </div>

      <div class="text-right">Rate:</div>
      <div class="flex items-center justify-between">
        <span>{$store.hueShiftRate.toFixed(2)}</span>
        <div class="flex items-center gap-1">
          <button class="!p-1" on:click={store.hueShiftRate.dec}>-</button>
          <button class="!p-1" on:click={store.hueShiftRate.inc}>+</button>
        </div>
      </div>

      <hr class="col-span-2 my-4" />

      {#each Object.entries(controls) as [key, text]}
        <div class="text-right py-0.5">
          <kbd class="kbd">{key}</kbd>
          :
        </div>
        <div class="">{text}</div>
      {/each}
    </div>
  </div>

  <div class="place-self-end">
    <a
      class="
        pointer-events-auto
        opacity-75 hover:opacity-100 transition-opacity flex items-center gap-1 variant-glass-surface p-2 rounded-md"
      href="https://github.com/danielres/gardun-fractal-explorer"
      target="_blank"
      rel="noreferrer"
    >
      <span>Github</span>
      <svg viewBox="0 0 24 24" aria-hidden="true" class="h-6 w-6" fill="currentColor">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"
        />
      </svg>
    </a>
  </div>
</div>

<style lang="postcss">
  button {
    @apply pointer-events-auto;
  }
</style>
