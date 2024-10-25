// PIXI, pixi-unsafeeval, pixi-viewport are imported in HTML
import { Settings } from './settings.js';
import { Color } from './color.js';
import { Tile } from './tile.js';
import { Palette } from './palette.js';

// Pixi - 2D application canvas
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

// add a 5% default padding
viewport.moveCorner(-0.05 * window.innerWidth, -0.05 * window.innerHeight);


const p = new Palette({app, viewport});

if (true) { // placeholder testing palette (Gruvbox)
  p.fill({row: 0, column: 0}, Color.fromHex('282828'), {name: 'bg', desc_left: '235', desc_right: '0'});
  p.fill({row: 0, column: 1}, Color.fromHex('cc241d'), {name: 'red', desc_left: '124', desc_right: '1'});
  p.fill({row: 0, column: 2}, Color.fromHex('98971a'), {name: 'green', desc_left: '106', desc_right: '2'});
  p.fill({row: 0, column: 3}, Color.fromHex('d79921'), {name: 'yellow', desc_left: '172', desc_right: '3'});
  p.fill({row: 0, column: 4}, Color.fromHex('458588'), {name: 'blue', desc_left: '66', desc_right: '4'});
  p.fill({row: 0, column: 5}, Color.fromHex('b16286'), {name: 'purple', desc_left: '132', desc_right: '5'});
  p.fill({row: 0, column: 6}, Color.fromHex('689d6a'), {name: 'aqua', desc_left: '72', desc_right: '6'});
  p.fill({row: 0, column: 7}, Color.fromHex('a89984'), {name: 'gray', desc_left: '246', desc_right: '7'});
  p.fill({row: 1, column: 0}, Color.fromHex('928374'), {name: 'gray', desc_left: '245', desc_right: '8'});
  p.fill({row: 1, column: 1}, Color.fromHex('fb4934'), {name: 'red', desc_left: '167', desc_right: '9'});
  p.fill({row: 1, column: 2}, Color.fromHex('b8bb26'), {name: 'green', desc_left: '142', desc_right: '10'});
  p.fill({row: 1, column: 3}, Color.fromHex('fabd2f'), {name: 'yellow', desc_left: '214', desc_right: '11'});
  p.fill({row: 1, column: 4}, Color.fromHex('83a598'), {name: 'blue', desc_left: '109', desc_right: '12'});
  p.fill({row: 1, column: 5}, Color.fromHex('d3869b'), {name: 'purple', desc_left: '175', desc_right: '13'});
  p.fill({row: 1, column: 6}, Color.fromHex('8ec07c'), {name: 'aqua', desc_left: '108', desc_right: '14'});
  p.fill({row: 1, column: 7}, Color.fromHex('ebdbb2'), {name: 'fg', desc_left: '223', desc_right: '15'});
  p.fill({row: 2, column: 0}, Color.fromHex('1d2021'), {name: 'bg0_h', desc_left: '234', desc_right: '0'});
  p.fill({row: 2, column: 1}, Color.fromHex('282828'), {name: 'bg0', desc_left: '235', desc_right: '0'});
  p.fill({row: 2, column: 2}, Color.fromHex('3c3836'), {name: 'bg1', desc_left: '237', desc_right: '-'});
  p.fill({row: 2, column: 3}, Color.fromHex('504945'), {name: 'bg2', desc_left: '239', desc_right: '-'});
  p.fill({row: 2, column: 4}, Color.fromHex('665c54'), {name: 'bg3', desc_left: '241', desc_right: '-'});
  p.fill({row: 2, column: 5}, Color.fromHex('7c6f64'), {name: 'bg4', desc_left: '243', desc_right: '-'});
  p.fill({row: 2, column: 6}, Color.fromHex('928374'), {name: 'gray', desc_left: '245', desc_right: '-'});
  p.fill({row: 2, column: 7}, Color.fromHex('d65d0e'), {name: 'orange', desc_left: '166', desc_right: '-'});
  p.fill({row: 3, column: 1}, Color.fromHex('32302f'), {name: 'bg0_s', desc_left: '236', desc_right: '0'});
  p.fill({row: 3, column: 2}, Color.fromHex('a89984'), {name: 'fg4', desc_left: '246', desc_right: '7'});
  p.fill({row: 3, column: 3}, Color.fromHex('bdae93'), {name: 'fg3', desc_left: '248', desc_right: '-'});
  p.fill({row: 3, column: 4}, Color.fromHex('d5c4a1'), {name: 'fg2', desc_left: '250', desc_right: '-'});
  p.fill({row: 3, column: 5}, Color.fromHex('ebdbb2'), {name: 'fg1', desc_left: '223', desc_right: '15'});
  p.fill({row: 3, column: 6}, Color.fromHex('fbf1c7'), {name: 'fg0', desc_left: '229', desc_right: '-'});
  p.fill({row: 3, column: 7}, Color.fromHex('fe8019'), {name: 'orange', desc_left: '208', desc_right: '-'});
}

