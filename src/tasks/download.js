const download = require("download");
const logger = require("../utils/logger");
const ProgressBar = require("progress");

module.exports = (async () => {
  const bar = new ProgressBar("Downloading pictographs [:bar] :percent :etas", {
    total: 0,
    width: 100
  });

  if (!process.env.URL) {
    throw new Error("Download URL is needed.");
  }

  logger.info("Download started");

  await download(process.env.URL, "./tmp", { extract: true }).on(
    "response",
    res => {
      bar.total = res.headers["content-length"];
      res.on("data", data => bar.tick(data.length));
    }
  );

  logger.info("Download finished");
})();
