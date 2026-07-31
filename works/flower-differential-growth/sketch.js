// =====================================================
// フラワーオブライフ × 世界最高水準の表現技法 Vol.13
// Differential Growth - 神聖幾何の上で芽吹く生命
// (v6: じわじわ永続成長 / 発光調整)
// =====================================================
// 操作:
//   シングルクリック → 美しいリセット&新パターン
//   ダブルクリック   → カメラリセット
//   マウスホイール   → ズーム
//   ドラッグ         → パン
//   S → PNG保存 / R → リセット
// =====================================================

let rings = [];
let spatialHash;
let cellSize = 12;
let seeds19 = [];
let baseSeeds = [];
let petalCenters = [];
let canvasSize = 900;

let R = 64, SEED_R = 64;
let TARGET_DIST = 5.5, REPEL_DIST = 12, BOUNDARY_R = 340;
const REPEL_FORCE = 0.36, ATTRACT_FORCE = 0.20, ALIGN_FORCE = 0.18;
const SEED_CIRCLE_PULL = 0.025, GROW_PROB = 0.25;
const MAX_NODES_PER_RING = 2000;  // 安全弁(実用上ほぼ到達しない)
const GROWTH_DECAY_FRAMES = 1500; // この間でじわじわ減速していく

// ── ランダムパラメータ ──
let initNodes, initRingR, symmetryCount;
let palette, bgColor, petalGlowHue;
let mirrorEnabled, seedJitter;

// ── トランジション ──
let phase = 'growing';
let phaseTimer = 0, frameCounter = 0;
const PHASE_DURATION = {
  contracting: 50, silence: 45, anticipation: 35, sprouting: 65,
};

// ── カメラ ──
let camZoom = 1.0;
let camTargetZoom = 1.0;
let camX = 0, camY = 0;
let camTargetX = 0, camTargetY = 0;
let isDragging = false;
let lastMouseX = 0, lastMouseY = 0;
let clickStartX = 0, clickStartY = 0;

// ── 拡張パレット(11種、暖色系を強化) ──
const PALETTES = [
  // 緑系
  { name: 'verdant',   hues: [120, 145, 95],   petal: 130, bg: [4, 14, 8] },    // 若葉
  { name: 'moss',      hues: [85, 105, 65],    petal: 95,  bg: [8, 14, 6] },    // 苔
  // ピンク系
  { name: 'sakura',    hues: [340, 355, 320],  petal: 345, bg: [16, 8, 12] },   // 桜
  { name: 'coral',     hues: [350, 15, 30],    petal: 5,   bg: [18, 8, 8] },    // 珊瑚
  { name: 'peach',     hues: [20, 35, 0],      petal: 25,  bg: [16, 10, 8] },   // 桃
  // 暖色
  { name: 'sunset',    hues: [10, 30, 350],    petal: 20,  bg: [18, 6, 8] },    // 夕焼け
  { name: 'ember',     hues: [25, 45, 320],    petal: 35,  bg: [16, 8, 4] },    // 燠火
  // 寒色(残す)
  { name: 'aurora',    hues: [200, 240, 280],  petal: 270, bg: [6, 6, 18] },
  { name: 'jade',      hues: [150, 175, 200],  petal: 170, bg: [4, 12, 14] },
  { name: 'rose',      hues: [320, 340, 10],   petal: 330, bg: [14, 4, 12] },
  { name: 'twilight',  hues: [260, 290, 220],  petal: 280, bg: [8, 4, 16] },
];

let lastPaletteName = null;  // 連続で同じパレットが出ないように

// =====================================================
// セットアップ
// =====================================================
function setup() {
  canvasSize = floor(min(windowWidth, windowHeight) * 0.95);
  const cnv = createCanvas(canvasSize, canvasSize);
  cnv.parent(document.querySelector('main'));
  pixelDensity(2);
  
  // ホイールでページがスクロールしないように
  cnv.elt.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
  
  recalculateScale();
  generateNewPattern();
  background(bgColor[0], bgColor[1], bgColor[2]);
}

function windowResized() {
  canvasSize = floor(min(windowWidth, windowHeight) * 0.95);
  resizeCanvas(canvasSize, canvasSize);
  recalculateScale();
  background(bgColor[0], bgColor[1], bgColor[2]);
}

