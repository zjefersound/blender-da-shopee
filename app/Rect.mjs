import { RECT_TYPES } from "./constants.mjs";
import { Layer } from "./Layer.mjs";

export class Rect extends Layer {
  constructor(type, name, position) {
    super(type, name);
    this.position = position;
  }

  rotate(degrees) {
    const angle = (-degrees * Math.PI) / 180;
    const center = this.getCenter();

    this.position = this.position.map((point) =>
      this.rotatePoint(point, center, angle)
    );
  }

  rotateOrigin(degrees) {
    const angle = (-degrees * Math.PI) / 180;
    const center = [0, 0];

    this.position = this.position.map((point) =>
      this.rotatePoint(point, center, angle)
    );
  }

  rotatePoint(point, center, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const [x, y] = point;
    const [cx, cy] = center;

    const newX = cos * (x - cx) - sin * (y - cy) + cx;
    const newY = sin * (x - cx) + cos * (y - cy) + cy;

    return [newX, newY];
  }

  getCenter() {
    let sumX = 0,
      sumY = 0;
    for (let point of this.position) {
      sumX += point[0];
      sumY += point[1];
    }
    return [sumX / this.position.length, sumY / this.position.length];
  }

  draw(ctx) {
    if (this.type === RECT_TYPES.dot) {
      ctx.beginPath();
      ctx.arc(this.position[0], this.position[1], 3, 0, Math.PI * 2);
      ctx.fillStyle = "black";
      ctx.fill();
    } else if (this.type === RECT_TYPES.line) {
      ctx.beginPath();
      ctx.moveTo(this.position[0][0], this.position[0][1]);
      ctx.lineTo(this.position[1][0], this.position[1][1]);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (this.type === RECT_TYPES.polygon) {
      ctx.beginPath();
      ctx.moveTo(this.position[0][0], this.position[0][1]);
      for (let i = 1; i < this.position.length; i++) {
        ctx.lineTo(this.position[i][0], this.position[i][1]);
      }
      ctx.closePath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (this.type === RECT_TYPES.lines) {
      ctx.beginPath();
      ctx.moveTo(this.position[0][0], this.position[0][1]);
      for (let i = 1; i < this.position.length; i++) {
        ctx.lineTo(this.position[i][0], this.position[i][1]);
      }
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      console.error('"' + this.name + '" has an unknown Rect type.');
    }
  }
}
