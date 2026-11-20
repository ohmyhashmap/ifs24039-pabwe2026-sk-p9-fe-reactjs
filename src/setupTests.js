import '@testing-library/jest-dom/vitest'

// JSDOM polyfills required by Toast UI Editor
HTMLCanvasElement.prototype.getContext = () => ({
  fillRect: () => {},
  clearRect: () => {},
  getImageData: () => ({ data: [] }),
  putImageData: () => {},
  createImageData: () => [],
  setTransform: () => {},
  drawImage: () => {},
  save: () => {},
  restore: () => {},
  measureText: () => ({ width: 0 }),
})

window.matchMedia =
  window.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }))

window.getSelection =
  window.getSelection ||
  (() => ({
    removeAllRanges: () => {},
    addRange: () => {},
    getRangeAt: () => ({}),
    rangeCount: 0,
  }))

globalThis.ResizeObserver =
  globalThis.ResizeObserver ||
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