function recalculateScale() {
  const scale = canvasSize / 900;
  R = 64 * scale;
  SEED_R = R;
  TARGET_DIST = 5.5 * scale;
  REPEL_DIST = 12 * scale;
  BOUNDARY_R = 340 * scale;
  cellSize = 12 * scale;
}

// =====================================================
// 新パターン生成
// =====================================================
function generateNewPattern() {
  // 同じパレットが連続しないように
  let pool = PALETTES.filter(p => p.name !== lastPaletteName);
  palette = random(pool);
  lastPaletteName = palette.name;
  
  bgColor = palette.bg;
  petalGlowHue = palette.petal;
  
  symmetryCount = random([6, 6, 12, 12, 8]);
  mirrorEnabled = random() < 0.7;
  
  initNodes = floor(random(20, 36));
  initRingR = SEED_R * random(0.18, 0.35);
  seedJitter = random(0.85, 1.15);
  
  seeds19 = flowerOfLifeSeeds(R);
  petalCenters = computePetalCenters(R);
  
  baseSeeds = [
    { x: 0, y: 0, hue: palette.hues[0] },
    { x: R * seedJitter, y: 0, hue: palette.hues[1] },
    { x: R * 2 * seedJitter, y: 0, hue: palette.hues[2] },
  ];
  
  rings = [];
  for (const s of baseSeeds) {
    rings.push(new Ring(s.x, s.y, initRingR, initNodes, s.hue, s));
  }
  
  frameCounter = 0;
}

// =====================================================
// 描画ループ
// =====================================================
function draw() {
  // カメラの慣性補間
  camZoom = lerp(camZoom, camTargetZoom, 0.12);
  camX = lerp(camX, camTargetX, 0.15);
  camY = lerp(camY, camTargetY, 0.15);
  
  // 背景フェード
  let fadeAlpha = 28;
  if (phase === 'contracting') fadeAlpha = lerp(28, 50, phaseTimer / PHASE_DURATION.contracting);
  else if (phase === 'silence') fadeAlpha = 80;
  else if (phase === 'anticipation') fadeAlpha = 24;
  else if (phase === 'sprouting') fadeAlpha = 22;
  
  noStroke();
  fill(bgColor[0], bgColor[1], bgColor[2], fadeAlpha);
  rect(0, 0, width, height);
  
  push();
  // カメラ変換: 中心→ズーム→パン
  translate(width / 2 + camX, height / 2 + camY);
  scale(camZoom);
  
  if (phase === 'growing') {
    rebuildSpatialHash();
    for (const ring of rings) ring.applyForces(spatialHash);
    for (const ring of rings) {
      ring.integrate();
      ring.grow();
    }
    drawPetalGlow(frameCounter, 1.0);
    drawFlowerOfLife(frameCounter, 1.0);
    drawSymmetricGrowth(frameCounter, 1.0, 1.0);
    drawSeedGlow(frameCounter, 1.0);
    
  } else if (phase === 'contracting') {
    const t = phaseTimer / PHASE_DURATION.contracting;
    const ease = 1 - pow(1 - t, 3);
    
    rebuildSpatialHash();
    if (phaseTimer % 2 === 0) {
      for (const ring of rings) ring.applyForces(spatialHash);
      for (const ring of rings) ring.integrate();
    }
    
    const layerAlpha = 1.0 - ease * 0.95;
    const lineThinning = 1.0 - ease * 0.7;
    drawPetalGlow(frameCounter, layerAlpha);
    drawFlowerOfLife(frameCounter, layerAlpha);
    drawSymmetricGrowth(frameCounter, layerAlpha, lineThinning);
    drawSeedGlow(frameCounter, layerAlpha);
    
  } else if (phase === 'silence') {
    const t = phaseTimer / PHASE_DURATION.silence;
    const echo = (1 - t) * 0.15;
    if (echo > 0.01) drawSeedGlow(frameCounter, echo);
    
    if (phaseTimer === floor(PHASE_DURATION.silence * 0.5)) {
      generateNewPattern();
    }
    
  } else if (phase === 'anticipation') {
    const t = phaseTimer / PHASE_DURATION.anticipation;
    const ease = pow(t, 2);
    
    colorMode(HSB, 360, 100, 100, 100);
    noStroke();
    for (let j = 8; j > 0; j--) {
      const radius = j * 6 * ease;
      const a = (8 - j) * 3 * ease;
      fill(petalGlowHue, 30, 90, a);
      ellipse(0, 0, radius * 2);
    }
    fill(50, 10, 100, 95 * ease);
    ellipse(0, 0, 3);
    colorMode(RGB, 255);
    
  } else if (phase === 'sprouting') {
    const t = phaseTimer / PHASE_DURATION.sprouting;
    const ease = 1 - pow(1 - t, 3);
    
    rebuildSpatialHash();
    for (const ring of rings) ring.applyForces(spatialHash);
    for (const ring of rings) {
      ring.integrate();
      if (random() < ease) ring.grow();
    }
    
    const waveR = ease * BOUNDARY_R * 1.1;
    if (waveR > 0 && waveR < BOUNDARY_R * 1.05) {
      colorMode(HSB, 360, 100, 100, 100);
      noFill();
      stroke(petalGlowHue, 30, 100, 35 * (1 - ease * 0.5));
      strokeWeight(2);
      ellipse(0, 0, waveR * 2);
      stroke(petalGlowHue, 20, 100, 12);
      strokeWeight(8);
      ellipse(0, 0, waveR * 2);
      colorMode(RGB, 255);
    }
    
    drawSproutingFlower(frameCounter, ease);
    drawPetalGlow(frameCounter, ease);
    drawSymmetricGrowth(frameCounter, ease, ease);
    drawSeedGlow(frameCounter, ease);
  }
  
  pop();
  
  // UI(カメラ変換の外で描画)
  drawHints();
  
  updatePhase();
  frameCounter++;
}

