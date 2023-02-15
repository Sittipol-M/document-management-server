const { tryCatchWrapper } = require("../helpers/tryCatchWrapper");
const { insertDocuments } = require("../models/documentModel");
const { saveDocumentsFiles } = require("../services/documentService");
const {  validateBody } = require("../validations/documentValidation");

exports.uploadDocuments = tryCatchWrapper(async (req, res) => {
  const documents = req.files;
  const { descriptions } = req.body;
  validateBody({ documents, descriptions });
  const descriptionsWithPath = saveDocumentsFiles({ documents, descriptions });
  await insertDocuments({ documents: descriptionsWithPath });
  res.send({ success: true, message: "Upload documents success." });
});
