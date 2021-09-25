const Jimp = require("jimp");

const widths = [
  135, 169, 205, 238, 273, 307, 343, 377, 413, 448, 484, 518, 554, 589, 625,
  661, 697, 731, 767, 802, 838, 874,
];
const heights = [348, 410, 474, 536, 600, 661];

const decodeBoard = (string) => {
  string.replaceAll("-", "+").replaceAll("_", "/");
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

const splitflapValues = async function (input) {
  const flattened = input.flat();
  const possible = new Set();

  flattened.forEach((val) => possible.add(val));

  const used = Array.from(possible);

  const images = {};

  const promises = used.map(
    (num) =>
      new Promise((resolve) => {
        if (num === 0) {
          resolve();
          return;
        }
        Jimp.read(`./images/vestaboard/cells/${num}.jpg`).then((val) => {
            images[num] = val;
            resolve();
        });
      })
  );

  await Promise.all(promises);


  return images;
};

// node index.js '[[67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65],[6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13],[67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65],[6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13],[67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65],[6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13]]'

let input;
const stateString = process.argv[2];
try {
  input = JSON.parse(stateString);
} catch (err) {
  input = decodeBoard(stateString)
}

const execute = async function () {
  const values = await splitflapValues(input);
  Jimp.read("./images/vestaboard/template.png")
    .then(function (image) {
      loadedImage = image;
      return Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
    })
    .then(function (font) {
      input.forEach((row, rowIndex) => {
        const height = heights[rowIndex];

        row.forEach((char, index) => {
          const entry = values[char];
          if (char > 0) {
            loadedImage.blit(entry, widths[index], height);
          }
        });
      });
      loadedImage.write("./vesta-processed.jpg");
    });
};

execute();
