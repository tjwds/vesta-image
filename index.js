const Jimp = require("jimp");

const widths = [
  135, 169, 205, 238, 273, 307, 343, 377, 413, 448, 484, 518, 554, 589, 625,
  661, 697, 731, 767, 802, 838, 874,
];
const heights = [348, 410, 474, 536, 600, 661];

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

const input = JSON.parse(process.argv[2]);

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
