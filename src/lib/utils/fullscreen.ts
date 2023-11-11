export const fullscreen = {
  originalDimensions: { width: 0, height: 0 },
  status: false,
  start: (el: HTMLElement) => {
    if (document.fullscreenElement) return
    el.requestFullscreen()
  },
  stop: () => {
    if (!document.fullscreenElement) return
    document.exitFullscreen()
  },
  toggle: (el: HTMLElement) =>
    document.fullscreenElement ? fullscreen.stop() : fullscreen.start(el),
  getStatus: () => document.fullscreenElement,
  onChange: (enterFsCb: () => void, exitFsCb: () => void) => {
    const wasFullscreen = fullscreen.getStatus()
    wasFullscreen ? enterFsCb() : exitFsCb()
    fullscreen.status = !!wasFullscreen
  },
}
