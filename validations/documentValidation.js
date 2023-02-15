const { isEmptyArray } = require("../helpers/array");
const { ValidationError } = require("../helpers/error");
const { validateFields } = require("../helpers/validation");
const CATEGORY = ["road", "bridge"];

const validateDocumentDescriptions = ({ documents, descriptions }) => {
  const documentsLength = documents.length;
  const descriptionsLength = descriptions.length;
  if (documentsLength !== descriptionsLength) {
    throw new ValidationError({
      message: "The `documents` and `descriptions` must have same length.",
      errors: { documentsLength, descriptionsLength },
    });
  }
  let notSameNames = [];
  for (let i = 0; i < documents.length; i++) {
    const { originalname: documentName } = documents[i];
    const { file: fileName } = descriptions[i];
    if (documentName !== fileName) notSameNames.push({ documentName, file: fileName });
    if (notSameNames.length > 0) {
      throw new ValidationError({
        message: "The document's name is not the same as description's file.",
        errors: { notSameNames },
      });
    }
  }
};

const validateDescriptions = ({ descriptions }) => {
  const validationFields = {
    file: { type: "string", isRequired: true },
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

exports.validateBody = ({ documents, descriptions }) => {
  validateDocumentDescriptions({ documents, descriptions });
  validateDocuments({ documents });
  validateDescriptions({ descriptions });
};
