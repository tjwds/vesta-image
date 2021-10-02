const Jimp = require("jimp");

const splitflapValues = require("./src/splitflapValues.js");
const vestaboard = require("./src/vestaboardCoordinates");
const { widths, heights } = vestaboard;
const decodeBoard = require("./src/decodeBoard.js");

// node index.js '[[67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65],[6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13],[67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65],[6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13],[67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65],[6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13,67,65,6,13]]'

let input;
const stateString = process.argv[2];
try {
  input = JSON.parse(stateString);
} catch (err) {
  input = decodeBoard(stateString);
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
