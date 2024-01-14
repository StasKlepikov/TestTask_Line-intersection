import Point from './point.js';

export default class Intersection {
  constructor(
    readonly point: Point,
    readonly seg1: boolean,
    readonly seg2: boolean,
  ) {}
}
