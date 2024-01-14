import Line from './line.js';
import Point from './point.js';
import Intersection from './intersection.js';

export default class IntersectionFactory {
  createIntersection(fisrtLine: Line, secondLine: Line) {
    const secondLineEndY = secondLine.endPoint.y;
    const secondLineStartY = secondLine.startPoint.y;
    const fisrtLineEndX = fisrtLine.endPoint.x;
    const fisrtLineStartX = fisrtLine.startPoint.x;
    const secondLineEndX = secondLine.endPoint.x;
    const secondLineStartX = secondLine.startPoint.x;
    const fisrtLineEndY = fisrtLine.endPoint.y;
    const fisrtLineStartY = fisrtLine.startPoint.y;
    const denom = (secondLineEndY - secondLineStartY) * (fisrtLineEndX - fisrtLineStartX) - (secondLineEndX - secondLineStartX) * (fisrtLineEndY - fisrtLineStartY);

    if (denom == 0) {
      return null;
    }

    const ua = ((secondLineEndX - secondLineStartX) * (fisrtLineStartY - secondLineStartY) - (secondLineEndY - secondLineStartY) * (fisrtLineStartX - secondLineStartX)) / denom;
    const ub = ((fisrtLineEndX - fisrtLineStartX) * (fisrtLineStartY - secondLineStartY) - (fisrtLineEndY - fisrtLineStartY) * (fisrtLineStartX - secondLineStartX)) / denom;

    return new Intersection(
      new Point(
        fisrtLineStartX + ua * (fisrtLineEndX - fisrtLineStartX),
        fisrtLineStartY + ua * (fisrtLineEndY - fisrtLineStartY),
      ),
      ua >= 0 && ua <= 1,
      ub >= 0 && ub <= 1,
    );
  }

  createIntersections(lines: Line[]): (Intersection[])[] {
    return lines.map((lineA, index) => {
      const intersections: Intersection[] = [];

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
