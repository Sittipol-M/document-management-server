const fs = require("fs");
const { ValidationError } = require("../errors/ValidationError");
const _ = require("lodash");
const { getDocument } = require("../controllers/documentController");
const { getDocumentMongo, updateDocumentMongo } = require("../models/documentsModel");

exports.saveDocumentsFiles = ({ documents, descriptions }) => {
  const writePath = process.env.DEFAULT_SAVE_PATH;

  let descriptionsWithPath = [];
  for (const description of descriptions) {
    const { name, category } = description;
    const { originalname, buffer } = _.find(documents, { originalname: name });
    const folderPath = `${writePath}${category}`;
    const filePath = `${folderPath}/${originalname}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
    fs.writeFileSync(filePath, buffer);
    descriptionsWithPath.push({ ...description, path: filePath });
  }
  return descriptionsWithPath || [];
};

exports.getPdfFile = ({ document }) => {
  const stat = fs.statSync(document.path);
  const buffer = fs.readFileSync(document.path);
  return { buffer, stat };
};

const changeCategoryFile = ({ name, prevPath, category }) => {
  const prevPathFile = fs.readFileSync(prevPath);
  const writePath = process.env.DEFAULT_SAVE_PATH;
  const folderPath = `${writePath}${category}`;
  const newFilePath = `${folderPath}/${name}`;
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  fs.writeFileSync(newFilePath, prevPathFile);
  fs.unlinkSync(prevPath);
  return newFilePath;
};

exports.updateDocumentData = async ({ _id, name, searchWords, category }) => {
  const prevDocument = await getDocumentMongo({ _id });
  let { category: prevCategory, path: prevPath } = prevDocument;
  let newPath;
  if (category !== prevCategory) newPath = changeCategoryFile({ name, prevPath, category });
  const newDocument = { name, searchWords, category, path: newPath ? newPath : prevPath };
  updateDocumentMongo({ _id, update: newDocument });
};
