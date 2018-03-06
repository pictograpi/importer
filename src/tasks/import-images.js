require("dotenv").config();
const firebaseAdmin = require("firebase-admin");
const backendInit = require("../backend/init");
const backendImages = require("../backend/images");
const backendTypes = require("../backend/types");
const backendLanguages = require("../backend/languages");
const path = require("path");
const xml = require("../utils/xml");
const fs = require("fs");
const imageinfo = require("imageinfo");
const ProgressBar = require("progress");
const logger = require("../utils/logger");
let db;

module.exports = (async () => {
  const data = xml.parseFile(path.resolve("../tmp/images.xml"));

  backendInit();

  // Remove some images on CONTINUE
  if (process.env.CONTINUE) {
    const index = data.images.findIndex(
      image => image.id === process.env.CONTINUE
    );

    logger.info("Index found", index);

    if (index >= 1) {
      logger.info("Resuming from image with id:", process.env.CONTINUE);
      data.images = data.images.slice(index);
    }
  }

  await add(data);

  process.exit();
})();

/**
 * Adds images to the database.
 *
 * @param {Object} data Data to insert.
 */
async function add({ images }) {
  const bar = new ProgressBar("Adding images to FireStore [:bar]", {
    total: images.length,
    width: 100
  });
  const languages = await backendLanguages.get();
  const types = await backendTypes.get();

  for (const image of images) {
    await addImage(image.id);
    await addWords(image, languages, types);

    bar.tick();
  }
}

/**
 * Adds an image to the database and uploads it to storage.
 * @param {Object} image Image to upload.
 * @returns {Promise} To be resolved when finished.
 */
async function addImage(id) {
  const isExisting = await backendImages.exists({ id });

  if (!isExisting) {
    const filename = path.resolve("../tmp", id);
    const image = fs.readFileSync(filename);
    const info = imageinfo(image);

    await backendImages.upload(filename);
    await backendImages.add({
      id,
      storageId: id,
      format: info.format,
      mimeType: info.mimeType,
      width: info.width,
      height: info.height
    });

    logger.info("Image inserted:", id);
  } else {
    logger.info("Image already existing:", id);
  }
}

async function addWords(image, languages, types) {
  for (const word of image.words) {
    const isValidLanguage = languages.some(
      language => language.code === word.languageCode
    );
    const isValidType = types.some(type => type.code === word.typeCode);
    const isExisting = await isExistingWord(word, image);

    if (isExisting) {
      logger.info("Word already existing:", word.word, image.id);
    } else if (!isValidLanguage || !isValidType) {
      logger.error("Word is invalid:", word);
    } else {
      await firebaseAdmin
        .firestore()
        .collection("words")
        .add({
          word: word.word,
          languageCode: word.languageCode,
          typeCode: word.typeCode,
          imageId: image.id
        });

      logger.info("Word inserted:", word.word, image.id);
    }
  }
}

async function isExistingWord(word, image) {
  const isExistingWord = await firebaseAdmin
    .firestore()
    .collection("words")
    .where("word", "==", word.word)
    .where("languageCode", "==", word.languageCode)
    .where("typeCode", "==", word.typeCode)
    .where("imageId", "==", image.id)
    .get()
    .then(snapshot => {
      const docs = [];
      snapshot.forEach(doc => docs.push(doc.data()));
      return docs.length > 0;
    });

  return isExistingWord;
}
