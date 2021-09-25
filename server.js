const express = require("express");
const app = express();

const Jimp = require("jimp");

const splitflapValues = require("./src/splitflapValues.js");
const { widths, heights } = require("./src/vestaboardCoordinates");
const decodeBoard = require("./src/decodeBoard.js");

const port = process.argv[2];

let images;

app.get("/:id", function (req, res) {
  console.log(`Serving ${req.params.id}`);

  res.contentType("png");
  const input = decodeBoard(req.params.id);

  Jimp.read("./images/vestaboard/template.png").then((template) => {
    input.forEach((row, rowIndex) => {
      const height = heights[rowIndex];

      row.forEach((char, index) => {
        const entry = images[char];
        if (char > 0) {
          template.blit(entry, widths[index], height);
        }
      });
    });

    template.getBuffer(Jimp.MIME_PNG, (error, buffer) => {
      if (error) {
        console.log(error);
      } else {
        res.send(buffer);
      }
    });
  });
});

const startServer = async function () {
  const allImg = [];
  for (let x = 1; x <= 69; x++) {
    if (![43, 45, 51, 57, 58, 61].includes(x)) {
      allImg.push(x);
    }
  }

  images = await splitflapValues(allImg);
  template = await Jimp.read("./images/vestaboard/template.png");

  app.listen(port, () => {
    console.log(`Vesta image server running at http://localhost:${port}`);
  });
};

startServer();
