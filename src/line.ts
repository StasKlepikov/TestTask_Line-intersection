import Point from './point.js';

export default class Line {
  constructor(
    readonly startPoint: Point,
    readonly endPoint: Point,
  ) {}

  getSize() {
    return Math.sqrt(
      Math.pow(this.endPoint.x - this.startPoint.x, 2)
      + Math.pow(this.endPoint.y - this.startPoint.y, 2)
    );
  }
}
