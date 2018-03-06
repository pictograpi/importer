require("dotenv").config();
const decompress = require("decompress");
const path = require("path");

module.export = (async () => {
  await decompress(path.resolve(process.env.ZIP), "../tmp");
})();