// =====================================================
// ヒント表示
// =====================================================
function drawHints() {
  push();
  textSize(11);
  textAlign(RIGHT, BOTTOM);
  fill(255, 255, 255, 60);
  noStroke();
  // 指の端末にホイールもキーボードも無いので、案内を入力デバイスで出し分ける。
  // メディアクエリは初期推定、実際に触られたらそちらを優先する（タッチ対応PCの取りこぼし対策）
  const isTouch = usedTouch ||
    (typeof matchMedia === 'function' && matchMedia('(pointer:coarse)').matches);
  const hints = isTouch
    ? [
        'tap: rebirth',
        'pinch: zoom',
        'drag: pan',
        'double-tap: reset view',
      ]
    : [
        'click: rebirth',
        'wheel: zoom',
        'drag: pan',
        'double-click: reset view',
        's: save',
      ];
  for (let i = 0; i < hints.length; i++) {
    text(hints[i], width - 14, height - 14 - (hints.length - 1 - i) * 14);
  }
  // ズーム倍率表示
  // この作品は背景を毎フレーム塗り潰さない蓄積描画なので、変化する数字は
  // 前の字の上に重なって滲む。表示域だけ背景色で拭いてから描く。
  if (abs(camZoom - 1.0) > 0.05) {
    noStroke();
    fill(bgColor[0], bgColor[1], bgColor[2]);
    rect(8, height - 30, 108, 22);
    textAlign(LEFT, BOTTOM);
    fill(255, 255, 255, 100);
    text(`zoom ${camZoom.toFixed(2)}x`, 14, height - 14);
  }
  pop();
}

// =====================================================
// phase進行
// =====================================================
function updatePhase() {
  phaseTimer++;
  if (phase === 'contracting' && phaseTimer >= PHASE_DURATION.contracting) {
    phase = 'silence'; phaseTimer = 0;
  } else if (phase === 'silence' && phaseTimer >= PHASE_DURATION.silence) {
    phase = 'anticipation'; phaseTimer = 0;
  } else if (phase === 'anticipation' && phaseTimer >= PHASE_DURATION.anticipation) {
    phase = 'sprouting'; phaseTimer = 0;
  } else if (phase === 'sprouting' && phaseTimer >= PHASE_DURATION.sprouting) {
    phase = 'growing'; phaseTimer = 0;
  }
}

