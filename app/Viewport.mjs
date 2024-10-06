import { clearCanvas } from "./utils/clearCanvas.mjs";

export class Viewport {
  constructor(ctx, canvas, renderApp) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.offsetX = 0;
    this.offsetY = 0;
    this.startX = 0;
    this.startY = 0;
    this.isPanning = false;
    this.renderApp = renderApp;

    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.scale = 1;

    this.resetTransform();
  }

  startPan(x, y) {
    this.isPanning = true;
    this.startX = x - this.offsetX;
    this.startY = y - this.offsetY;
    this.canvas.style.cursor = "grabbing";
  }

  pan(x, y) {
    if (!this.isPanning) return;

    this.offsetX = x - this.startX;
    this.offsetY = y - this.startY;
    this.applyTransform();
  }

  endPan() {
    this.isPanning = false;
    this.canvas.style.cursor = "grab";
  }

  applyTransform() {
    clearCanvas(this.ctx);
    this.ctx.save();
    this.ctx.setTransform(
      this.scale,
      0,
      0,
      -this.scale,
      this.offsetX + this.width / 2,
      this.offsetY + this.height / 2
    );
    this.renderApp();
  }

  resetTransform() {
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.applyTransform();
  }

  updateSize() {
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.applyTransform();
  }

  zoom(factor) {
    this.scale *= factor;
    this.applyTransform();
  }
}
