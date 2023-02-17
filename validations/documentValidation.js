const { isEmptyArray } = require("../helpers/array");
const { ValidationError } = require("../errors/ValidationError");
const CATEGORY_ENUMS = ["road", "bridge"];
const _ = require("lodash");
const { getDocuments } = require("../models/documentModel");
const { isInEnum } = require("../helpers/enum");

const validateNotEmpty = ({ documents, descriptions }) => {
  if (!documents || !descriptions) {
    throw new ValidationError({ message: "`documents` and `descriptions` is required", errors: { documents, descriptions } });
  }
  if (!Array.isArray(documents) || !Array.isArray(descriptions)) {
    throw new ValidationError({ message: "`documents` and `descriptions` must be an array", errors: { documents, descriptions } });
  }
  if (isEmptyArray(documents) || isEmptyArray(descriptions)) {
    throw new ValidationError({ message: "`documents` and `descriptions` is required", errors: { documents, descriptions } });
  }
};

const validateLengthBody = ({ documents, descriptions }) => {
  const documentsLength = documents.length;
  const descriptionsLength = descriptions.length;
  if (documentsLength !== descriptionsLength) {
    throw new ValidationError({
      message: "`documents` and `descriptions` must have same length.",
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
  for (let description of descriptions) {
    if (typeof description.name !== "string") throw new ValidationError({ message: "`description.name` must be string" });
    if (typeof description.category !== "string") throw new ValidationError({ message: "`description.category` must be string" });
    if (!isInEnum({ checkEnum: description.category, enums: CATEGORY_ENUMS }))
      throw new ValidationError({ message: "`description.category` must contains [" + CATEGORY_ENUMS.toString() + "]" });
    const searchWords = description.searchWords;
    if (!Array.isArray(searchWords) || isEmptyArray(searchWords)) {
      throw new ValidationError({ message: "`description.searchWords` must be array of string" });
    }
    for (const searchWord of searchWords) {
      if (typeof searchWord !== "string") throw new ValidationError({ message: "`description.searchWords` must be array of string" });
    }
  }
};

const validateMimeTypeDocuments = ({ documents }) => {
  let notPdfFiles = [];
  for (const { mimetype, originalname } of documents) {
    if (mimetype !== "application/pdf") notPdfFiles.push(originalname);
  }
  if (notPdfFiles.length > 0) throw new ValidationError({ message: "Some `documents` is not pdf.", errors: { notPdfFiles } });
};

const validateExistedDocuments = async ({ documents }) => {
  const names = documents.map((document) => document.originalname);
  const existedDocuments = await getDocuments({ filter: { names }, select: ["name"] });
  const existedNames = existedDocuments.map((existedDocument) => existedDocument.name);
  if (!isEmptyArray(existedDocuments)) {
    throw new ValidationError({ message: "The documents were existed.", errors: { existedDocuments: existedNames } });
  }
};

exports.validateUploadDocuments = async ({ documents, descriptions }) => {
  validateNotEmpty({ documents, descriptions });
  validateLengthBody({ documents, descriptions });
  validateMimeTypeDocuments({ documents });
  validateDescriptions({ descriptions });
  validateDocumentNames({ documents, descriptions });
  await validateExistedDocuments({ documents });
};