// =====================================================
// 入力: マウス & キー
// =====================================================
function mousePressed() {
  // canvas外クリックは無視
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  isDragging = false;
  clickStartX = mouseX;
  clickStartY = mouseY;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseDragged() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  // ドラッグ判定: 一定距離以上動いたら
  const dx = mouseX - clickStartX;
  const dy = mouseY - clickStartY;
  if (sqrt(dx * dx + dy * dy) > 4) {
    isDragging = true;
  }
  if (isDragging) {
    camTargetX += mouseX - lastMouseX;
    camTargetY += mouseY - lastMouseY;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  // ドラッグでなかったらクリック扱い → リセット
  if (!isDragging) {
    triggerReset();
  }
  isDragging = false;
}

function doubleClicked() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  // カメラリセット
  camTargetZoom = 1.0;
  camTargetX = 0;
  camTargetY = 0;
  return false;  // ブラウザのデフォルト動作を抑制
}

function mouseWheel(event) {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  
  // マウス位置を中心にズーム
  const wheelDelta = event.delta;
  const zoomFactor = wheelDelta > 0 ? 0.92 : 1.08;
  const newZoom = constrain(camTargetZoom * zoomFactor, 0.4, 8.0);
  
  // マウス位置がズーム中心になるようにパン位置を補正
  const mx = mouseX - width / 2;
  const my = mouseY - height / 2;
  const ratio = newZoom / camTargetZoom;
  camTargetX = mx - (mx - camTargetX) * ratio;
  camTargetY = my - (my - camTargetY) * ratio;
  camTargetZoom = newZoom;
  
  return false;
}

// -----------------------------------------------------
// 入力: タッチ（1本指=移動/タップ, 2本指=ピンチ拡大）
// -----------------------------------------------------
let pinchPrevDist = null;   // 直前フレームの2指間距離
let lastTapAt = -9999;      // ダブルタップ判定用
let usedTouch = false;      // 一度でも指で触られたか（操作案内の出し分けに使う）

function touchStarted() {
  usedTouch = true;
  if (touches.length === 1) {
    isDragging = false;
    clickStartX = touches[0].x;
    clickStartY = touches[0].y;
    lastMouseX = touches[0].x;
    lastMouseY = touches[0].y;
    pinchPrevDist = null;
  } else if (touches.length === 2) {
    // 2本指に移行したらタップ扱いにしない
    isDragging = true;
    pinchPrevDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
  }
  return false;  // ブラウザのスクロール・ズームを抑制
}

function touchMoved() {
  if (touches.length >= 2) {
    const d = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    if (pinchPrevDist && d > 0) {
      // 2指の中点をズーム中心にする（ホイールのマウス位置と同じ考え方）
      const cx = (touches[0].x + touches[1].x) / 2 - width / 2;
      const cy = (touches[0].y + touches[1].y) / 2 - height / 2;
      const newZoom = constrain(camTargetZoom * (d / pinchPrevDist), 0.4, 8.0);
      const ratio = newZoom / camTargetZoom;
      camTargetX = cx - (cx - camTargetX) * ratio;
      camTargetY = cy - (cy - camTargetY) * ratio;
      camTargetZoom = newZoom;
    }
    pinchPrevDist = d;
    isDragging = true;
  } else if (touches.length === 1) {
    const tx = touches[0].x, ty = touches[0].y;
    const dx = tx - clickStartX, dy = ty - clickStartY;
    // 指はマウスより震えるので、しきい値をクリックの4pxより大きく取る
    if (sqrt(dx * dx + dy * dy) > 8) isDragging = true;
    if (isDragging) {
      camTargetX += tx - lastMouseX;
      camTargetY += ty - lastMouseY;
    }
    lastMouseX = tx;
    lastMouseY = ty;
  }
  return false;
}

