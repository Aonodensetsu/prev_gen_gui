// PixiJS - 2D application canvas
const app = new PIXI.Application({
  background: '#222',
  resizeTo: window,
  autoStart: true
});
document.body.appendChild(app.view);

// pixi-viewport - ability to pan and zoom
const viewport = new pixi_viewport.Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: window.innerWidth,
  worldHeight: window.innerHeight,
  events: app.renderer.events
});
app.stage.addChild(viewport);

viewport
  .drag()
  .pinch()
  .wheel()
  .decelerate({
    friction: 0.93  // higher is more slippery
  });

// drawing tiles
function drawTile(hexNum, {x, y}, {w, h}) {
  const g = new PIXI.Graphics();
  // main bg
  g.beginFill(hexNum);
  g.drawRect(0, 0, w, h - 10);
  // darker bar
  g.beginFill(barColor(hexNum));
  g.drawRect(0, h - 10, w, 10);
  g.endFill();
  const t = app.renderer.generateTexture(g);
  const s = new PIXI.Sprite(t);
  s.position.set(x, y);
  viewport.addChild(s);
  return s;
}

let tileSize = {w: 100, h: 100};

let tile = drawTile(0x3f51b5, {x: 0, y: 0}, tileSize);
let tile2 = drawTile(0x513fb5, {x: tileSize.w, y: 0}, tileSize);

// add a 2% padding
viewport.moveCorner(-0.02 * window.innerWidth, -0.02 * window.innerHeight);

