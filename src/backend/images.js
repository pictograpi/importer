const firebaseAdmin = require("firebase-admin");
const fs = require("fs");

module.exports = {
  add,
  exists,
  upload
};

/**
 * Adds an image to the database.
 * @param {Object} image Image to include in the DB.
 * @param {string} image.id Id of the image.
 * @param {string} image.storageId Reference to the storage id.
 * @param {string} image.format Format of the image
 * @param {string} image.mimeType mimetype of the image.
 * @param {number} image.width Width of the image
 * @param {number} image.height Height of the image.
 * @returns {Promise} To be resolved when finished.
 */
function add({ id, storageId, format, mimeType, width, height }) {
  if (!id || !storageId || !format || !mimeType || !width || !height) {
    throw new Error("Image does not have valid properties.");
  }

  return firebaseAdmin
    .firestore()
    .collection("images")
    .add({ id, storageId, format, mimeType, width, height });
}

/**
 * Checks if a image exists.
 * @param {Object} image Image to check.
 * @param {string} image.id Id of the image.
 * @returns {Promise.<boolean>} To be resolved when finished.
 */
async function exists({ id }) {
  let images = [];
  const snapshot = await firebaseAdmin
    .firestore()
    .collection("images")
    .where("id", "==", id)
    .get();

  snapshot.forEach(doc => images.push(doc.data()));

  return images.length > 0;
}

/**
 * Uploads an image with a given filename.
 * @param {*} filename
 */
function upload(filename) {
  const image = fs.readFileSync(filename);

  if (!image) {
    throw new Error("Image to upload does not exist.");
  }

  return firebaseAdmin
    .storage()
    .bucket()
    .upload(filename);
}