function touchEnded() {
  // 指がすべて離れたときだけ確定する（ピンチの片指だけ離した瞬間に誤発火させない）
  if (touches.length === 0) {
    if (!isDragging) {
      if (millis() - lastTapAt < 300) {
        // ダブルタップ = 視点を戻す
        camTargetZoom = 1.0;
        camTargetX = 0;
        camTargetY = 0;
        lastTapAt = -9999;
      } else {
        triggerReset();
        lastTapAt = millis();
      }
    }
    isDragging = false;
    pinchPrevDist = null;
  }
  return false;
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('flower_differential_growth_vol13', 'png');
  } else if (key === 'r' || key === 'R') {
    triggerReset();
  } else if (key === '0') {
    // カメラリセット
    camTargetZoom = 1.0;
    camTargetX = 0;
    camTargetY = 0;
  }
}

function triggerReset() {
  if (phase === 'growing') {
    phase = 'contracting';
    phaseTimer = 0;
  }
}

// =====================================================
// シード位置
// =====================================================
function flowerOfLifeSeeds(r) {
  const pts = [{ x: 0, y: 0 }];
  for (let i = 0; i < 6; i++) {
    const a = i * PI / 3;
    pts.push({ x: cos(a) * r, y: sin(a) * r });
  }
  for (let i = 0; i < 6; i++) {
    const a = i * PI / 3;
    pts.push({ x: cos(a) * r * 2, y: sin(a) * r * 2 });
    const a2 = a + PI / 6;
    pts.push({ x: cos(a2) * r * sqrt(3), y: sin(a2) * r * sqrt(3) });
  }
  return pts;
}

function computePetalCenters(r) {
  const centers = [];
  for (let i = 0; i < 6; i++) {
    const a = i * PI / 3 + PI / 6;
    centers.push({ x: cos(a) * r * sqrt(3) * 0.5, y: sin(a) * r * sqrt(3) * 0.5 });
  }
  return centers;
}

// =====================================================
// 描画レイヤー
// =====================================================
function drawPetalGlow(t, alpha) {
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);
  for (const p of petalCenters) {
    const breath = 0.7 + sin(t * 0.015 + p.x * 0.01) * 0.3;
    for (let i = 4; i > 0; i--) {
      const radius = 24 + i * 8;
      const a = (4 - i) * 4 * breath * alpha;
      fill(petalGlowHue, 50, 70, a);
      ellipse(p.x, p.y, radius * 2);
    }
  }
  colorMode(RGB, 255);
}

function drawFlowerOfLife(t, alpha) {
  noFill();
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < seeds19.length; i++) {
    const s = seeds19[i];
    const phase2 = t * 0.018 + i * 0.4;
    const breathAlpha = (28 + sin(phase2) * 16) * alpha;
    const breathWeight = 0.7 + sin(phase2 * 0.7) * 0.3;
    const breathHue = 38 + sin(phase2 * 0.5) * 12;
    
    stroke(breathHue, 18, 100, breathAlpha * 0.3);
    strokeWeight(breathWeight * 4);
    ellipse(s.x, s.y, SEED_R * 2);
    stroke(breathHue, 22, 100, breathAlpha);
    strokeWeight(breathWeight);
    ellipse(s.x, s.y, SEED_R * 2);
  }
  colorMode(RGB, 255);
}

function drawSproutingFlower(t, ease) {
  noFill();
  colorMode(HSB, 360, 100, 100, 100);
  const waveR = ease * BOUNDARY_R * 1.1;
  for (let i = 0; i < seeds19.length; i++) {
    const s = seeds19[i];
    const distFromCenter = sqrt(s.x * s.x + s.y * s.y);
    const awakeness = constrain(map(waveR, distFromCenter, distFromCenter + 50, 0, 1), 0, 1);
    if (awakeness < 0.01) continue;
    
    const phase2 = t * 0.018 + i * 0.4;
    const breathAlpha = (28 + sin(phase2) * 16) * awakeness;
    const breathWeight = 0.7 + sin(phase2 * 0.7) * 0.3;
    const breathHue = 38 + sin(phase2 * 0.5) * 12;
    
    stroke(breathHue, 18, 100, breathAlpha * 0.3);
    strokeWeight(breathWeight * 4);
    ellipse(s.x, s.y, SEED_R * 2);
    stroke(breathHue, 22, 100, breathAlpha);
    strokeWeight(breathWeight);
    ellipse(s.x, s.y, SEED_R * 2);
  }
  colorMode(RGB, 255);
}

