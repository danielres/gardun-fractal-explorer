<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let centeredX = false
  export let centeredY = false

  let _class = ''
  export { _class as class }

  let dragging = false
  export let width = 500
  export let height = 500
  let startX: number
  let startY: number
  let startWidth: number
  let startHeight: number

  function onMouseDown(e: MouseEvent) {
    dragging = true
    startX = e.clientX
    startY = e.clientY
    startWidth = width
    startHeight = height
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    width = startWidth + dx * (centeredX ? 2 : 1)
    height = startHeight + dy * (centeredY ? 2 : 1)
  }

  const dispatch = createEventDispatcher()

  function onMouseUp() {
    dragging = false
    dispatch('resize', { width, height })
  }
</script>

<svelte:window on:mousemove={onMouseMove} on:mouseup={onMouseUp} />

<div class="stack {_class}" style:width="{width}px" style:height="{height}px">
  <div>
    <slot {width} {height}>CONTENT</slot>
  </div>

  <button
    on:mousedown={onMouseDown}
    type="button"
    style:--size="20px"
    class="triangle place-self-end cursor-nw-resize opacity-20 hover:opacity-100 transition-opacity"
  />
</div>

<style lang="postcss">
  .triangle {
    --size: 40px;
    --color: black;
    width: 0;
    height: 0;
    border-left: var(--size) solid transparent;
    border-right: var(--size) solid transparent;
    border-top: var(--size) solid var(--color);
    transform: rotate(-45deg);
    margin-right: calc(var(--size) / -2);
  }
</style>
