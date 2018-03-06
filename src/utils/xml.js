const fs = require("fs");
const DOMParser = require("xmldom").DOMParser;

module.exports = {
  parseFile
};

/**
 * Parses the XML images.xml file.
 *
 * @returns {Object} Images data.
 */
function parseFile(fileName) {
  const data = fs.readFileSync(fileName);
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
      const wordValue = word.childNodes[0] && word.childNodes[0].data;

      if (wordValue) {
        wordArray.push({
          word: word.childNodes[0].data,
          languageCode: language.getAttribute("code"),
          typeCode: word.getAttribute("type")
        });
      }
    });
  });

  return wordArray;
}

/**
 * Converts a list into an array.
 *
 * @param {List} list List of elements to convert.
 * @returns {Array} Array created
 */
function toArray(list) {
  return Array.prototype.slice.apply(list);
}
