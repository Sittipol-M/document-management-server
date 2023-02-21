const express = require("express");
const documentRouter = express.Router();
const multer = require("multer");
const upload = multer({ desc: "upload/" });
const { getDocuments, uploadDocuments } = require("../controllers/documentController");

documentRouter.route("/documents").post(upload.array("documents"), uploadDocuments).get(getDocuments);

module.exports = documentRouter;
