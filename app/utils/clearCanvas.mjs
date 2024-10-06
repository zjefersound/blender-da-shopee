
export function clearCanvas(ctx) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.restore();
}
