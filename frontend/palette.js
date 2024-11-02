import { Settings } from './settings.js';
import { Tile } from './tile.js';
import { Color } from './color.js';

export class Palette {
  // static textures
  static _minus;
  static _plus;
  static _trash;
  static _settings;
  // buttons
  colPlus;
  colMinus;
  rowPlus;
  rowMinus;
  trashBtn;
  settingsBtn;
  // values
  columns = 1;
  rows = 1;
  tiles = [[]]; // 2d list of tiles, rows indexed first

  constructor({app, viewport, settings = new Settings()}) {
    this.app = app;
    this.viewport = viewport;
    this.settings = settings;

    if (!Palette._minus) Palette._minus = PIXI.Texture.from('minus.png');
    if (!Palette._plus) Palette._plus = PIXI.Texture.from('plus.png');
    if (!Palette._trash) Palette._trash = PIXI.Texture.from('trash.png');
    if (!Palette._settings) Palette._settings = PIXI.Texture.from('settings.png');

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
    this.trashBtn = new PIXI.Sprite(Palette._trash);
    this.trashBtn.interactive = true;
    this.trashBtn.on('pointerdown', this.empty.bind(this));
    this.trashBtn.anchor.set(1, 0);
    this.trashBtn.position.set(-20, 0);
    viewport.addChild(this.trashBtn);
    this.settingsBtn = new PIXI.Sprite(Palette._settings);
    this.settingsBtn.interactive = true;
    this.settingsBtn.on('pointerdown', this.clickSettings.bind(this));
    this.settingsBtn.anchor.set(0, 1);
    this.settingsBtn.position.set(0, -20);
    viewport.addChild(this.settingsBtn);

    this.fill({row: 0, column: 0});
    this.moveHandles();

    document.querySelector('#edittile').addEventListener('submit', this.editTile.bind(this));
    document.querySelector('#editsettings').addEventListener('submit', this.editSettings.bind(this));
  }

  click({x, y}) {
    const row = Math.floor(y / this.settings.grid_height);
    if (row < 0) return;
    if (row >= this.rows) return;
    const column = Math.floor(x / this.settings.grid_width);
    if (column < 0) return;
    if (column >= this.columns) return;
    document.querySelector('#edittile [name=cause]').setAttribute('value', `${row},${column}`);
    this.tiles[row][column].click();
    return this;
  }

  clickSettings() {
    const form = document.querySelector('#editsettings');
    form.grid_height.value = this.settings.grid_height;
    form.grid_width.value = this.settings.grid_width;
    form.bar_height.value = this.settings.bar_height;
    form.name_offset.value = this.settings.name_offset;
    form.hex_offset.value = this.settings.hex_offset;
    form.hex_offset_nameless.value = this.settings.hex_offset_nameless;
    form.desc_offset_x.value = this.settings.desc_offset_x;
    form.desc_offset_y.value = this.settings.desc_offset_y;
    form.name_size.value = this.settings.name_size;
    form.hex_size.value = this.settings.hex_size;
    form.hex_size_nameless.value = this.settings.hex_size_nameless;
    form.desc_size.value = this.settings.desc_size;
    form.show_hash.checked = this.settings.show_hash;
    form.hex_upper.checked = this.settings.hex_upper;
    form.showPopover();
    return this;
  }

  editTile(e) {
    e.preventDefault();
    if (e.submitter.value === 'cancel') {
      e.target.hidePopover();
      return;
    }
    const pos = e.target.cause.value.split(',').map(i => parseInt(i));
    if (e.submitter.value === 'clear') {
      this.tiles[pos[0]][pos[1]].update();
    }
    else if (e.submitter.value === 'edit') {
      const col = e.target.hex.value ? Color.fromHex(e.target.hex.value) : null;
      this.tiles[pos[0]][pos[1]].update(col, {name: e.target.name.value, desc_left: e.target.desc_left.value, desc_right: e.target.desc_right.value});
    }
    e.target.hidePopover();
    return this;
  }

  editSettings(e) {
    e.preventDefault();
    if (e.submitter.value === 'cancel') {
      e.target.hidePopover();
      return;
    }
    const form = e.target;
    this.settings.grid_height = parseInt(form.grid_height.value);
    this.settings.grid_width = parseInt(form.grid_width.value);
    this.settings.bar_height = parseInt(form.bar_height.value);
    this.settings.name_offset = parseInt(form.name_offset.value);
    this.settings.hex_offset = parseInt(form.hex_offset.value);
    this.settings.hex_offset_nameless = parseInt(form.hex_offset_nameless.value);
    this.settings.desc_offset_x = parseInt(form.desc_offset_x.value);
    this.settings.desc_offset_y = parseInt(form.desc_offset_y.value);
    this.settings.name_size = parseInt(form.name_size.value);
    this.settings.hex_size = parseInt(form.hex_size.value);
    this.settings.hex_size_nameless = parseInt(form.hex_size_nameless.value);
    this.settings.desc_size = parseInt(form.desc_size.value);
    this.settings.show_hash = form.show_hash.checked;
    this.settings.hex_upper = form.hex_upper.checked;
    this.redraw();
    form.hidePopover();
    return this;
  }

  redraw() {
    this.tiles.forEach(row => {
      row.forEach(tile => {
        tile.redraw();
      });
    })
    return this.moveHandles();
  }

  moveHandles() {
    this.colPlus.position.set(this.columns * this.settings.grid_width + 20, this.rows * this.settings.grid_height - 100);
    this.colMinus.position.set(this.columns * this.settings.grid_width + 20, this.rows * this.settings.grid_height - 220);
    this.rowPlus.position.set(this.columns * this.settings.grid_width - 100, this.rows * this.settings.grid_height + 20);
    this.rowMinus.position.set(this.columns * this.settings.grid_width - 220, this.rows * this.settings.grid_height + 20);
    return this;
  }

  addColumn() {
    this.columns += 1;
    this.tiles.forEach((row, i) => {
      this.fill({row: i, column: this.columns - 1});
    });
    return this.moveHandles();
  }

  deleteColumn() {
    if (this.columns <= 1) return this;
    this.tiles.forEach(row => row.pop().undraw());
    this.columns -= 1;
    return this.moveHandles();
  }

  addRow() {
    this.tiles.push([]);
    this.rows += 1;
    for (let i = 0; i < this.columns; i++) {
      this.fill({row: this.rows - 1, column: i});
    }
    return this.moveHandles();
  }

  deleteRow() {
    if (this.rows <= 1) return this;
    this.rows -= 1;
    this.tiles.pop().forEach(tile => tile.undraw());
    return this.moveHandles();
  }

  empty() {
    while (this.columns > 1) this.deleteColumn();
    while (this.rows > 1) this.deleteRow();
    return this.fill({row: 0, column: 0});
  }

  fill({row, column}, color = null, {name, desc_left, desc_right} = {name: '', desc_left: '', desc_right: ''}) {
    while (this.columns <= column) this.addColumn();
    while (this.rows <= row) this.addRow();
    if (this.tiles[row][column]) this.tiles[row][column].update(color, {name, desc_left, desc_right});
    // this case will only happen inside addColumn/addRow, it's here to collapse the recursive calls
    else this.tiles[row][column] = new Tile({app: this.app, viewport: this.viewport, settings: this.settings}, color, {name, desc_left, desc_right}).draw({row, column});
    return this;
  }
}

