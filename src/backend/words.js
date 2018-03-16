const firebaseAdmin = require("firebase-admin");

module.exports = {
  add,
  exists,
  get
};

/**
 * Adds an image to the database.
 * @param {Object} word Word to insert in the database.
 * @param {string} word.word Word.
 * @param {string} word.languageCode Language code of the word.
 * @param {string} word.typeCode Type code of the word.
 * @param {string} word.imageId Image id.
 * @returns {Promise} To be resolved when finished.
 */
function add({ word, languageCode, typeCode, imageId }) {
  if (!word || !languageCode || !typeCode || !imageId) {
    throw new error();
  }

  return firebaseAdmin
    .firestore()
    .collection("words")
    .add({
      word,
      languageCode,
      typeCode,
      imageId
    });
}

/**
 * Obtains a word from database.
 * @param {Object} word The word to look form.
 * @param {string} word.word Word to look for.
 * @param {string} word.languageCode Language code of the word.
 * @returns {Promise.<Array>} Array of words.
 */
function get({ word, languageCode }) {
  return firebaseAdmin
    .firestore()
    .collection("words")
    .where("word", "==", word)
    .where("languageCode", "==", languageCode)
    .get()
    .then(snapshot => {
      const words = [];
      snapshot.forEach(doc => words.push(doc.data()));
      return words;
    });
}

/**
 * Checks if a word is already existing in the database.
 * @param {Object} word Word to check if it exists.
 * @param {string} word.word Word to look for.
 * @param {string} word.languageCode Language code of the word. It refers to a language
 * @param {string} word.typeCode Type code of the language. It refers to a type.
 * @param {string} word.imageId Image id. It refers to an image.
 * @returns {Promise.<boolean>} To be resolved with the value.
 */
function exists({ word, languageCode, typeCode, imageId }) {
  return firebaseAdmin
    .firestore()
    .collection("words")
    .where("word", "==", word)
    .where("languageCode", "==", languageCode)
    .where("typeCode", "==", typeCode)
    .where("imageId", "==", imageId)
    .get()
    .then(snapshot => {
      const docs = [];
      snapshot.forEach(doc => docs.push(doc.data()));
      return docs.length > 0;
    });
}
