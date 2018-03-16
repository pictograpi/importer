require("dotenv").config();
const firebaseAdmin = require("firebase-admin");
const ProgressBar = require("progress");
const csvParse = require("csv-parse/lib/sync");
const fs = require("fs");
const backendInit = require("../backend/init");
const backendLanguages = require("../backend/languages");
const backendWords = require("../backend/words");
const logger = require("../utils/logger");

module.exports = (async () => {
  backendInit();
  let verbs = getVerbsFromFile();

  if (process.env.CONTINUE) {
    const rootIndex = verbs.findIndex(verb => verb[0] === process.env.CONTINUE);

    logger.info(
      "Resuming from root:",
      process.env.CONTINUE,
      "at index",
      rootIndex
    );
    verbs = verbs.slice(rootIndex);
  }

  await add(verbs);

  process.exit();
})();

/**
 * Obtains the data from a CSV file.
 *
 * @returns {Array} CSV data parsed.
 */
function getVerbsFromFile() {
  const fileData = fs.readFileSync(`./tmp/${process.env.LANGUAGE}.txt`);

  return csvParse(fileData, { relax_column_count: true });
}

/**
 * Adds all verbs to the database.
 *
 * @param {Array} verbs Verbs to add.
 */
async function add(verbs) {
  const bar = new ProgressBar("Adding verbs to FireStore [:bar]", {
    total: verbs.length,
    width: 100
  });
  const languages = await backendLanguages.get();
  const language = languages.filter(
    language => language.code === process.env.LANGUAGE
  )[0];

  if (!language) {
    logger.error("Language is invalid");
    throw new Error("Language is invalid");
  }

  for (const verb of verbs) {
    await addVerb(verb, language);
    bar.tick();
  }
}

/**
 * Extract root and tenses from a verb and inserts them into the database.
 * @param {Array.<string>} verb Verb to insert in the database.
 * @param {Object} language Language of the verbs to be imported.
 */
async function addVerb(verb, language) {
  const root = verb[0];
  const tenses = verb.slice(1);

  const words = await backendWords.get({
    word: root,
    languageCode: language.code
  });

  if (words.length) {
    const uniqueTenses = tenses.filter((tense, pos) => {
      return tenses.indexOf(tense) === pos;
    });

    // Iterates between tenses and creates a new word for each tense and imageId.
    for (const tense of uniqueTenses) {
      for (const { imageId } of words) {
        logger.info("Adding tense:", {
          word: tense,
          languageCode: language.code,
          typeCode: "verb",
          imageId
        });

        await backendWords.add({
          word: tense,
          languageCode: language.code,
          typeCode: "verb",
          imageId
        });
      }
    }
  }
}
