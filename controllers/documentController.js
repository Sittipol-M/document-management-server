const { tryCatchWrapper } = require("../helpers/tryCatchWrapper");
const { createDocumentsDownloadLog, getDocumentsDownloadLog, getDocumentsDownloadLogMongo } = require("../models/documentDownloadLog");
const {
  insertDocuments,
  getDocumentsMongo,
  getDocumentMongo,
  deleteDocumentMongo,
  getCountCategoriesMongo,
  getDocumentsUploadLog,
  getDocumentsUploadLogMongo,
  getCountDocumentsMongo,
  getCountUploadMongo,
} = require("../models/documentsModel");
const {
  saveDocumentsFiles,
  updateDocumentData,
  getPdfFile,
  deleteFileFromDirectory,
  countCategoriesToRatio,
} = require("../services/documentService");
const {
  validateUploadDocuments,
  validateGetDocumentFilters,
  validateUpdateData,
  validateFileExisted,
  validateRecentDocumentDownload,
  validateRecentDocumentUpload,
  validateDate,
} = require("../validations/documentValidation");

exports.uploadDocuments = tryCatchWrapper(async (req, res) => {
  const documents = req.files;
  const { descriptions } = req.body;
  await validateUploadDocuments({ documents, descriptions });
  const descriptionsWithPath = saveDocumentsFiles({ documents, descriptions });
  await insertDocuments({ documents: descriptionsWithPath });
  res.send({ success: true, message: "Upload documents success." });
});

exports.getDocuments = tryCatchWrapper(async (req, res) => {
  let { category, searchWords, page, pageSize } = req.query;
  await validateGetDocumentFilters({ category, searchWords, page, pageSize });
  const select = ["category ", "searchWords", "name"];
  const skip = (page - 1) * pageSize;
  const documents = await getDocumentsMongo({ filters: { category, searchWords }, select, skip, limit: pageSize, sort: "name" });
  res.send({ success: true, length: documents.length, documents });
});

exports.previewDocument = tryCatchWrapper(async (req, res) => {
  const { documentName } = req.params;
  const document = await getDocumentMongo({ filters: { name: documentName } });
  validateFileExisted({ document });
  const { stat, buffer } = getPdfFile({ document });
  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Type", "application/pdf");
  res.send(buffer);
});

exports.updateDocument = tryCatchWrapper(async (req, res) => {
  const { _id, name, searchWords, category } = req.body;
  const document = await getDocumentMongo({ filters: { _id } });
  validateFileExisted({ document });
  await validateUpdateData({ _id, name, searchWords, category });
  await updateDocumentData({ _id, name, searchWords, category });
  res.send({ success: true });
});

exports.downloadDocument = tryCatchWrapper(async (req, res) => {
  const { documentName } = req.params;
  const document = await getDocumentMongo({ filters: { name: documentName } });
  validateFileExisted({ document });
  createDocumentsDownloadLog({ document });
  res.download(document.path);
});

exports.getDocument = tryCatchWrapper(async (req, res) => {
  const { documentName } = req.params;
  const document = await getDocumentMongo({ filters: { name: documentName } });
  validateFileExisted({ document });
  res.send({ success: true, document });
});

exports.deleteDocument = tryCatchWrapper(async (req, res) => {
  const { documentName } = req.params;
  const document = await getDocumentMongo({ filters: { name: documentName } });
  validateFileExisted({ document });
  deleteFileFromDirectory({ name: documentName, path: document.path });
  await deleteDocumentMongo({ name: documentName });
  res.send({ success: true, message: `delete ${documentName} success` });
});

exports.getDocumentsPercent = tryCatchWrapper(async (req, res) => {
  const countCategories = await getCountCategoriesMongo();
  const percent = countCategoriesToRatio({ countCategories });
  res.send({ success: true, percent });
});

exports.getRecentDocumentsDownload = tryCatchWrapper(async (req, res) => {
  const { numberOfRecent } = req.query;
  validateRecentDocumentDownload({ numberOfRecent });
  const downloadLogs = await getDocumentsDownloadLogMongo({ sort: { downloadedDate: -1 }, limit: numberOfRecent });
  res.send({ success: true, downloadLogs });
});

exports.getRecentDocumentsUpload = tryCatchWrapper(async (req, res) => {
  const { numberOfRecent } = req.query;
  validateRecentDocumentUpload({ numberOfRecent });
  const uploadLogs = await getDocumentsUploadLogMongo({ sort: { uploadedDate: -1, name: 1 }, limit: numberOfRecent });
  res.send({ success: true, uploadLogs });
});

exports.getCountDocuments = tryCatchWrapper(async (req, res) => {
  const { countDocuments } = await getCountDocumentsMongo();
  res.send({ success: true, count: countDocuments });
});

exports.getCountUpload = tryCatchWrapper(async (req, res) => {
  const { date } = req.query;
  validateDate({ date });
  const { count } = await getCountUploadMongo({ date });
  res.send({ success: true, count });
});
