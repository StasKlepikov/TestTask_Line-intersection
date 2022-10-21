import CanvasWraper from './canvas-wrapper.js';

window.onload = () => {
  new CanvasWraper(
    document.getElementById('canvas'),
    document.querySelector('.but-clear'),
  );
}
