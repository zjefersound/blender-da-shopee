export class CanvasGrid {
  constructor(canvas, zoom, panOffset) {
    this.canvas = canvas;
    this.zoom = zoom;
    this.panOffset = panOffset;
  }

  // Draw grid with x and y axis
  drawGrid(ctx) {
    const { width, height } = this.canvas;

    ctx.clearRect(0, 0, width, height);

    ctx.save();

    ctx.translate(this.panOffset[0], this.panOffset[1]);
    ctx.scale(this.zoom, this.zoom);

    // Draw x
    ctx.beginPath();
    ctx.moveTo(-width, 0);
    ctx.lineTo(width, 0);
    ctx.strokeStyle = "#DDD";
    ctx.lineWidth = 2 / this.zoom;
    ctx.stroke();

    // Draw y
    ctx.beginPath();
    ctx.moveTo(0, -height);
    ctx.lineTo(0, height);
    ctx.strokeStyle = "#CCC";
    ctx.lineWidth = 2 / this.zoom;
    ctx.stroke();

    ctx.restore();
  }

  setZoomAndPan(zoom, panOffset) {
    this.zoom = zoom;
    this.panOffset = panOffset;
  }
}
