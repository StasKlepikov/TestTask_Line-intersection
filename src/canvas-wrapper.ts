import Painter from './painter.js';

export default class CanvasWraper {
  bounds;
  painter;
  hasLoaded = true;
  canvasWidth = 1400;
  canvasHeight = 650;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly clearButton: HTMLButtonElement,
  ) {
    const ctx = this.canvas.getContext('2d');
  
    if (!ctx) {
      throw new Error('2d context is missing');
    }
  
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    this.bounds = canvas.getBoundingClientRect();

    canvas.onclick = this.onMouseClick(this);
    canvas.onmousemove = this.onMouseMove(this);
    canvas.oncontextmenu = this.cancelDrawing(this);

    this.clearButton.onclick = this.clear(this);

    this.painter = new Painter(ctx);
    this.painter.draw(this.canvasWidth, this.canvasHeight);
  }

  onMouseMove(canvasWraper: CanvasWraper) {
    return (event: MouseEvent) => {
      if (canvasWraper.hasLoaded) {
        canvasWraper.painter.mousePoint.x = event.clientX - canvasWraper.bounds.left;
        canvasWraper.painter.mousePoint.y = event.clientY - canvasWraper.bounds.top;

        if (canvasWraper.painter.isDrawing) {
          canvasWraper.painter.draw(canvasWraper.canvasWidth, canvasWraper.canvasHeight);
        }
      }
    }
  }

  onMouseClick(canvasWraper: CanvasWraper) {
    return (event: MouseEvent) => {
      if (!canvasWraper.painter.isDrawing) {
        canvasWraper.startDrawing(event);
      } else { 
        canvasWraper.endDrawing();
      }
    };
  }
  
  cancelDrawing(canvasWraper: CanvasWraper) {
    return () => {
      canvasWraper.endDrawing(true);

      return false;
    }
  }
  
  clear(canvasWraper: CanvasWraper) {
    return () => {
      canvasWraper.painter.collapse(canvasWraper.canvasWidth, canvasWraper.canvasHeight);
    }
  }

  startDrawing(event: MouseEvent) {
    if (this.hasLoaded && event.button === 0) {
      this.painter.startDrawing(
        this.canvasWidth,
        this.canvasHeight,
        event.clientX - this.bounds.left,
        event.clientY - this.bounds.top,
      )
    }
  }
  
  endDrawing(canceled: boolean = false) {
    if (this.hasLoaded) {
      this.painter.endDrawing(this.canvasWidth, this.canvasHeight, canceled);
    }
  }
}
