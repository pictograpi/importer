const winston = require("winston");

const logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      filename: "importer-debug.log",
      json: false
    })
  ]
});

module.exports = logger;
