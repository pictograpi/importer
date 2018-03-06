require("dotenv").config();
const path = require("path");
const firebaseAdmin = require("firebase-admin");
const logger = require("../utils/logger");
const account = require(path.resolve(process.env.FIREBASE_ACCOUNT_KEY));

module.exports = () => {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(account),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });

  logger.info("Database init");
};
