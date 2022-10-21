import Painter from './painter.js';

export default class CanvasWraper {
  canvas;
  bounds;
  clearButton;
  painter;
  hasLoaded = true;
  canvasWidth = 1400;
  canvasHeight = 650;

  constructor(canvas, clearButton) {
    this.canvas = canvas;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    this.bounds = canvas.getBoundingClientRect();

    canvas.onclick = this.onMouseClick(this);
    canvas.onmousemove = this.onMouseMove(this);
    canvas.oncontextmenu = this.cancelDrawing(this);

    this.clearButton = clearButton;
    this.clearButton.onclick = this.clear(this);

    this.painter = new Painter(this.canvas.getContext('2d'));
    this.painter.draw(this.canvasWidth, this.canvasHeight);
  }

  onMouseMove(canvasWraper) {
    return (event) => {
      if (canvasWraper.hasLoaded) {
        canvasWraper.painter.mouseX = event.clientX - canvasWraper.bounds.left;
        canvasWraper.painter.mouseY = event.clientY - canvasWraper.bounds.top;

        if (canvasWraper.painter.isDrawing) {
          canvasWraper.painter.draw(canvasWraper.canvasWidth, canvasWraper.canvasHeight);
        }
      }
    }
  }

  onMouseClick(canvasWraper) {
    return (event) => {
      if (!canvasWraper.painter.isDrawing) {
        canvasWraper.startDrawing(event);
      } else { 
        canvasWraper.endDrawing(event);
      }
    };
  }
  
  startDrawing(event) {
    if (this.hasLoaded && event.button === 0) {
      if (!this.painter.isDrawing) {
        this.painter.startX = event.clientX - this.bounds.left;
        this.painter.startY = event.clientY - this.bounds.top;
        this.painter.isDrawing = true;
      }
      this.painter.draw(this.canvasWidth, this.canvasHeight);
    }
  }
  
  cancelDrawing(canvasWraper) {
    return (event) => {
      canvasWraper.endDrawing(event, true);

      return false;
    }
  }

  endDrawing(_event, canceled = false) {
    if (this.hasLoaded) {
      if (this.painter.isDrawing && !canceled) {
        this.painter.existingLines.push({
          startX: this.painter.startX,
          startY: this.painter.startY,
          endX: this.painter.mouseX,
          endY: this.painter.mouseY,
        });
      }
      this.painter.isDrawing = false;
      this.painter.draw(this.canvasWidth, this.canvasHeight);
    }
  }
  
  clear(canvasWraper) {
    return (_event) => {
      canvasWraper.painter.existingLines = [];
      canvasWraper.painter.ctx.clearRect(0, 0, canvasWraper.canvasWidth, canvasWraper.canvasHeight);
    }
  }
}