function drawSymmetricGrowth(t, alpha, weightScale) {
  for (let rot = 0; rot < symmetryCount; rot++) {
    push();
    rotate(rot * TWO_PI / symmetryCount);
    if (mirrorEnabled) {
      const mirror = rot % 2 === 1 ? -1 : 1;
      scale(1, mirror);
    }
    for (const ring of rings) {
      ring.display(t, rot, alpha, weightScale);
    }
    pop();
  }
}

function drawSeedGlow(t, alpha) {
  noStroke();
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < seeds19.length; i++) {
    const s = seeds19[i];
    const phase2 = t * 0.025 + i * 0.6;
    // 明滅振幅を抑えて、ベースをやや明るめに(0.65±0.35 → 0.7±0.2)
    const intensity = (0.7 + sin(phase2) * 0.2) * alpha;
    
    // ハロー: パレットの petalGlowHue に合わせて世界観に溶け込ませる
    // 彩度40, 明度70 (旧: 20, 100 = ほぼ白)
    for (let j = 5; j > 0; j--) {
      const radius = j * 2.5;
      const a = (6 - j) * 3.5 * intensity;  // 旧: 6 * intensity → 3.5に減光
      fill(petalGlowHue, 40, 70, a);
      ellipse(s.x, s.y, radius * 2);
    }
    // 中心の光点: 完全な白ではなく、わずかに色味を残す
    fill(petalGlowHue, 15, 92, 55 * intensity);  // 旧: alpha 90 → 55
    ellipse(s.x, s.y, 1.8);
  }
  colorMode(RGB, 255);
}

