const { isEmptyArray } = require("../helpers/array");
const { ValidationError } = require("../helpers/error");
const { validateFields } = require("../helpers/validation");
const CATEGORY = ["road", "bridge"];
const _ = require("lodash");
const { getDocuments } = require("../models/documentModel");

const validateLengthBody = ({ documents, descriptions }) => {
  const documentsLength = documents.length;
  const descriptionsLength = descriptions.length;
  if (documentsLength !== descriptionsLength) {
    throw new ValidationError({
      message: "The `documents` and `descriptions` must have same length.",
      errors: { documentsLength, descriptionsLength },
    });
  }
};

const validateDocumentNames = ({ documents, descriptions }) => {
  let notSameNames = [];
  for (let i = 0; i < documents.length; i++) {
    const { originalname: documentName } = documents[i];
    const { name: descriptionName } = descriptions[i];
    if (documentName !== descriptionName) notSameNames.push({ documentName, descriptionName });
    if (notSameNames.length > 0) {
      throw new ValidationError({
        message: "The document's name is not the same as description's name.",
        errors: { notSameNames },
      });
    }
  }
};

const validateDescriptions = ({ descriptions }) => {
  const validationFields = {
    name: { type: "string", isRequired: true },
    category: { type: "enum", isRequired: true, enums: CATEGORY },
    searchWords: { type: "array", isRequired: true, array: "string" },
  };
  if (!Array.isArray(descriptions)) throw new ValidationError({ message: "The `descriptions` must be array." });
  if (isEmptyArray(descriptions)) throw new ValidationError({ message: "The `descriptions` required." });
  validateFields({ validationFields, data: descriptions });
};

const validateDocuments = ({ documents }) => {
  if (!Array.isArray(documents)) throw new ValidationError({ message: "The `documents` should be array." });
  if (isEmptyArray(documents)) throw new ValidationError({ message: "The `documents` required." });
  let notPdfFiles = [];
  for (const { mimetype, originalname } of documents) {
    if (mimetype !== "application/pdf") notPdfFiles.push(originalname);
  }
  if (notPdfFiles.length > 0) throw new ValidationError({ message: "Some `documents` is not pdf.", errors: { notPdfFiles } });
};

const validateExistedDocuments = async ({ documents }) => {
  const names = documents.map((document) => document.originalname);
  const existedDocuments = await getDocuments({ names });
  const existedNames = existedDocuments.map((existedDocument) => existedDocument.name);
  if (!isEmptyArray(existedDocuments)) {
    throw new ValidationError({ message: "The documents were existed.", errors: { existedDocuments: existedNames } });
  }
};

exports.validateUploadDocuments = async ({ documents, descriptions }) => {
  validateLengthBody({ documents, descriptions });
  validateDocuments({ documents });
  validateDescriptions({ descriptions });
  validateDocumentNames({ documents, descriptions });
  await validateExistedDocuments({ documents });
};
