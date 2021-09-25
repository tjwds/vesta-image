const decodeBoard = (string) => {
  string.replaceAll("-", "+").replaceAll("_", "/");
  console.log(string)
  string = atob(string);

  let codes = [];

  const iterator = string[Symbol.iterator]();
  let queue = Array.from(iterator);

  while (queue.length) {
    const char = queue.shift().codePointAt(0);

    if (char & 128) {
      if (queue.length === 0) throw "underrun!";

      const code = char ^ 128;
      const run = queue.shift().codePointAt(0);

      codes.push(...Array(run).fill(code));
      continue;
    }

    codes.push(char);
  }

  if (codes.length !== 6 * 22) {
    console.log(`wrong length for encoded board: ${codes.length}`);
    return Array(6).fill(Array(22).fill(0));
  }

  const a = Array(6)
    .fill(1)
    .map((i) => codes.splice(0, 22));
  return a;
};

module.exports = decodeBoard;
