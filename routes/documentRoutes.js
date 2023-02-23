const express = require("express");
const documentRouter = express.Router();
const multer = require("multer");
const upload = multer({ desc: "upload/" });
const { getDocuments, uploadDocuments, getDocument, updateDocument, downloadDocument } = require("../controllers/documentController");

documentRouter.route("/documents").post(upload.array("documents"), uploadDocuments).get(getDocuments);

documentRouter.route("/documents/:documentName").get(getDocument).put(updateDocument);

documentRouter.route("/documents/:documentName/download").get(downloadDocument);

module.exports = documentRouter;