// =====================================================
// Ring
// =====================================================
class Ring {
  constructor(cx, cy, r, n, baseHue, seedRef) {
    this.nodes = [];
    this.baseHue = baseHue;
    this.seed = seedRef;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TWO_PI;
      this.nodes.push({
        x: cx + cos(a) * r + random(-0.3, 0.3),
        y: cy + sin(a) * r + random(-0.3, 0.3),
        fx: 0, fy: 0,
      });
    }
  }
  
  applyForces(hash) {
    const n = this.nodes.length;
    for (let i = 0; i < n; i++) {
      const node = this.nodes[i];
      node.fx = 0; node.fy = 0;
      const prev = this.nodes[(i - 1 + n) % n];
      const next = this.nodes[(i + 1) % n];
      
      let dx = prev.x - node.x, dy = prev.y - node.y;
      let d = sqrt(dx * dx + dy * dy);
      if (d > TARGET_DIST) {
        node.fx += (dx / d) * (d - TARGET_DIST) * ATTRACT_FORCE;
        node.fy += (dy / d) * (d - TARGET_DIST) * ATTRACT_FORCE;
      }
      dx = next.x - node.x; dy = next.y - node.y;
      d = sqrt(dx * dx + dy * dy);
      if (d > TARGET_DIST) {
        node.fx += (dx / d) * (d - TARGET_DIST) * ATTRACT_FORCE;
        node.fy += (dy / d) * (d - TARGET_DIST) * ATTRACT_FORCE;
      }
      
      const midX = (prev.x + next.x) * 0.5;
      const midY = (prev.y + next.y) * 0.5;
      node.fx += (midX - node.x) * ALIGN_FORCE * 0.05;
      node.fy += (midY - node.y) * ALIGN_FORCE * 0.05;
      
      const sx = this.seed.x, sy = this.seed.y;
      const ddx = node.x - sx, ddy = node.y - sy;
      const dFromSeed = sqrt(ddx * ddx + ddy * ddy);
      if (dFromSeed > 0.01) {
        const diff = dFromSeed - SEED_R;
        node.fx -= (ddx / dFromSeed) * diff * SEED_CIRCLE_PULL;
        node.fy -= (ddy / dFromSeed) * diff * SEED_CIRCLE_PULL;
      }
      
      const cx = floor(node.x / cellSize);
      const cy = floor(node.y / cellSize);
      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          const key = (cx + ox) + ',' + (cy + oy);
          const cell = hash[key];
          if (!cell) continue;
          for (const other of cell) {
            if (other === node) continue;
            const ex = node.x - other.x, ey = node.y - other.y;
            const ed = sqrt(ex * ex + ey * ey);
            if (ed > 0 && ed < REPEL_DIST) {
              const f = (1 - ed / REPEL_DIST) * REPEL_FORCE;
              node.fx += (ex / ed) * f;
              node.fy += (ey / ed) * f;
            }
          }
        }
      }
      
      const distFromCenter = sqrt(node.x * node.x + node.y * node.y);
      if (distFromCenter > BOUNDARY_R) {
        const overshoot = distFromCenter - BOUNDARY_R;
        node.fx -= (node.x / distFromCenter) * overshoot * 0.08;
        node.fy -= (node.y / distFromCenter) * overshoot * 0.08;
      }
    }
  }
  
  integrate() {
    for (const node of this.nodes) {
      node.x += node.fx;
      node.y += node.fy;
    }
  }
  
  grow() {
    if (this.nodes.length >= MAX_NODES_PER_RING) return;
    
    // じわじわ減衰: 経過時間に応じて成長速度を緩める
    // 0フレームで1.0 → GROWTH_DECAY_FRAMESで0.05まで減衰し、その後は微速で継続
    // 完全停止せず「じわじわ」を維持
    const decay = max(0.05, 1.0 - (frameCounter / GROWTH_DECAY_FRAMES) * 0.95);
    
    const n = this.nodes.length;
    const newNodes = [];
    for (let i = 0; i < n; i++) {
      newNodes.push(this.nodes[i]);
      const next = this.nodes[(i + 1) % n];
      const dx = next.x - this.nodes[i].x;
      const dy = next.y - this.nodes[i].y;
      const d = sqrt(dx * dx + dy * dy);
      // 強制挿入(距離が大きい)は減衰の影響を抑え、確率挿入は減衰
      // これで密集領域は静まり、余白のあるところでじわじわ成長が続く
      const forceInsert = d > TARGET_DIST * 1.6 && random() < (0.3 + decay * 0.7);
      const probInsert = d > TARGET_DIST && random() < GROW_PROB * 0.05 * decay;
      if (forceInsert || probInsert) {
        newNodes.push({
          x: (this.nodes[i].x + next.x) * 0.5,
          y: (this.nodes[i].y + next.y) * 0.5,
          fx: 0, fy: 0,
        });
      }
    }
    this.nodes = newNodes;
  }
  
  display(t, rotIndex, alpha, weightScale = 1.0) {
    colorMode(HSB, 360, 100, 100, 100);
    const breathHue = (this.baseHue + sin(t * 0.012 + rotIndex * 0.5) * 20 + 360) % 360;
    const breathSat = 45 + sin(t * 0.018 + this.baseHue * 0.01) * 20;
    const breathBri = 80 + sin(t * 0.02) * 12;
    
    noFill();
    stroke(breathHue, breathSat * 0.5, breathBri, 6 * alpha);
    strokeWeight(5 * weightScale);
    this.drawCurve();
    stroke(breathHue, breathSat * 0.75, breathBri, 16 * alpha);
    strokeWeight(2.2 * weightScale);
    this.drawCurve();
    stroke(breathHue, breathSat, breathBri, 88 * alpha);
    strokeWeight(0.85 * weightScale);
    this.drawCurve();
    colorMode(RGB, 255);
  }
  
  drawCurve() {
    const n = this.nodes.length;
    beginShape();
    curveVertex(this.nodes[n - 1].x, this.nodes[n - 1].y);
    for (let i = 0; i < n; i++) {
      curveVertex(this.nodes[i].x, this.nodes[i].y);
    }
    curveVertex(this.nodes[0].x, this.nodes[0].y);
    curveVertex(this.nodes[1].x, this.nodes[1].y);
    endShape();
  }
}

function rebuildSpatialHash() {
  spatialHash = {};
  for (const ring of rings) {
    for (const node of ring.nodes) {
      const cx = floor(node.x / cellSize);
      const cy = floor(node.y / cellSize);
      const key = cx + ',' + cy;
      if (!spatialHash[key]) spatialHash[key] = [];
      spatialHash[key].push(node);
    }
  }
}
