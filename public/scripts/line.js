export default class Line {
    constructor(startPoint, endPoint) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }
    getSize() {
        return Math.sqrt(Math.pow(this.endPoint.x - this.startPoint.x, 2)
            + Math.pow(this.endPoint.y - this.startPoint.y, 2));
    }
}
