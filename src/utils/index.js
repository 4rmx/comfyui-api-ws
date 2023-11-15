function countDecimals(value) {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
}

function addZero(count) {
  let txt = '1';
  for (let i = 0; i < count; i++) {
    txt += '0';
  }
  return Number(txt);
}

function randomSeed() {
  const rand = Math.random();
  const count = countDecimals(rand);
  return Math.floor(rand * addZero(count));
}

module.exports = { randomSeed }; 