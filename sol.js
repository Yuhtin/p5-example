const stripe = 12;
const step = stripe * 2;
const wS = 220;
const wO = 396;
const wL = 220;
const h = 35 * stripe;

// Velocidade do scroll das listras (px/seg)
const driftSpeed = 18;

function setup() {
  createCanvas(wS + wO + wL, h);
  noStroke();
}

function draw() {
  background(255);
  const drift = (millis() / 1000) * driftSpeed;

  drawS(0, drift);
  drawO(wS, drift);
  drawL(wS + wO, drift);
}

// Modulo que sempre retorna positivo, pra wraparound suave
function wrap(v, m) {
  return ((v % m) + m) % m;
}

function horizontalStripes(x, w, offset = 0) {
  fill(0);
  const o = wrap(offset, step);
  for (let y = o - step; y < h; y += step) {
    rect(x, y, w, stripe);
  }
}

function verticalStripes(x, w, offset = 0) {
  fill(0);
  const o = wrap(offset, step);
  for (let xx = o - step; xx < w; xx += step) {
    rect(x + xx, 0, stripe, h);
  }
}

function carveAndFillVerticals(vertices, fillX, fillW, offset = 0) {
  erase();
  beginShape();
  for (const [vx, vy] of vertices) vertex(vx, vy);
  endShape(CLOSE);
  noErase();

  push();
  drawingContext.beginPath();
  drawingContext.moveTo(vertices[0][0], vertices[0][1]);
  for (let i = 1; i < vertices.length; i++) {
    drawingContext.lineTo(vertices[i][0], vertices[i][1]);
  }
  drawingContext.closePath();
  drawingContext.clip();
  verticalStripes(fillX, fillW, offset);
  pop();
}

function drawS(x, drift) {
  horizontalStripes(x, wS, drift);

  const topY = 9 * stripe;
  const bottomY = h - 5 * stripe;
  const halfBase = (bottomY - topY) / sqrt(3);

  carveAndFillVerticals(
    [[x, topY], [x - halfBase, bottomY], [x + halfBase, bottomY]],
    x, wS, drift
  );
}

function drawO(x, drift) {
  verticalStripes(x, wO, drift);

  const topY = 5 * stripe;
  const bottomY = h - 5 * stripe;
  const innerX = 108;
  const innerW = 180;
  const stripeX = x + innerX + 12;
  const stripeW = innerW - 24;

  fill(255);
  rect(x + innerX, topY, innerW, bottomY - topY);

  // Listras horizontais do miolo, recortadas no retângulo interno
  push();
  drawingContext.beginPath();
  drawingContext.rect(stripeX, topY, stripeW, bottomY - topY);
  drawingContext.clip();
  fill(0);
  const o = wrap(drift, step);
  for (let y = topY + stripe + o - step; y < bottomY + step; y += step) {
    rect(stripeX, y, stripeW, stripe);
  }
  pop();
}

function drawL(x, drift) {
  horizontalStripes(x, wL, drift);

  const topY = 5 * stripe;
  const bottomY = h - 5 * stripe;
  const rightX = x + wL;
  const cut = 120;

  carveAndFillVerticals(
    [
      [rightX, topY],
      [rightX, bottomY],
      [rightX - cut, bottomY],
      [rightX - cut * 0.5, topY],
    ],
    x, wL, drift
  );
}
