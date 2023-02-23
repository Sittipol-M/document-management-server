const { tryCatchWrapper } = require("../helpers/tryCatchWrapper");
const { insertDocuments, getDocumentsMongo, getDocumentMongo } = require("../models/documentsModel");
const { saveDocumentsFiles, setBufferPdfToDocument, updateDocumentData, getPdfFile } = require("../services/documentService");
const { validateUploadDocuments, validateGetDocumentFilters, validateUpdateData, validateFileExisted } = require("../validations/documentValidation");

exports.uploadDocuments = tryCatchWrapper(async (req, res) => {
  const documents = req.files;
  const { descriptions } = req.body;
  await validateUploadDocuments({ documents, descriptions });
  const descriptionsWithPath = saveDocumentsFiles({ documents, descriptions });
  await insertDocuments({ documents: descriptionsWithPath });
  res.send({ success: true, message: "Upload documents success." });
});

exports.getDocuments = tryCatchWrapper(async (req, res) => {
  let { category, searchWords } = req.query;
  validateGetDocumentFilters({ category, searchWords });
  const select = ["category ", "searchWords", "name"];
  const documents = await getDocumentsMongo({ filters: { category, searchWords }, select });
  res.send({ success: true, documents });
});

exports.getDocument = tryCatchWrapper(async (req, res) => {
  const { documentName } = req.params;
  const document = await getDocumentMongo({ name: documentName });
  validateFileExisted({ document });
  const { stat, buffer } = getPdfFile({ document });
  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Type", "application/pdf");
  res.send(buffer);
});

exports.updateDocument = tryCatchWrapper(async (req, res) => {
  const { _id, name, searchWords, category } = req.body;
  await validateUpdateData({ _id, name, searchWords, category });
  await updateDocumentData({ _id, name, searchWords, category });
  res.send({ success: true });
});

exports.downloadDocument = tryCatchWrapper(async (req, res) => {
  const { documentName } = req.params;
  const document = await getDocumentMongo({ name: documentName });
  validateFileExisted({ document });
  res.download(document.path);
});
