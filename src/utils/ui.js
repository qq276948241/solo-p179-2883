const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m'
  },

  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m'
  }
};

function c(text, colorCode) {
  return colorCode + text + colors.reset;
}

function title(text) {
  return c(text, colors.fg.brightRed + colors.bright);
}

function place(text) {
  return c(text, colors.fg.brightYellow + colors.bright);
}

function enemy(text) {
  return c(text, colors.fg.brightGreen);
}

function item(text) {
  return c(text, colors.fg.brightCyan);
}

function gold(text) {
  return c(text, colors.fg.yellow);
}

function system(text) {
  return c(text, colors.fg.gray);
}

function warning(text) {
  return c(text, colors.fg.brightMagenta);
}

function hpBar(current, max) {
  const ratio = current / max;
  const length = 20;
  const filled = Math.floor(ratio * length);
  const empty = length - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  let color;
  if (ratio <= 0.3) {
    color = colors.blink + colors.fg.brightRed;
  } else if (ratio <= 0.6) {
    color = colors.fg.brightYellow;
  } else {
    color = colors.fg.brightGreen;
  }

  return `${c('HP:', colors.fg.white)} [${c(bar, color)}] ${current}/${max}`;
}

function enemyHpBar(current, max) {
  const ratio = current / max;
  const length = 20;
  const filled = Math.floor(ratio * length);
  const empty = length - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  let color;
  if (ratio <= 0.3) {
    color = colors.blink + colors.fg.red;
  } else if (ratio <= 0.6) {
    color = colors.fg.yellow;
  } else {
    color = colors.fg.green;
  }

  return `[${c(bar, color)}] ${current}/${max}`;
}

function clearScreen() {
  process.stdout.write('\x1B[2J\x1B[0f');
}

function moveCursor(x, y) {
  process.stdout.write(`\x1B[${y};${x}H`);
}

function repeat(char, times) {
  return char.repeat(times);
}

function pad(text, length, padChar = ' ') {
  if (text.length >= length) return text.slice(0, length);
  return text + padChar.repeat(length - text.length);
}

function center(text, width, padChar = ' ') {
  const totalPadding = width - text.length;
  if (totalPadding <= 0) return text.slice(0, width);
  const left = Math.floor(totalPadding / 2);
  const right = totalPadding - left;
  return padChar.repeat(left) + text + padChar.repeat(right);
}

function divider(width = 60, char = '═') {
  return c(repeat(char, width), colors.fg.gray);
}

module.exports = {
  colors,
  c,
  title,
  place,
  enemy,
  item,
  gold,
  system,
  warning,
  hpBar,
  enemyHpBar,
  clearScreen,
  moveCursor,
  repeat,
  pad,
  center,
  divider
};
