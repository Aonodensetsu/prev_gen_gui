import { Settings } from './settings.js';
import { Tile } from './tile.js';
import { Color } from './color.js';

export class Palette {
  static _minus;
  static _plus;
  colPlus;
  colMinus;
  rowPlus;
  rowMinus;
  columns = 1;
  rows = 1;
  tiles = [[]]; // 2d list of tiles, rows indexed first

  constructor({app, viewport, settings = new Settings()}) {
    this.app = app;
    this.viewport = viewport;
    this.settings = settings;

    if (!Palette._minus) {
      const m = new PIXI.Graphics();
      m.beginFill(0x444444);
      m.drawRoundedRect(0, 40, 100, 20, 5);
      m.endFill();
      Palette._minus = this.app.renderer.generateTexture(m, {
        region: new PIXI.Rectangle(0, 0, 100, 100)
      });
    }
    if (!Palette._plus) {
      const p = new PIXI.Graphics();
      p.beginFill(0x444444);
      p.drawRoundedRect(40, 0, 20, 100, 5);
      p.drawRoundedRect(0, 40, 100, 20, 5);
      p.endFill();
      Palette._plus = this.app.renderer.generateTexture(p);
    }

    this.colPlus = new PIXI.Sprite(Palette._plus);
    this.colPlus.interactive = true;
    this.colPlus.on('pointerdown', this.addRow.bind(this));
    viewport.addChild(this.colPlus);
    this.colMinus = new PIXI.Sprite(Palette._minus);
    this.colMinus.interactive = true;
    this.colMinus.on('pointerdown', this.deleteRow.bind(this));
    viewport.addChild(this.colMinus);
    this.rowPlus = new PIXI.Sprite(Palette._plus);
    this.rowPlus.interactive = true;
    this.rowPlus.on('pointerdown', this.addColumn.bind(this));
    viewport.addChild(this.rowPlus);
    this.rowMinus = new PIXI.Sprite(Palette._minus);
    this.rowMinus.interactive = true;
    this.rowMinus.on('pointerdown', this.deleteColumn.bind(this));
    viewport.addChild(this.rowMinus);

    this.fill({row: 0, column: 0});

    this.moveHandles();

    document.querySelector('#editmenu').addEventListener('submit', this.editTile.bind(this));
  }

  editTile(e) {
    e.preventDefault();
    if (e.submitter.value === 'cancel') {
      e.target.hidePopover();
      return;
    }
    const pos = e.target.cause.value.split(',').map(i => parseInt(i));
    if (e.submitter.value === 'clear') {
      this.tiles[pos[0]][pos[1]].update(null, {name: '', desc_left: '', desc_right: ''});
    }
    else if (e.submitter.value === 'edit') {
      const col = e.target.hex.value ? Color.fromHex(e.target.hex.value) : null;
      this.tiles[pos[0]][pos[1]].update(col, {name: e.target.name.value, desc_left: e.target.desc_left.value, desc_right: e.target.desc_right.value});
    }
    e.target.hidePopover();
  }

  moveHandles() {
    this.colPlus.position.set(this.columns * this.settings.grid_width + 20, this.rows * this.settings.grid_height - 100);
    this.colMinus.position.set(this.columns * this.settings.grid_width + 20, this.rows * this.settings.grid_height - 220);
    this.rowPlus.position.set(this.columns * this.settings.grid_width - 100, this.rows * this.settings.grid_height + 20);
    this.rowMinus.position.set(this.columns * this.settings.grid_width - 220, this.rows * this.settings.grid_height + 20);
  }

  addColumn() {
    this.columns += 1;
    this.tiles.forEach((row, i) => {
      this.fill({row: i, column: this.columns - 1});
    });
    this.moveHandles();
  }

  deleteColumn() {
    if (this.columns <= 1) return;
    this.tiles.forEach(row => row.pop().undraw());
    this.columns -= 1;
    this.moveHandles();
  }

  addRow() {
    this.tiles.push([]);
    this.rows += 1;
    for (let i = 0; i < this.columns; i++) {
      this.fill({row: this.rows - 1, column: i});
    }
    this.moveHandles();
  }

  deleteRow() {
    if (this.rows <= 1) return;
    this.rows -= 1;
    this.tiles.pop().forEach(tile => tile.undraw());
    this.moveHandles();
  }

  fill({row, column}, color = null, {name, desc_left, desc_right} = {name: '', desc_left: '', desc_right: ''}) {
    while (this.columns <= column) this.addColumn();
    while (this.rows <= row) this.addRow();
    if (this.tiles[row][column]) this.tiles[row][column].update(color, {name, desc_left, desc_right});
    else this.tiles[row][column] = new Tile({app: this.app, viewport: this.viewport, settings: this.settings}, color, {name, desc_left, desc_right}).draw({row, column});
  }
}

