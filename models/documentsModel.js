const mongoose = require("mongoose");
const { Schema } = mongoose;
const ObjectId = require("mongodb").ObjectId;

const documentSchema = new Schema({
  name: {
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

exports.insertDocuments = async ({ documents }) => {
  const insertedDocuments = await Document.insertMany(documents);
  return insertedDocuments;
};

exports.getDocumentsMongo = async ({ filters, select = [] }) => {
  if (!Array.isArray(select)) throw new Error("getDocumentsMongo() -> `select` must be string array");
  const { names, searchWords, category } = filters;
  let selectFields = "";
  let queryFilters = {};
  names ? (queryFilters = { ...queryFilters, name: { $in: names } }) : null;
  category ? (queryFilters = { ...queryFilters, category }) : null;
  searchWords ? (queryFilters = { ...queryFilters, searchWords: { $all: searchWords } }) : null;
  for (const eachSelect of select) selectFields = selectFields.concat(eachSelect + " ");
  const result = await Document.find(queryFilters).select(selectFields);
  return result;
};

exports.getDocumentMongo = async ({ _id, name }) => {
  let queryFilters = {};
  name ? (queryFilters = { ...queryFilters, name }) : null;
  _id ? (queryFilters = { ...queryFilters, _id: ObjectId(_id) }) : null;
  const result = await Document.findOne(queryFilters).lean();
  return result;
};

exports.updateDocumentMongo = async ({ _id, update }) => {
  let queryFilters = {};
  _id ? (queryFilters = { ...queryFilters, _id: ObjectId(_id) }) : null;
  const result = await Document.updateOne(queryFilters, update);
};
