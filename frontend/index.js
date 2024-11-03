// PIXI, pixi-unsafeeval, pixi_viewport, tweenjs, mdc are imported in HTML
import { Settings } from './settings.js';
import { Color } from './color.js';
import { Tile } from './tile.js';
import { Palette } from './palette.js';
const Tween = createjs.Tween;

// initialize Material Design elements
mdc.autoInit();

// Pixi - 2D application canvas
const app = new PIXI.Application({
  background: window.matchMedia('(prefers-color-scheme: dark)') ? '#141218' : '#fef7ff',
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

// handle window size changes
window.addEventListener('resize', () => {
  viewport.resize(window.innerWidth, window.innerHeight, viewport.worldWidth, viewport.worldHeight);
});

// enable interactions
viewport
  .drag()
  .pinch()
  .wheel()
  .decelerate({
    friction: 0.93  // higher is more slippery
  });

// load font manually before drawing the palette in case it's not loaded yet
await (new FontFace('Nunito', 'url(nunito.woff2)')).load().then(font => {
  document.fonts.add(font);
});

// manage colors
const p = new Palette({app, viewport});

// viewport manages clicks in world space
viewport.on('clicked', e => {
  p.click(e.world);
});

// update viewport on load and on mobile devices
screen.orientation.addEventListener('change', e => {
  viewport.ensureVisible(-20, -140, p.columns * p.settings.grid_width + 160, p.rows * p.settings.grid_height + 160, true);
});

viewport.ensureVisible(-20, -140, p.columns * p.settings.grid_width + 160, p.rows * p.settings.grid_height + 160, true);

