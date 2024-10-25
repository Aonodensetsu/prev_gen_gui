import { Settings } from './settings.js';
import { EmptyTile, Tile } from './tile.js';
export class Palette {
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

    this.empty({column: 0, row: 0});

    this.moveHandles();
  }

  moveHandles() {
    this.colPlus.position.set(this.columns * this.settings.grid_width + 20, this.rows * this.settings.grid_height - 100);
    this.colMinus.position.set(this.columns * this.settings.grid_width + 20, this.rows * this.settings.grid_height - 220);
    this.rowPlus.position.set(this.columns * this.settings.grid_width - 100, this.rows * this.settings.grid_height + 20);
    this.rowMinus.position.set(this.columns * this.settings.grid_width - 220, this.rows * this.settings.grid_height + 20);
  }

  addColumn() {
    this.tiles.forEach((row, i) => {
      this.empty({row: i, column: this.columns});
    });
    this.columns += 1;
    this.moveHandles();
  }

  deleteColumn() {
    if (this.columns <= 1) return;
    this.tiles.forEach(row => row.pop().undraw());
    this.columns -= 1;
    this.moveHandles();
  }

  addRow() {
    this.rows += 1;
    this.tiles.push([]);
    for (let i = 0; i < this.columns; i++) {
      this.empty({row: this.rows - 1, column: i});
    }
    this.moveHandles();
  }

  deleteRow() {
    if (this.rows <= 1) return;
    this.rows -= 1;
    this.tiles.pop().forEach(tile => tile.undraw());
    this.moveHandles();
  }

  empty({column, row}) {
    this.tiles[row][column]?.undraw();
    this.tiles[row][column] = new EmptyTile({app: this.app, viewport: this.viewport, settings: this.settings}).draw({row, column});
  }

  fill({column, row}, color, {name, desc_left, desc_right} = {name: '', desc_left: '', desc_right: ''}) {
    while (this.columns <= column) this.addColumn();
    while (this.rows <= row) this.addRow();
    this.tiles[row][column].undraw();
    this.tiles[row][column] = new Tile({app: this.app, viewport: this.viewport, settings: this.settings}, color, {name, desc_left, desc_right}).draw({row, column});
  }
}
