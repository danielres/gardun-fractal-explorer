export const doubleClick = {
  lastClick: 0,
  delay: 300,
  detect: (fn: () => void) => {
    const now = Date.now()
    if (now - doubleClick.lastClick < doubleClick.delay) fn()
    doubleClick.lastClick = now
  },
}
