import Painter from './painter.js';
export default class CanvasWraper {
    constructor(canvas, clearButton) {
        this.canvas = canvas;
        this.clearButton = clearButton;
        this.hasLoaded = true;
        this.canvasWidth = 1400;
        this.canvasHeight = 650;
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
    onMouseMove(canvasWraper) {
        return (event) => {
            if (canvasWraper.hasLoaded) {
                canvasWraper.painter.mousePoint.x = event.clientX - canvasWraper.bounds.left;
                canvasWraper.painter.mousePoint.y = event.clientY - canvasWraper.bounds.top;
                if (canvasWraper.painter.isDrawing) {
                    canvasWraper.painter.draw(canvasWraper.canvasWidth, canvasWraper.canvasHeight);
                }
            }
        };
    }
    onMouseClick(canvasWraper) {
        return (event) => {
            if (!canvasWraper.painter.isDrawing) {
                canvasWraper.startDrawing(event);
            }
            else {
                canvasWraper.endDrawing();
            }
        };
    }
    cancelDrawing(canvasWraper) {
        return () => {
            canvasWraper.endDrawing(true);
            return false;
        };
    }
    clear(canvasWraper) {
        const enableBtn = () => this.clearButton.disabled = false;
        return () => {
            this.clearButton.disabled = true;
            canvasWraper.painter.collapse(canvasWraper.canvasWidth, canvasWraper.canvasHeight, enableBtn);
        };
    }
    startDrawing(event) {
        if (this.hasLoaded && event.button === 0) {
            this.painter.startDrawing(this.canvasWidth, this.canvasHeight, event.clientX - this.bounds.left, event.clientY - this.bounds.top);
        }
    }
    endDrawing(canceled = false) {
        if (this.hasLoaded) {
            this.painter.endDrawing(this.canvasWidth, this.canvasHeight, canceled);
        }
    }
}
