import { Settings } from './settings.js';
import { Tile } from './tile.js';
export class Palette {
  tiles = [[null]]; // 2d list of tiles, columns indexed first, empty tiles nulled

  constructor({app, viewport, settings = new Settings()}) {
    this.app = app;
    this.viewport = viewport;
    this.settings = settings;
  }

  get globals() {
    return {app: this.app, viewport: this.viewport, settings: this.settings};
  }

  newTile(color, {name, desc_left, desc_right} = {name: '', desc_left: '', desc_right: ''}) {
    return new Tile(this.globals, color, {name, desc_left, desc_right});
  }
}

