const mongoose = require("mongoose");
const { Schema } = mongoose;

const documentSchema = new Schema({
  file: {
    type: String,
    unique: [true, "Duplicate `file`"],
    required: [true, "require `file`"],
  },
  searchWords: [{ type: String }],
  uploadedDate: {
    type: Date,
    default: Date.now,
    require: [true, "require `uploadedDate`"],
  },
  category: {
    type: String,
    require: [true, "require `category`"],
  },
  path: {
    type: String,
    require: [true, "require `path`"],
  },
});

const Document = mongoose.model("Document", documentSchema);

const _ = require("lodash");
const { ValidationError } = require("../helpers/error");
const { isEmptyArray } = require("../helpers/array");

exports.insertDocuments = async ({ documents }) => {
  const files = documents.map((document) => document.file);
  const result = await Document.find({ file: { $in: files } });
  let existedFiles = [];
  if (!isEmptyArray(result)) {
    for (const document of documents) {
      const { file } = _.find(result, { file: document.file });
      if (file) existedFiles.push(file);
    }
  }
  if (existedFiles.length > 0) throw new ValidationError({ message: "Some file was uploaded before.", errors: { uploadedFiles: existedFiles } });
  const insertedDocuments = await Document.insertMany(documents);
  return insertedDocuments;
};
