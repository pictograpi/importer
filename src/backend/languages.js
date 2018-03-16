const firebaseAdmin = require("firebase-admin");

module.exports = {
  add,
  exists,
  get
};

/**
 * Adds a languages to the database.
 * @param {Object} language Language to include in the DB.
 * @param {string} language.code Code of the language.
 * @param {string} language.name Natural name of the language.
 * @returns {Promise} To be resolved when finished.
 */
function add({ code, name }) {
  if (!code || !name) {
    throw new Error();
  }

  return firebaseAdmin
    .firestore()
    .collection("languages")
    .add({ code, name });
}

/**
 * Checks if a language exists.
 * @param {Object} language Language to check.
 * @param {string} language.code Code of the language.
 * @returns {Promise.<boolean>} To be resolved when finished.
 */
function exists({ code }) {
  return firebaseAdmin
    .firestore()
    .collection("languages")
    .where("code", "==", code)
    .get()
    .then(snapshot => {
      const languages = [];
      snapshot.forEach(doc => languages.push(doc.data()));
      return languages.length > 0;
    });
}

/**
 * Obtains all languages.
 * @returns {Promise} To be resolved with all languages.
 */
async function get() {
  return firebaseAdmin
    .firestore()
    .collection("languages")
    .get()
    .then(snapshot => {
      const languages = [];
      snapshot.forEach(doc => languages.push(doc.data()));
      return languages;
    });
}
