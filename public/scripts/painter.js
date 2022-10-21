import Line from './line.js';
import IntersectionFactory from './intersection-factory.js';

export default class Painter {
  ctx;
  intersectionFactory;
  existingLines = [];
  isDrawing = false;
  startX = 0;
  startY = 0;
  mouseX = 0;
  mouseY = 0;

  constructor(ctx) {
    this.ctx = ctx;
    this.intersectionFactory = new IntersectionFactory();
  }
  
  draw(canvasWidth, canvasHeight) {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    this.ctx.strokeStyle = "black";
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    this.existingLines.forEach((line) => {
      this.ctx.moveTo(line.startX, line.startY);
      this.ctx.lineTo(line.endX, line.endY);
    })
    this.ctx.stroke();

    if (this.isDrawing) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(this.mouseX, this.mouseY);
      this.ctx.stroke();

      const drawingLine = new Line(this.startX, this.startY, this.mouseX, this.mouseY);
      const drawingLineIntersections = [];

      this.existingLines.forEach((line) => {
        const intersection = this.intersectionFactory.createIntersection(drawingLine, line);

        if (intersection && (intersection.seg1 && intersection.seg2)) {
          drawingLineIntersections.push(intersection);
        }
      })
      
      this.drawCircles(drawingLineIntersections);
    }
    const intersections = this.intersectionFactory.createIntersections(this.existingLines);

    intersections.forEach(lineIntersections => this.drawCircles(lineIntersections));
  }
  
  drawCircle(x, y, radius, fill, stroke, strokeWidth) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);

    if (fill) {
      this.ctx.fillStyle = fill;
      this.ctx.fill();
    }
    if (stroke) {
      this.ctx.lineWidth = strokeWidth;
      this.ctx.strokeStyle = stroke;
      this.ctx.stroke();
    }
  }
  
  drawCircles(lineIntersections) {
    lineIntersections.forEach(
      intersection => this.drawCircle(intersection.x, intersection.y, 8, 'red', 'black',  1),
    );
  }
}
