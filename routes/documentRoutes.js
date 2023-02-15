const express = require("express");
const documentRouter = express.Router();
const multer = require("multer");
const upload = multer({ desc: "upload/" });
const { addDocuments, uploadDocuments } = require("../controllers/documentController");

documentRouter.post("/documents", upload.array("documents"), uploadDocuments);

module.exports = documentRouter;
