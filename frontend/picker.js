import { Color } from './color.js';

export class Picker {
  // l - lightness
  // c - chroma
  // h - hue
  // R - range element
  // C - canvas element
  lR; cR; hR;
  lC; cC; hC;

  dragging = false;
  lastUpdate = 0;

  canvases = () => [this.lC, this.cC, this.hC];

  constructor() {
    document.querySelectorAll('.range').forEach(el => {
      const input = el.querySelector('input');
      this[input.name[0] + 'R'] = input;
      this[input.name[0] + 'C'] = el.querySelector('canvas');
    });
    this.canvases().forEach(el => {
      this.partner(el).addEventListener('input', () => this.update());
      ['mousedown', 'touchstart'].forEach(e => {
        el.addEventListener(e, (f) => {
          this.dragging = true;
          this.drag(f);
        });
      });
      ['mousemove', 'touchmove'].forEach(e => {
        el.addEventListener(e, (f) => this.drag(f));
      });
      ['mouseup', 'touchend'].forEach(e => {
        el.addEventListener(e, () => this.dragging = false);
      });
    });
    document.querySelector('#edittile').addEventListener('colorpicker', (e) => {
      this.canvases().forEach(el => {
        el.width = el.clientWidth;
        el.height = el.clientHeight;
      });
      this.update();
    });
  }

  partner(el) {
    if (el.tagName == 'INPUT') {
      return el.parentElement.querySelector('canvas');
    } else {
      return el.parentElement.querySelector('input');
    }
  }

  nudge(col, label, value) {
    switch (label) {
      case 'l': return Color.fromOklch({L: col.oklch.L + value, C: col.oklch.C, h: col.oklch.h});
      case 'c': return Color.fromOklch({L: col.oklch.L, C: col.oklch.C + value, h: col.oklch.h});
      case 'h': return Color.fromOklch({L: col.oklch.L, C: col.oklch.C, h: col.oklch.h + value});
    }
  }

  update(force=false) {
    // rate limit updates to 20 fps
    if (!force) {
      if (this.lastUpdate >= Date.now() - 50) return;
    }
    this.lastUpdate = Date.now();

    const real = Color.fromOklch({L: this.lR.value, C: this.cR.value, h: this.hR.value})
    const bg = Color.fromVar('--mdc-theme-surface');

    this.canvases().forEach(el => {
      const partner = this.partner(el);
      const ctx = el.getContext('2d');

      for (let i = 0; i < el.height; i++) {
        const percent = parseFloat(partner.max) * i / el.height;
        const col = this.nudge(real, partner.name[0], percent - partner.value);
        if (col.clamped) ctx.fillStyle = bg.hex;
        else ctx.fillStyle = `oklch(${col.oklch.L}% ${col.oklch.C} ${col.oklch.h})`;
        ctx.fillRect(0, el.height - i, el.width, 1);
      }

      const letter = partner.name[0];
      if (letter != 'h') letter.toUpperCase();
      ctx.fillStyle = 'white';
      ctx.font = '20px Nunito';
      ctx.fillText(letter, 5, el.height - 5, el.width - 10);
    });
  }

  drag(e) {
    if (!this.dragging) return;
    if (this.lastUpdate >= Date.now() - 50) return;
    const range = this.partner(e.target);
    const y = e instanceof TouchEvent ? e.touches[0].clientY - e.target.getBoundingClientRect().top : e.layerY;
    range.value = (1 - y / e.target.height) * parseFloat(range.max);
    range.dispatchEvent(new Event('input'));
  }
}

