const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;

const documentSchema = new Schema({
  name: {
    type: String,
    unique: [true, "Duplicate `file`"],
    required: [true, "require `file`"],
  },
  searchWords: { type: String },
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

exports.getDocumentsMongo = async ({ filters, select = [], skip, limit, sort }) => {
  if (!Array.isArray(select)) throw new Error("getDocumentsMongo() -> `select` must be string array");
  let { names, searchWords, category } = filters;
  let selectFields = "";
  let queryFilters = {};
  names ? (queryFilters = { ...queryFilters, name: { $in: names } }) : null;
  category ? (queryFilters = { ...queryFilters, category }) : null;
  if (searchWords) {
    let querySearchWords = [];
    searchWords = searchWords.split(" ");
    for (let searchWord of searchWords)
      querySearchWords.push({
        $or: [{ searchWords: { $regex: `${searchWord}`, $options: "i" } }, { name: { $regex: `${searchWord}`, $options: "i" } }],
      });
    queryFilters = { ...queryFilters, $and: querySearchWords };
  }
  for (const eachSelect of select) selectFields = selectFields.concat(eachSelect + " ");
  const result = await Document.find(queryFilters).select(selectFields).skip(skip).limit(limit).sort(sort);
  return result;
};

exports.getDocumentMongo = async ({ filters, select = [] }) => {
  const { _id, name } = filters;
  let queryFilters = {};
  name ? (queryFilters = { ...queryFilters, name }) : null;
  _id ? (queryFilters = { ...queryFilters, _id: ObjectId(_id) }) : null;
  const result = await Document.findOne(queryFilters).lean();
  return result;
};

exports.updateDocumentMongo = async ({ filters, update }) => {
  const { _id } = filters;
  let queryFilters = {};
  _id ? (queryFilters = { ...queryFilters, _id: ObjectId(_id) }) : null;
  const result = await Document.updateOne(queryFilters, update);
};

exports.deleteDocumentMongo = async ({ name }) => {
  const result = await Document.deleteOne({ name });
};

exports.getCountCategoriesMongo = async () => {
  const result = await Document.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $addFields: { category: "$_id" } },
    { $project: { _id: 0 } },
  ]);
  return result;
};

exports.getDocumentsUploadLogMongo = async ({ limit, sort }) => {
  const pipeline = [
    {
      $sort: sort,
    },
    {
      $limit: Number(limit),
    },
    {
      $project: {
        _id: 0,
        category: 1,
        uploadedDate: 1,
        name: 1,
      },
    },
  ];
  return await Document.aggregate(pipeline);
};

exports.getCountDocumentsMongo = async () => {
  const pipeline = [
    {
      $count: "countDocuments",
    },
  ];
  return (await Document.aggregate(pipeline))[0];
};

exports.getCountUploadMongo = async ({ date }) => {
  const startDay = moment(date).startOf("day").utcOffset(0).toISOString();
  const endDay = moment(date).endOf("day").utcOffset(0).toISOString();
  const pipeline = [
    {
      $match: {
        uploadedDate: { $gte: new Date(startDay), $lt: new Date(endDay) },
      },
    },
    {
      $count: "count",
    },
  ];
  return (await Document.aggregate(pipeline))[0];
};
