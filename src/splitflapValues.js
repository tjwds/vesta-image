const Jimp = require("jimp");

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

module.exports = splitflapValues;
