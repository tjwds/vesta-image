const express = require("express");
const app = express();

const Jimp = require("jimp");

const splitflapValues = require("./src/splitflapValues.js");
const coordinates = require("./src/vestaboardCoordinates");
const decodeBoard = require("./src/decodeBoard.js");

const port = process.argv[2];

let images;

const processPath = function (req, res) {
  try {
    console.log(`Serving ${req.params.id}`);

    const input = decodeBoard(req.params.id || "");
    let template = req.params.template;
    if (!coordinates[template]) {
      template = "vestaboard";
    }
    const { widths, heights } = coordinates[template];

    Jimp.read(`./images/${template}/template.png`).then((templateFile) => {
      input.forEach((row, rowIndex) => {
        const height = heights[rowIndex];

        row.forEach((char, index) => {
          const entry = images[char];
          if (char > 0) {
            templateFile.blit(entry, widths[index], height);
          }
        });
      });

      templateFile.getBuffer(Jimp.MIME_PNG, (error, buffer) => {
        if (error) {
          console.log(error);
          throw new Error(error);
        } else {
          res.contentType("png");
          res.send(buffer);
        }
      });
    });
  } catch (err) {
    console.log(err);
    res.contentType("text/plain");
    res.send(
      "Sorry, something has gone wrong.  Please alert your nearest plumber."
    );
  }
};

app.get("", processPath);
app.get("/:id", processPath);
app.get("/:id/:template", processPath);

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
