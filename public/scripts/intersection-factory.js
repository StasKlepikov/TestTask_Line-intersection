import Intersection from './intersection.js';

export default class IntersectionFactory {
  createIntersection(lineA, lineB) {
    const denom = (lineB.endY - lineB.startY) * (lineA.endX - lineA.startX) - (lineB.endX - lineB.startX) * (lineA.endY - lineA.startY);

    if (denom == 0) {
      return null;
    }

    const ua = ((lineB.endX - lineB.startX) * (lineA.startY - lineB.startY) - (lineB.endY - lineB.startY) * (lineA.startX - lineB.startX)) / denom;
    const ub = ((lineA.endX - lineA.startX) * (lineA.startY - lineB.startY) - (lineA.endY - lineA.startY) * (lineA.startX - lineB.startX)) / denom;

    return new Intersection(
      lineA.startX + ua * (lineA.endX - lineA.startX),
      lineA.startY + ua * (lineA.endY - lineA.startY),
      ua >= 0 && ua <= 1,
      ub >= 0 && ub <= 1,
    );
  }

  createIntersections(lines) {
    return lines.map((lineA, index) => {
      const intersections = [];

      lines.forEach((lineB, lineBIndex) => {
        if (index !== lineBIndex) {
          const intersection = this.createIntersection(lineA, lineB);

          if (intersection && (intersection.seg1 && intersection.seg2)) {
            intersections.push(intersection);
          }
        }
      });

      return intersections;
    });
  }
}
