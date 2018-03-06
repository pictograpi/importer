const backendInit = require("../backend/init");
const backendTypes = require("../backend/types");
const xml = require("../utils/xml");
const path = require("path");
const ProgressBar = require("progress");
const logger = require("../utils/logger");

module.exports = (async () => {
  const data = xml.parseFile(path.resolve("../tmp/images.xml"));

  backendInit();
  await add(data.types);

  process.exit();
})();

/**
 * Adds types to the database.
 *
 * @param {Array} types Types to be inserted.
 */
async function add(types) {
  const bar = new ProgressBar("Adding types to FireStore [:bar]", {
    total: types.length,
    width: 100
  });

  for (const type of types) {
    const isExisting = await backendTypes.exists(type);

    if (isExisting) {
      bar.tick();
      logger.info("Type already existing:", type.code);
    } else {
      await backendTypes.add(type);
      bar.tick();
      logger.info("Type inserted:", type.code);
    }
  }
}
