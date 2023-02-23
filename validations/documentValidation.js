const { isEmptyArray } = require("../helpers/array");
const { ValidationError } = require("../errors/ValidationError");
const CATEGORY_ENUMS = ["road", "bridge"];
const _ = require("lodash");
const { getDocumentsMongo } = require("../models/documentsModel");
const { isInEnum } = require("../helpers/enum");
const { getEnums } = require("../models/enumsModel");
const fs = require("fs");

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

const validateDescriptions = async ({ descriptions }) => {
  const results = await getEnums({ key: ["categoryEnums"] });
  const CATEGORY_ENUMS = results.find((result) => result.key === "categoryEnums").enums;
  for (let description of descriptions) {
    if (typeof description.name !== "string") throw new ValidationError({ message: "`description.name` must be string" });
    if (typeof description.category !== "string") throw new ValidationError({ message: "`description.category` must be string" });
    if (!isInEnum({ checkEnum: description.category, enums: CATEGORY_ENUMS })) {
      throw new ValidationError({ message: "`description.category` must contains [" + CATEGORY_ENUMS.toString() + "]" });
    }
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
  const existedDocuments = await getDocumentsMongo({ filters: { names }, select: ["name"] });
  const existedNames = existedDocuments.map((existedDocument) => existedDocument.name);
  if (!isEmptyArray(existedDocuments)) {
    throw new ValidationError({ message: "The documents were existed.", errors: { existedDocuments: existedNames } });
  }
};

exports.validateUploadDocuments = async ({ documents, descriptions }) => {
  validateNotEmpty({ documents, descriptions });
  validateLengthBody({ documents, descriptions });
  validateMimeTypeDocuments({ documents });
  await validateDescriptions({ descriptions });
  validateDocumentNames({ documents, descriptions });
  await validateExistedDocuments({ documents });
};

exports.validateGetDocumentFilters = ({ category, searchWords }) => {
  if (category && !isInEnum({ checkEnum: category, enums: CATEGORY_ENUMS }))
    throw new ValidationError({ message: "`category` must contains [" + CATEGORY_ENUMS.toString() + "]" });
  if (searchWords) {
    if (!Array.isArray(searchWords)) searchWords = [searchWords];
    for (const searchWord of searchWords) {
      if (typeof searchWord !== "string") throw new ValidationError({ message: "`searchWords` must be array of string" });
    }
  }
};

exports.validateFileExisted = ({ document }) => {
  if (!document || !fs.existsSync(document.path)) throw new ValidationError({ message: "file not found" });
};

exports.validateUpdateData = async ({ _id, name, searchWords, category }) => {
  const results = await getEnums({ key: ["categoryEnums"] });
  const CATEGORY_ENUMS = results.find((result) => result.key === "categoryEnums").enums;
  if (!_id || !name || !searchWords || !category) throw new ValidationError({ message: "`_id`, `name`, `searchWords` and `category` is required" });
  if (typeof name !== "string") throw new ValidationError({ message: "`name` must be string" });
  if (typeof category !== "string") throw new ValidationError({ message: "`category` must be string" });
  if (!isInEnum({ checkEnum: category, enums: CATEGORY_ENUMS })) {
    throw new ValidationError({ message: "`category` must contains [" + CATEGORY_ENUMS.toString() + "]" });
  }
  if (!Array.isArray(searchWords) || isEmptyArray(searchWords)) {
    throw new ValidationError({ message: "`searchWords` must be array of string" });
  }
  for (const searchWord of searchWords) {
    if (typeof searchWord !== "string") throw new ValidationError({ message: "`searchWords` must be array of string" });
  }
};
