const express = require("express");
const documentRouter = express.Router();
const multer = require("multer");
const upload = multer({ desc: "upload/" });
const {
  getDocuments,
  uploadDocuments,
  getDocument,
  updateDocument,
  downloadDocument,
  previewDocument,
  deleteDocument,
  getDocumentsPercent,
  getRecentDocumentsDownload,
  getRecentDocumentsUpload,
  getCountDocuments,
  getCountUpload,
} = require("../controllers/documentController");

documentRouter.route("/documents").post(upload.array("documents"), uploadDocuments).get(getDocuments);

documentRouter.route("/documents/percent").get(getDocumentsPercent);

documentRouter.route("/documents/recent-download").get(getRecentDocumentsDownload);

documentRouter.route("/documents/recent-upload").get(getRecentDocumentsUpload);

documentRouter.route("/documents/upload/count").get(getCountUpload);

documentRouter.route("/documents/count").get(getCountDocuments);

documentRouter.route("/documents/:documentName").get(getDocument).put(updateDocument).delete(deleteDocument);

documentRouter.route("/documents/:documentName/preview").get(previewDocument);

documentRouter.route("/documents/:documentName/download").get(downloadDocument);

module.exports = documentRouter;
