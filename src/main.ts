import CanvasWraper from './canvas-wrapper.js';

const _canvasWrapper = new CanvasWraper(
  document.getElementById('canvas') as HTMLCanvasElement,
  document.getElementById('btn-clear') as HTMLButtonElement,
);
