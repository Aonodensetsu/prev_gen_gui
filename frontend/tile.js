export class Tile {
  constructor(
    {app, viewport, settings},
    color,
    {name, desc_left, desc_right} = {name: '', desc_left: '', desc_right: ''}
  ) {
    this.app = app;
    this.viewport = viewport;
    this.settings = settings;
    this.color = color;
    this.name = name;
    this.desc_left = desc_left;
    this.desc_right = desc_right;
  }

  draw({gx, gy}) {
    const g = new PIXI.Graphics();
    // main bg
    g.beginFill(this.color.hexNum);
    g.drawRect(0, 0, this.settings.grid_width, this.settings.grid_height - this.settings.bar_height);
    // darker bar
    g.beginFill(this.color.barColor.hexNum);
    g.drawRect(0, this.settings.grid_height - 10, this.settings.grid_width, this.settings.bar_height);
    g.endFill();
    const t = this.app.renderer.generateTexture(g);
    const s = new PIXI.Sprite(t);
    // name
    if (this.name) {
      // name itself
      const n = new PIXI.Text(this.name, {
        fontFamily: 'Nunito',
        fontSize: this.settings.name_size,
        fontWeight: 600,
        fill: this.color.textColor.hexNum,
        align: 'center'
      });
      n.anchor.set(0.5, 0.5);
      n.x = this.settings.grid_width / 2;
      n.y = this.settings.grid_height / 2 + this.settings.name_offset;
      n.updateText();
      s.addChild(n);
      // hex under name
      const hc = this.settings.hex_upper ? this.color.hex.toUpperCase() : this.color.hexi.toLowerCase();
      const h = new PIXI.Text(this.settings.show_hash ? hc : hc.replace('#', ''), {
        fontFamily: 'Nunito',
        fontSize: this.settings.hex_size,
        fontWeight: 500,
        fill: this.color.textColor.hexNum,
        align: 'center'
      });
      h.anchor.set(0.5, 0.5);
      h.x = this.settings.grid_width / 2;
      h.y = this.settings.grid_height / 2 + this.settings.hex_offset;
      h.updateText();
      s.addChild(h);
    } else {
      // hex with no name
      const hc = this.settings.hex_upper ? this.color.hex.toUpperCase() : this.color.hex.lowerCase();
      const h = new PIXI.Text(this.settings.show_hash ? hc : hc.replace('#', ''), {
        fontFamily: 'Nunito',
        fontSize: this.settings.hex_size_nameless,
        fontWeight: 600,
        fill: this.color.textColor.hexNum,
        align: 'center'
      });
      h.anchor.set(0.5, 0.5);
      h.x = this.settings.grid_width / 2;
      h.y = this.settings.grid_height / 2 + this.settings.hex_offset_nameless;
      h.updateText();
      s.addChild(h);
    }
    // description right
    if (this.desc_right) {
      const r = new PIXI.Text(this.desc_right, {
        fontFamily: 'Nunito',
        fontSize: this.settings.desc_size,
        fontWeight: 500,
        fill: this.color.textColor.hexNum,
        align: 'center'
      });
      r.anchor.set(1, 0);
      r.x = this.settings.grid_width - this.settings.desc_offset_x;
      r.y = this.settings.desc_offset_y;
      r.updateText();
      s.addChild(r);
    }
    // description left
    if (this.desc_left) {
      const r = new PIXI.Text(this.desc_left, {
        fontFamily: 'Nunito',
        fontSize: this.settings.desc_size,
        fontWeight: 500,
        fill: this.color.textColor.hexNum,
        align: 'center'
      });
      //r.anchor.set(1, 0);
      r.x = this.settings.desc_offset_x;
      r.y = this.settings.desc_offset_y;
      r.updateText();
      s.addChild(r);
    }
    s.position.set(gx * this.settings.grid_width, gy * this.settings.grid_height);
    this.viewport.addChild(s);
    return s;
  }
}

