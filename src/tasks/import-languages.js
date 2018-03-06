const backendInit = require("../backend/init");
const backendLanguages = require("../backend/languages");
const xml = require("../utils/xml");
const path = require("path");
const ProgressBar = require("progress");
const logger = require("../utils/logger");

module.exports = (async () => {
  const data = xml.parseFile(path.resolve("../tmp/images.xml"));

  backendInit();
  await add(data.languages);

  process.exit();
})();

/**
 * Adds languages to the database.
 *
 * @param {Array} languages Languages to be inserted.
 */
async function add(languages) {
  const bar = new ProgressBar("Adding languages to FireStore [:bar]", {
    total: languages.length,
    width: 100
  });

  for (const language of languages) {
    const isExisting = await backendLanguages.exists(language);

    if (isExisting) {
      bar.tick();
      logger.info("Language already existing:", language.code);
    } else {
      await backendLanguages.add(language);

      bar.tick();
      logger.info("Language inserted:", language.code);
    }
  }
}
