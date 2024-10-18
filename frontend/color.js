function clamp(value, min, max) {
  return Math.max(Math.min(value, max), min);
}

function hexNumToRGB(hex) {
  return {r: hex >> 16, g: (hex >> 8) & 255, b: hex & 255};
}

function hexToRGB(str) {
  var hex = str.replace("#", "");
  var num = parseInt(hex, 16);
  return hexNumToRGB(num);
};

function rgbToHexNum({r, g, b}) {
  return (r << 16) + (g << 8) + b;
}

function rgbToHex({r, g, b}) {
  return "#" + rgbToHexNum({r, g, b}).toString(16).slice(1);
}

const gammaToLinear = (c) => c >= 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;

const linearToGamma = (c) => c >= 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;

function rgbToOklab({r, g, b}) {
  r = gammaToLinear(r / 255); g = gammaToLinear(g / 255); b = gammaToLinear(b / 255);
  var l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  var m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  var s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  l = Math.cbrt(l); m = Math.cbrt(m); s = Math.cbrt(s);
  return {
    L: l * +0.2104542553 + m * +0.7936177850 + s * -0.0040720468,
    a: l * +1.9779984951 + m * -2.4285922050 + s * +0.4505937099,
    b: l * +0.0259040371 + m * +0.7827717662 + s * -0.8086757660
  }
}

function oklabToSRGB({L, a, b}) {
  var l = L + a * +0.3963377774 + b * +0.2158037573;
  var m = L + a * -0.1055613458 + b * -0.0638541728;
  var s = L + a * -0.0894841775 + b * -1.2914855480;
  l = l ** 3; m = m ** 3; s = s ** 3;
  var r = l * +4.0767416621 + m * -3.3077115913 + s * +0.2309699292;
  var g = l * -1.2684380046 + m * +2.6097574011 + s * -0.3413193965;
  var b = l * -0.0041960863 + m * -0.7034186147 + s * +1.7076147010;
  r = 255 * linearToGamma(r); g = 255 * linearToGamma(g); b = 255 * linearToGamma(b);
  r = clamp(r, 0, 255); g = clamp(g, 0, 255); b = clamp(b, 0, 255);
  r = Math.round(r); g = Math.round(g); b = Math.round(b);
  return {r, g, b};
}

function barColor(hexNum) {
  const {L, a, b} = rgbToOklab(hexNumToRGB(hexNum));
  return rgbToHexNum(oklabToSRGB({L: L * 0.9, a, b}));
}

function textColor(hexNum) {
  const {L, a, b} = rgbToOklab(hexNumToRGB(hexNum));
  const col = L <= 0.483 ? {L: L * 0.9 + 0.3, a, b} : {L: L * 0.75 - 0.15, a, b};
  return rgbToHexNum(oklabToSRGB(col));
}

