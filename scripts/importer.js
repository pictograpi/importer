require("dotenv").config();
const firebase = require("firebase");
require("firebase/firestore");
const winston = require("winston");
const fs = require("fs");
const decompress = require("decompress");
const path = require("path");
const shell = require("shelljs");
const DOMParser = require("xmldom").DOMParser;
const ProgressBar = require("progress");
const logger = new winston.Logger({
  transports: [new winston.transports.Console()]
});
var db;

function toArray(list) {
  return Array.prototype.slice.apply(list);
}

/**
 * Parses the XML images.xml file.
 *
 * @returns {Object} Images data.
 */
function parseXmlDocument() {
  const data = fs.readFileSync("./tmp/images.xml");
  const document = new DOMParser().parseFromString(data.toString());

  return {
    languages: parseLanguages(document),
    types: parseTypes(document),
    images: parseImages(document)
  };
}

/**
 * Obtains languages from document
 *
 * @param {DOMDocument} document Document to obtain its languages.
 */
function parseLanguages(document) {
  const languages = toArray(
    document
      .getElementsByTagName("languages")[0]
      .getElementsByTagName("language")
  );

  return languages.map(element => ({
    code: element.getAttribute("code"),
    name: element.getAttribute("name")
  }));
}

/**
 * Parse types from a given document.
 *
 * @param {DOMDocument} document Document to extract its types.
 * @returns {Array} Types obtained.
 */
function parseTypes(document) {
  const types = toArray(
    document.getElementsByTagName("types")[0].getElementsByTagName("type")
  );

  return types.map(element => ({
    code: element.getAttribute("code"),
    name: element.getAttribute("name")
  }));
}

/**
 * Parse images from a given document.
 *
 * @param {DOMDocument} document Document to extract its images.
 * @returns {Array} Images obtained.
 */
function parseImages(document) {
  const images = toArray(document.getElementsByTagName("image"));

  return images.map(image => ({
    id: image.getAttribute("id"),
    words: parseWords(image)
  }));
}

/**
 * Parse words obtained from a given image element.
 *
 * @param {DOMElement} imageElement Image element to obtain its words.
 * @returns {Array} Words obtained.
 */
function parseWords(imageElement) {
  const languages = toArray(imageElement.getElementsByTagName("language"));
  const wordArray = [];

  languages.forEach(language => {
    const words = toArray(language.getElementsByTagName("word"));

    words.forEach(word => {
      wordArray.push({
        word: word.childNodes[0].data,
        language: language.getAttribute("code"),
        type: word.getAttribute("type")
      });
    });
  });

  return wordArray;
}

/**
 * Cleans temporal folders
 */
function clean() {
  shell.rm("-rf", "./tmp");
  logger.info("Clean finished");
}

/**
 * Adds types to the database.
 *
 * @param {Array} types Types to be inserted.
 */
async function addTypes(types) {
  const bar = new ProgressBar("Adding types to FireStore [:bar]", {
    total: types.length
  });

  await Promise.all(
    types.map(type => {
      return db
        .collection("types")
        .doc()
        .set({ code: type.code, name: type.name })
        .then(() => bar.tick());
    })
  );
}

/**
 * Adds languages to the database.
 *
 * @param {Array} languages Languages to be inserted.
 */
async function addLanguages(languages) {
  const bar = new ProgressBar("Adding languages to FireStore [:bar]", {
    total: languages.length
  });

  await Promise.all(
    languages.map(language => {
      return db
        .collection("languages")
        .doc()
        .set({ code: language.code, name: language.name })
        .then(() => bar.tick());
    })
  );
}

/**
 * Adds images to the database.
 *
 * @param {Object} data Data to insert.
 */
async function addImages({ images, languages, types }) {
  const bar = new ProgressBar("Adding images to FireStore [:bar]", {
    total: images.length
  });

  await Promise.all(
    images.map(image => {
      return Promise.all(
        image.words.map(word => {
          const isValidLanguage = languages.some(
            ({ code }) => word.language === code
          );
          const isValidType = types.some(({ code }) => word.type === code);

          if (!isValidLanguage) {
            logger.error(
              `Language ${
                word.language
              } not valid. Valid languages: ${languages}`
            );
            throw new Error();
          }

          if (!isValidType) {
            logger.error(
              `Type ${word.language} not valid. Valid types: ${types}`
            );
            throw new Error();
          }

          return db
            .collection("images")
            .doc()
            .set({
              id: image.id,
              word: word.word,
              languageCode: word.language,
              typeCode: word.type
            });
        })
      ).then(() => bar.tick());
    })
  );
}

/**
 * Inits the Firebase connection.
 */
async function init() {
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.FIREBASE_DATABASEURL,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID
  });

  await firebase
    .auth()
    .signInWithEmailAndPassword(
      process.env.DATABASE_ADMIN,
      process.env.DATABASE_PASSWORD
    );

  db = firebase.firestore();

  logger.info("Firebase & firestore init");
}

/**
 * Unzips the pictographs file.
 */
function unzip() {
  logger.info("Unzipping file:", process.env.ZIP);
  return decompress(path.resolve(process.env.ZIP), "./tmp");
}

// Main
(async () => {
  try {
    clean();
    await init();
    await unzip();
    const data = parseXmlDocument();
    logger.info(
      `Found: ${data.languages.length} languages, ${
        data.types.length
      } types and ${data.images.length} images`
    );
    await addLanguages(data.languages);
    await addTypes(data.types);
    await addImages(data);
    process.exit();
  } catch (error) {
    logger.error("En error has occurred", error);
    process.exit(1);
  }
})();
