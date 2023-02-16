const mongoose = require("mongoose");
const { Schema } = mongoose;

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
