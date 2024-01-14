import Line from './line.js';
import Point from './point.js';
import IntersectionFactory from './intersection-factory.js';

export default class Painter {

  constructor(ctx) {
    this.ctx = ctx;
    this.existingLines = [];
    this.startPoint = new Point(0, 0);
    this.mousePoint = new Point(0, 0);
    this._isDrawing = false;
    this.intersectionFactory = new IntersectionFactory();
  }

  get isDrawing() {
    return this._isDrawing;
  }

  draw(canvasWidth, canvasHeight) {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    this.ctx.strokeStyle = 'black';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    this.existingLines.forEach((line) => {
      this.ctx.moveTo(line.startPoint.x, line.startPoint.y);
      this.ctx.lineTo(line.endPoint.x, line.endPoint.y);
    });
    this.ctx.stroke();

    if (this._isDrawing) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
      this.ctx.lineTo(this.mousePoint.x, this.mousePoint.y);
      this.ctx.stroke();
      const drawingLine = new Line(new Point(this.startPoint.x, this.startPoint.y), new Point(this.mousePoint.x, this.mousePoint.y));
      const drawingLineIntersections = [];

      this.existingLines.forEach((line) => {
        const intersection = this.intersectionFactory.createIntersection(drawingLine, line);

        if (intersection && (intersection.seg1 && intersection.seg2)) {
          drawingLineIntersections.push(intersection);
        }
      });
      this.drawCircles(drawingLineIntersections);
    }

    const intersections = this.intersectionFactory.createIntersections(this.existingLines);
    intersections.forEach(lineIntersections => this.drawCircles(lineIntersections));
  }

  endDrawing(canvasWidth, canvasHeight, canceled = false) {
    if (this._isDrawing && !canceled) {
      this.existingLines.push(new Line(new Point(this.startPoint.x, this.startPoint.y), new Point(this.mousePoint.x, this.mousePoint.y)));
    }

    this._isDrawing = false;
    this.draw(canvasWidth, canvasHeight);
  }

  startDrawing(canvasWidth, canvasHeight, newX, newY) {

    if (!this._isDrawing) {
      this.startPoint.x = newX;
      this.startPoint.y = newY;
      this._isDrawing = true;
    }

    this.draw(canvasWidth, canvasHeight);
  }

  clear(canvasWidth, canvasHeight) {
    this.existingLines = [];
    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  drawCircle({
    x,
    y
  }, radius, fill, stroke, strokeWidth) {
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
    lineIntersections.forEach(intersection => this.drawCircle(intersection.point, 8, 'red', 'black', 1));
  }

  collapse(canvasWidth, canvasHeight) {
    const reductionVectors = this.existingLines.map((line) => {
      const reductionVector = new Point(line.endPoint.x - line.startPoint.x, line.endPoint.y - line.startPoint.y);
      return {
        line,
        reductionVector
      };
    });
    const duration = 3000;
    const startTime = (new Date()).getTime();

    function getMultiplier() {
      const currentTime = (new Date()).getTime();
      const coefficient = (currentTime - startTime) / (duration);

      return (1 - Math.cos((coefficient * Math.PI) / 2)) * 0.5;
    }

    const interval = setInterval(() => {
      if (this.existingLines.length == 0) {
        return clearInterval(interval);
      }

      const newLines = reductionVectors.map(({
        line,
        reductionVector
      }) => {
        const multiplier = getMultiplier();
        const startPoint = new Point(line.startPoint.x + reductionVector.x * multiplier, line.startPoint.y + reductionVector.y * multiplier);
        const endPoint = new Point(line.endPoint.x - reductionVector.x * multiplier, line.endPoint.y - reductionVector.y * multiplier);
        const newLine = new Line(startPoint, endPoint);
        const vector = new Point(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
        
        return (Math.sign(reductionVector.x) === Math.sign(vector.x) &&
          Math.sign(reductionVector.y) === Math.sign(vector.y)) ? newLine : null;
      });

      this.existingLines = newLines.filter((line) => line !== null);
      this.draw(canvasWidth, canvasHeight);
    }, 1000 / 60);
  }
}