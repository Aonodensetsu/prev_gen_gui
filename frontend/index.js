// PIXI, pixi-unsafeeval, pixi_viewport, tweenjs, mdc are imported in HTML
import { Settings } from './settings.js';
import { Color } from './color.js';
import { Tile } from './tile.js';
import { Palette } from './palette.js';
import { Picker } from './picker.js';

// initialize Material Design elements
mdc.autoInit();

// Pixi - 2D application canvas
const app = new PIXI.Application({
  background: Color.fromVar('--mdc-theme-surface').hexNum,
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

// enable interactions
viewport
  .drag()
  .pinch()
  .wheel()
  .decelerate({
    friction: 0.93  // higher is more slippery
  });

// load font
await new FontFace('Nunito', 'url(nunito.woff2)').load().then(f => {
  document.fonts.add(f);
});

// manage colors
const p = new Palette({app, viewport});

// update viewport on mobile devices and on page load
screen.orientation.addEventListener('change', () => {
  viewport.top = -280;
  viewport.left = -20;
  viewport.fit(false, p.columns * p.settings.grid_width + 160, p.rows * p.settings.grid_height + 420);
});
screen.orientation.dispatchEvent(new Event('change'));

// viewport manages clicks in world space
viewport.on('clicked', e => {
  p.click(e.world);
});

/*
 * Appearance based on color picker from:
 * https://lch.oklch.com
 */
const c = new Picker();

// update canvas sizes on resize
window.addEventListener('resize', () => {
  viewport.resize(window.innerWidth, window.innerHeight, viewport.worldWidth, viewport.worldHeight);
  c.canvases().forEach(el => {
    el.width = el.clientWidth;
    el.height = el.clientHeight;
  });
  c.update(true);
  screen.orientation.dispatchEvent(new Event('change'));
});

// tie ranges with value display
document.querySelectorAll('.range input').forEach(el => {
  const counterpart = document.querySelector('[name=' + el.name + 'Val]');
  el.oninput = (e) => counterpart.value = e.target.value;
  counterpart.oninput = (e) => {
    el.value = e.target.value;
    c.update(true);
  };
});

