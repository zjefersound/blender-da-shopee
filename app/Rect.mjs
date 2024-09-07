import { RECT_TYPES } from "./constants.mjs";

export class Rect {
  constructor(type, name, position) {
    this.id = Math.random();
    this.type = type;
    this.name = name;
    this.position = position;
  }
  setName(name) {
    this.name = name;
  }
  draw(ctx) {
    if (this.type === RECT_TYPES.dot) {
      ctx.beginPath();
      ctx.arc(this.position[0], this.position[1], 3, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
    } else if (this.type === RECT_TYPES.line) {
      ctx.beginPath();
      ctx.moveTo(this.position[0][0], this.position[0][1]);
      ctx.lineTo(this.position[1][0], this.position[1][1]);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (this.type === RECT_TYPES.polygon) {
      ctx.beginPath();
      ctx.moveTo(this.position[0][0], this.position[0][1]);
      for (let i = 1; i < this.position.length; i++) {
        ctx.lineTo(this.position[i][0], this.position[i][1]);
      }
      ctx.closePath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    else {
      console.error("\"" + this.name + "\" has an unknown Rect type.")
    }
  }
}