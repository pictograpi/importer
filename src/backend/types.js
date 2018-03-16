const firebaseAdmin = require("firebase-admin");

module.exports = {
  add,
  exists,
  get
};

/**
 * Adds a type to the database.
 * @param {Object} type Type to include in the DB.
 * @param {string} type.code Code of the type.
 * @param {string} type.name Natural name of the type.
 * @returns {Promise} To be resolved when finished.
 */
function add({ code, name }) {
  if (!code || !name) {
    throw new Error();
  }

  return firebaseAdmin
    .firestore()
    .collection("types")
    .add({ code, name });
}

/**
 * Checks if a type exists.
 * @param {Object} type Type to check.
 * @param {string} type.code Code of the type.
 * @returns {Promise.<boolean>} To be resolved when finished.
 */
function exists({ code }) {
  return firebaseAdmin
    .firestore()
    .collection("types")
    .where("code", "==", code)
    .get()
    .then(snapshot => {
      const types = [];
      snapshot.forEach(doc => types.push(doc.data()));
      return types.length > 0;
    });
}

/**
 * Obtains all types.
 * @returns {Promise} To be resolved with all types.
 */
function get() {
  return firebaseAdmin
    .firestore()
    .collection("types")
    .get()
    .then(snapshot => {
      const types = [];
      snapshot.forEach(doc => types.push(doc.data()));
      return types;
    });
}
