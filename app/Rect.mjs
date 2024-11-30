import { RECT_TYPES } from "./constants.mjs";
import { Layer } from "./Layer.mjs";

export class Rect extends Layer {
  constructor(type, name, position) {
    super(type, name);
    this.position = position.map(([x, y, z = 0]) => [x, y, z]);
  }

  setPosition(position) {
    this.position = position.map(([x, y, z = 0]) => [x, y, z]);
  }

  rotate(degrees) {
    const point = Array.isArray(this.position[0])
      ? this.position[0]
      : this.position;
    this.rotateAroundPoint(degrees, point);
  }

  rotateCenter(degrees) {
    const center = this.getCenter();
    this.rotateAroundPoint(degrees, center);
  }

  rotateAroundPoint(degrees, point) {
    // Point is an array of [x, y]. Example: [0,0]
    const angle = (degrees * Math.PI) / 180;
    const center = point;

    const rotationMatrix = [
      [Math.cos(angle), -Math.sin(angle), 0],
      [Math.sin(angle), Math.cos(angle), 0],
      [0, 0, 1],
    ];

    // Rotate around center
    this.position = this.position.map((point) =>
      this.transformPoint(point, center, rotationMatrix)
    );
  }

  rotateOrigin(degrees) {
    this.rotateAroundPoint(degrees, [0, 0, 0]);
  }

  transformPoint(point, translation, matrix) {
    const [x, y, z] = point;
    const [tx, ty, tz] = translation;

    const translated = [x - tx, y - ty, z - tz];
    const transformed = matrix.map((row) =>
      row.reduce((sum, value, i) => sum + value * translated[i], 0)
    );

    return transformed.map((v, i) => v + translation[i]);
  }

  getCenter() {
    let sumX = 0,
      sumY = 0,
      sumZ = 0;
    for (let [x, y, z] of this.position) {
      sumX += x;
      sumY += y;
      sumZ += z;
    }
    const length = this.position.length;
    return [sumX / length, sumY / length, sumZ / length];
  }

  translate(dx, dy, dz = 0) {
    const translationMatrix = [
      [1, 0, 0, dx],
      [0, 1, 0, dy],
      [0, 0, 1, dz],
      [0, 0, 0, 1],
    ];

    this.position = this.position.map((point) =>
      this.applyTransformation(point, translationMatrix)
    );
  }

  scaleFrom(horizontalScale, verticalScale, basePoint) {
    const scaleMatrix = [
      [horizontalScale, 0, 0],
      [0, verticalScale, 0],
      [0, 0, 1],
    ];

    const scalePoint = (point) => {
      if (Array.isArray(point[0])) {
        return point.map((innerPoint) => scalePoint(innerPoint));
      } else {
        const [x, y] = point;
        const [cx, cy] = basePoint;

        // Move to origin, apply scale, then move back
        const translatedX = x - cx;
        const translatedY = y - cy;

        const scaledX =
          scaleMatrix[0][0] * translatedX + scaleMatrix[0][1] * translatedY;
        const scaledY =
          scaleMatrix[1][0] * translatedX + scaleMatrix[1][1] * translatedY;

        return [scaledX + cx, scaledY + cy];
      }
    };

    this.position = this.position.map(scalePoint);
  }

  scale(horizontalScale, verticalScale) {
    const center = this.getCenter();
    this.scaleFrom(horizontalScale, verticalScale, center);
  }

  reflect(x, y) {
    const rX = x ? -1 : 1;
    const rY = y ? -1 : 1;

    const reflectionMatrix = [
      [rY, 0, 0],
      [0, rX, 0],
      [0, 0, 1],
    ];

    this.position = this.position.map((point) =>
      this.applyTransformation(point, reflectionMatrix)
    );
  }

  shear(shX = 0, shY = 0) {
    const shearMatrix = [
      [1, shX, 0],
      [shY, 1, 0],
      [0, 0, 1],
    ];

    this.position = this.position.map((point) =>
      this.applyTransformation(point, shearMatrix)
    );
  }

  applyTransformation(point, matrix) {
    const [x, y] = point;

    const newX = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2];
    const newY = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2];

    return [newX, newY];
  }

  draw(ctx) {
    if (this.type === RECT_TYPES.dot) {
      const [x, y] = this.position[0];
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
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
