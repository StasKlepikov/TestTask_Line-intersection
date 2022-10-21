class CanvasWraper {
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

class Painter {
  ctx;
  existingLines = [];
  isDrawing = false;
  startX = 0;
  startY = 0;
  mouseX = 0;
  mouseY = 0;

  constructor(ctx) {
    this.ctx = ctx;
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
        const intersection = Line.lineIntersect(drawingLine, line);

        if (intersection && (intersection.seg1 && intersection.seg2)) {
          drawingLineIntersections.push(intersection);
        }
      })
      
      this.drawCircles(drawingLineIntersections);
    }
    const intersections = Line.linesIntersect(this.existingLines);

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
      intersection => this.drawCircle(intersection.x, intersection.y, 8, 'red', 'black',  1)
    );
  }
}

class Line {
  startX;
  startY;
  endX;
  endY;

  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }

  static lineIntersect(lineA, lineB) {
    const denom = (lineB.endY - lineB.startY) * (lineA.endX - lineA.startX) - (lineB.endX - lineB.startX) * (lineA.endY - lineA.startY);
    
    if (denom == 0) {
      return null;
    }

    const ua = ((lineB.endX - lineB.startX) * (lineA.startY - lineB.startY) - (lineB.endY - lineB.startY) * (lineA.startX - lineB.startX)) / denom;
    const ub = ((lineA.endX - lineA.startX) * (lineA.startY - lineB.startY) - (lineA.endY - lineA.startY) * (lineA.startX - lineB.startX)) / denom;

    return {
      x: lineA.startX + ua * (lineA.endX - lineA.startX),
      y: lineA.startY + ua * (lineA.endY - lineA.startY),
      seg1: ua >= 0 && ua <= 1,
      seg2: ub >= 0 && ub <= 1
    };
  }

  static linesIntersect(array) {
    return array.map((lineA, index) => {
      const intersections = [];

      array.forEach((lineB, lineBIndex) => {
        if (index !== lineBIndex) {
          const intersection = Line.lineIntersect(lineA, lineB)

          if (intersection && (intersection.seg1 && intersection.seg2)) {
            intersections.push(intersection);
          }
        }
      });

      return intersections;
    });
  };
}

window.onload = () => {
  new CanvasWraper(
    document.getElementById('canvas'),
    document.querySelector('.but-clear'),
  );
}
